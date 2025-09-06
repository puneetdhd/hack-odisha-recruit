

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import mimetypes
import os

from voice_functions import InterviewVoiceMonitor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

voice_monitor = InterviewVoiceMonitor(similarity_threshold=0.75)

def get_audio_format_from_file(audio_file):
    """
    Determine audio format from file extension and MIME type
    """
    try:
        filename = audio_file.filename or ''
        file_ext = os.path.splitext(filename)[1].lower()
        
        mime_type = audio_file.content_type or ''
        
        format_map = {
            '.wav': 'wav',
            '.mp3': 'mp3', 
            '.flac': 'flac',
            '.ogg': 'ogg',
            '.m4a': 'm4a',
            '.aac': 'aac'
        }
        
        mime_map = {
            'audio/wav': 'wav',
            'audio/wave': 'wav',
            'audio/x-wav': 'wav',
            'audio/mpeg': 'mp3',
            'audio/mp3': 'mp3',
            'audio/flac': 'flac',
            'audio/ogg': 'ogg',
            'audio/mp4': 'm4a',
            'audio/x-m4a': 'm4a',
            'audio/aac': 'aac'
        }
        
        if file_ext in format_map:
            return format_map[file_ext]
        
        if mime_type in mime_map:
            return mime_map[mime_type]
        
        logger.warning(f"Unknown audio format for file: {filename}, MIME: {mime_type}, defaulting to wav")
        return 'wav'
        
    except Exception as e:
        logger.error(f"Error determining audio format: {str(e)}")
        return 'wav'

@app.route('/register-voice', methods=['POST'])
def register_voice():
    try:
        interview_id = request.form.get('interview_id')
        participant_id = request.form.get('participant_id')
        
        if not interview_id or not participant_id:
            return jsonify({
                'success': False, 
                'error': 'Missing interview_id or participant_id'
            }), 400
        
        if 'audio' not in request.files:
            return jsonify({'success': False, 'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'success': False, 'error': 'No audio file selected'}), 400
        
        audio_format = get_audio_format_from_file(audio_file)
        logger.info(f"Detected audio format: {audio_format}")
        
        audio_bytes = audio_file.read()
        if len(audio_bytes) == 0:
            return jsonify({'success': False, 'error': 'Empty audio file'}), 400
        
        logger.info(f"Processing audio registration - Interview: {interview_id}, "
                   f"Participant: {participant_id}, Size: {len(audio_bytes)} bytes")
        
        result = voice_monitor.start_interview_monitoring(
            interview_id, participant_id, audio_bytes, audio_format
        )
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in register_voice endpoint: {str(e)}")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500

@app.route('/verify-voice', methods=['POST'])
def verify_voice():
    try:
        interview_id = request.form.get('interview_id')
        participant_id = request.form.get('participant_id')
        
        if not interview_id or not participant_id:
            return jsonify({
                'success': False, 
                'error': 'Missing interview_id or participant_id'
            }), 400
        
        if 'audio' not in request.files:
            return jsonify({'success': False, 'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'success': False, 'error': 'No audio file selected'}), 400
        
        audio_format = get_audio_format_from_file(audio_file)
        
        audio_bytes = audio_file.read()
        if len(audio_bytes) == 0:
            return jsonify({'success': False, 'error': 'Empty audio file'}), 400
        
        logger.info(f"Processing voice verification - Interview: {interview_id}, "
                   f"Participant: {participant_id}, Size: {len(audio_bytes)} bytes")
        
        result = voice_monitor.check_voice_during_interview(
            interview_id, participant_id, audio_bytes, audio_format
        )
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in verify_voice endpoint: {str(e)}")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500

@app.route('/end-interview', methods=['POST'])
def end_interview():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No JSON data provided'}), 400
        
        interview_id = data.get('interview_id')
        if not interview_id:
            return jsonify({'success': False, 'error': 'Missing interview_id'}), 400
        
        logger.info(f"Ending interview: {interview_id}")
        result = voice_monitor.finish_interview_monitoring(interview_id)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in end_interview endpoint: {str(e)}")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500

@app.route('/interview-stats/<interview_id>', methods=['GET'])
def get_interview_stats(interview_id):
    try:
        if not interview_id:
            return jsonify({'success': False, 'error': 'Missing interview_id'}), 400
        
        logger.info(f"Getting stats for interview: {interview_id}")
        result = voice_monitor.get_interview_report(interview_id)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in get_interview_stats endpoint: {str(e)}")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'voice-verification',
        'active_interviews': len(voice_monitor.verifier.active_interviews)
    })

@app.route('/debug-audio', methods=['POST'])
def debug_audio():
    """Debug endpoint to check audio file properties"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        audio_format = get_audio_format_from_file(audio_file)
        audio_bytes = audio_file.read()
        
        return jsonify({
            'filename': audio_file.filename,
            'content_type': audio_file.content_type,
            'detected_format': audio_format,
            'file_size': len(audio_bytes),
            'has_data': len(audio_bytes) > 0
        })
    
    except Exception as e:
        logger.error(f"Error in debug_audio endpoint: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)