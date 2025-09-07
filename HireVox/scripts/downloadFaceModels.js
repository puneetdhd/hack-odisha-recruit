const fs = require("fs");
const path = require("path");
const https = require("https");

const MODEL_URL =
  "https://github.com/justadudewhohacks/face-api.js/raw/master/weights";
const MODELS_DIR = path.join(__dirname, "..", "public", "models");

const MODELS = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
];

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

MODELS.forEach((model) => {
  const file = fs.createWriteStream(path.join(MODELS_DIR, model));
  https
    .get(`${MODEL_URL}/${model}`, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Downloaded ${model}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(path.join(MODELS_DIR, model));
      console.error(`Error downloading ${model}:`, err.message);
    });
});
