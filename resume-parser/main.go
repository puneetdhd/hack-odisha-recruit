package main

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/ledongthuc/pdf"
	"github.com/unidoc/unioffice/document"
	"gofr.dev/pkg/gofr"
)

// Config holds application configuration
type Config struct {
	MaxFileSize      int64
	AllowedFileTypes []string
}

// FileParser interface for different file type parsers
type FileParser interface {
	Parse(filePath string) (string, error)
	SupportedTypes() []string
}

// PDFParser handles PDF file parsing
type PDFParser struct{}

func (p *PDFParser) Parse(filePath string) (string, error) {
	file, reader, err := pdf.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open PDF: %w", err)
	}
	defer file.Close()

	var content strings.Builder
	for pageNum := 1; pageNum <= reader.NumPage(); pageNum++ {
		page := reader.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		text, err := page.GetPlainText(nil)
		if err != nil {
			continue
		}
		content.WriteString(text)
		content.WriteString("\n")
	}

	return content.String(), nil
}

func (p *PDFParser) SupportedTypes() []string {
	return []string{".pdf"}
}

// DOCXParser handles DOCX file parsing
type DOCXParser struct{}

func (d *DOCXParser) Parse(filePath string) (string, error) {
	doc, err := document.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open DOCX: %w", err)
	}
	defer doc.Close()

	var content strings.Builder
	for _, para := range doc.Paragraphs() {
		for _, run := range para.Runs() {
			content.WriteString(run.Text())
		}
		content.WriteString("\n")
	}

	return content.String(), nil
}

func (d *DOCXParser) SupportedTypes() []string {
	return []string{".docx", ".doc"}
}

// ResumeService handles resume processing logic
type ResumeService struct {
	config  *Config
	parsers map[string]FileParser
	app     *gofr.App
}

// NewResumeService creates a new resume service instance
func NewResumeService(config *Config, app *gofr.App) *ResumeService {
	service := &ResumeService{
		config:  config,
		parsers: make(map[string]FileParser),
		app:     app,
	}

	// Register parsers
	pdfParser := &PDFParser{}
	docxParser := &DOCXParser{}

	for _, ext := range pdfParser.SupportedTypes() {
		service.parsers[ext] = pdfParser
	}
	for _, ext := range docxParser.SupportedTypes() {
		service.parsers[ext] = docxParser
	}

	return service
}

// ParseResume parses a resume file into plain text
func (rs *ResumeService) ParseResume(ctx context.Context, filePath string) (string, error) {
	// Parse the file content
	content, err := rs.parseFile(filePath)
	if err != nil {
		rs.app.Logger().Error("Failed to parse file", "error", err, "file", filePath)
		return "", fmt.Errorf("file parsing failed: %w", err)
	}

	rs.app.Logger().Info("Resume parsed successfully", "file", filePath)
	return content, nil
}

// parseFile determines file type and parses accordingly
func (rs *ResumeService) parseFile(filePath string) (string, error) {
	ext := strings.ToLower(filepath.Ext(filePath))
	rs.app.Logger().Debug("Parsing file", "filePath", filePath, "extension", ext)
	if ext == "" {
		rs.app.Logger().Error("Invalid file path or no extension", "filePath", filePath)
		return "", fmt.Errorf("file has no extension or invalid file path: %s", filePath)
	}

	parser, exists := rs.parsers[ext]
	if !exists {
		rs.app.Logger().Error("No parser found for extension", "extension", ext)
		return "", fmt.Errorf("unsupported file type: %s", ext)
	}

	content, err := parser.Parse(filePath)
	if err != nil {
		rs.app.Logger().Error("Parser failed", "extension", ext, "error", err)
		return "", fmt.Errorf("failed to parse file: %w", err)
	}

	return content, nil
}

// ResumeHandler handles HTTP requests for resume processing
type ResumeHandler struct {
	service *ResumeService
	config  *Config
}

// NewResumeHandler creates a new resume handler
func NewResumeHandler(service *ResumeService, config *Config) *ResumeHandler {
	return &ResumeHandler{
		service: service,
		config:  config,
	}
}

type ResumeForm struct {
	Resume *multipart.FileHeader `form:"resume"`
}

// saveUploadedData saves the uploaded file to a temporary location and returns the file path
func (rh *ResumeHandler) saveUploadedData(file multipart.File, originalFilename string) (string, error) {
	// Get the original file extension
	ext := strings.ToLower(filepath.Ext(originalFilename))
	if ext == "" {
		return "", fmt.Errorf("original file has no extension: %s", originalFilename)
	}

	// Create a temporary file with the original extension
	tempFile, err := os.CreateTemp("", "resume_*"+ext)
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer tempFile.Close()

	// Copy the uploaded file data to the temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		return "", fmt.Errorf("failed to copy file data: %w", err)
	}

	// Return the absolute path to the temporary file
	return tempFile.Name(), nil
}

// UploadResume handles resume upload and processing
func (rh *ResumeHandler) UploadResume(ctx *gofr.Context) (interface{}, error) {
	// Bind multipart form data to a struct
	var form ResumeForm
	if err := ctx.Bind(&form); err != nil {
		ctx.Logger.Error("Failed to bind form data", "error", err)
		return nil, fmt.Errorf("failed to bind form data: %w", err)
	}

	// Check if the file was provided
	if form.Resume == nil {
		ctx.Logger.Error("No file provided in 'resume' field")
		return nil, fmt.Errorf("no file provided in 'resume' field")
	}

	// Log filename and form details for debugging
	ctx.Logger.Debug("Received file", "filename", form.Resume.Filename, "size", form.Resume.Size)

	// Validate file type from extension
	filename := form.Resume.Filename
	ext := strings.ToLower(filepath.Ext(filename))
	ctx.Logger.Debug("Extracted extension", "filename", filename, "extension", ext)
	if ext == "" {
		ctx.Logger.Error("Invalid filename or no extension", "filename", filename)
		return nil, fmt.Errorf("file has no extension or invalid filename: %s", filename)
	}

	// Log allowed file types for debugging
	ctx.Logger.Debug("Allowed file types", "types", rh.config.AllowedFileTypes)

	validType := false
	for _, allowedType := range rh.config.AllowedFileTypes {
		if ext == allowedType {
			validType = true
			break
		}
	}
	if !validType {
		ctx.Logger.Error("Unsupported file type", "extension", ext, "allowed", rh.config.AllowedFileTypes)
		return nil, fmt.Errorf("unsupported file type: %s. Allowed types: %v", ext, rh.config.AllowedFileTypes)
	}

	// Open the uploaded file
	file, err := form.Resume.Open()
	if err != nil {
		ctx.Logger.Error("Failed to open file", "error", err)
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Save to temp file
	tempFile, err := rh.saveUploadedData(file, filename)
	if err != nil {
		ctx.Logger.Error("Failed to save uploaded data", "error", err)
		return nil, fmt.Errorf("failed to save uploaded data: %w", err)
	}
	defer os.Remove(tempFile)

	// Log temporary file path
	ctx.Logger.Debug("Saved temporary file", "path", tempFile)

	// Parse resume with the service
	text, err := rh.service.ParseResume(ctx.Context, tempFile)
	if err != nil {
		ctx.Logger.Error("Failed to process resume", "error", err)
		return nil, fmt.Errorf("failed to process resume: %w", err)
	}

	// Return the extracted text
	return map[string]interface{}{
		"success": true,
		"text":    text,
		"message": "Resume converted to text successfully",
	}, nil
}

// HealthCheck provides health check endpoint
func (rh *ResumeHandler) HealthCheck(ctx *gofr.Context) (interface{}, error) {
	return map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"service":   "resume-parser",
	}, nil
}

// loadConfig loads application configuration
func loadConfig() *Config {
	cfg := &Config{
		MaxFileSize:      getEnvInt("MAX_FILE_SIZE", 10*1024*1024), // 10MB default
		AllowedFileTypes: strings.Split(getEnv("ALLOWED_FILE_TYPES", ".pdf,.docx,.doc"), ","),
	}
	// Log configuration for debugging
	fmt.Printf("Loaded config: AllowedFileTypes=%v\n", cfg.AllowedFileTypes)
	return cfg
}

// getEnv gets environment variable with default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvInt gets environment variable as integer with default value
func getEnvInt(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// setupRoutes configures application routes
func setupRoutes(app *gofr.App, handler *ResumeHandler) {
	// Health check endpoint
	app.GET("/health", handler.HealthCheck)

	// Resume processing endpoints
	app.POST("/api/v1/resume/upload", handler.UploadResume)

	// Add middleware for CORS
	app.UseMiddleware(func(inner http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			inner.ServeHTTP(w, r)
		})
	})
}

func main() {
	// Initialize GoFr application
	app := gofr.New()

	// Load configuration
	cfg := loadConfig()

	// Initialize services
	resumeService := NewResumeService(cfg, app)
	resumeHandler := NewResumeHandler(resumeService, cfg)

	// Setup routes
	setupRoutes(app, resumeHandler)

	// Log startup information
	app.Logger().Info("Resume Parser Service starting",
		"max_file_size", cfg.MaxFileSize,
		"allowed_types", cfg.AllowedFileTypes)

	// Start the server
	app.Run()
}
