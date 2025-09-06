import numpy as np
import librosa
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import kurtosis, skew
import logging
from typing import Optional, Dict, List, Tuple
import io
import soundfile as sf
import tempfile
import os

logger = logging.getLogger(__name__)

class RealTimeVoiceProcessor:
    """Process audio data in real-time without file storage"""
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
    
    def process_audio_bytes(self, audio_bytes: bytes, audio_format: str = 'wav') -> Optional[np.ndarray]:
        """
        Process audio from bytes without saving to disk
        
        Args:
            audio_bytes: Raw audio data as bytes
            audio_format: Audio format ('wav', 'mp3', etc.)
            
        Returns:
            Processed audio array or None if processing fails
        """
        try:
            logger.info(f"Processing audio bytes: {len(audio_bytes)} bytes, format: {audio_format}")
            
            if len(audio_bytes) < 44:
                logger.error(f"Audio data too small: {len(audio_bytes)} bytes")
                return None
            
            actual_format = self._detect_audio_format(audio_bytes)
            if actual_format != audio_format:
                logger.info(f"Format mismatch: claimed {audio_format}, detected {actual_format}")
                audio_format = actual_format
            
            try:
                audio = self._process_with_tempfile(audio_bytes, audio_format)
                if audio is not None:
                    return self._post_process_audio(audio)
            except Exception as e:
                logger.warning(f"Tempfile method failed: {str(e)}")
            
            try:
                audio = self._process_raw_audio(audio_bytes)
                if audio is not None:
                    return self._post_process_audio(audio)
            except Exception as e:
                logger.warning(f"Raw audio processing failed: {str(e)}")
            
            try:
                audio = self._process_with_librosa(audio_bytes)
                if audio is not None:
                    return self._post_process_audio(audio)
            except Exception as e:
                logger.warning(f"Librosa BytesIO method failed: {str(e)}")
            
            try:
                audio = self._process_with_soundfile(audio_bytes)
                if audio is not None:
                    return self._post_process_audio(audio)
            except Exception as e:
                logger.warning(f"Soundfile method failed: {str(e)}")
            
            logger.error("All audio processing methods failed")
            return None
            
        except Exception as e:
            logger.error(f"Error processing audio bytes: {str(e)}")
            return None
    
    def _detect_audio_format(self, audio_bytes: bytes) -> str:
        """Detect audio format from magic bytes"""
        try:
            if len(audio_bytes) < 12:
                return 'wav'
            
            header = audio_bytes[:12]
            
            if header[:4] == b'RIFF' and header[8:12] == b'WAVE':
                return 'wav'
            elif header[:3] == b'ID3' or header[:2] == b'\xff\xfb':
                return 'mp3'
            elif header[:4] == b'fLaC':
                return 'flac'
            elif header[:4] == b'OggS':
                return 'ogg'
            elif b'ftyp' in header[:12]:
                return 'm4a'
            else:
                logger.warning(f"Unknown format, header: {header}")
                return 'wav'  
                
        except Exception as e:
            logger.error(f"Error detecting format: {str(e)}")
            return 'wav'
    
    def _process_raw_audio(self, audio_bytes: bytes) -> Optional[np.ndarray]:
        """Try to process as raw audio data"""
        try:
            if len(audio_bytes) < 44: 
                return None
            
            pcm_data = audio_bytes[44:] 
            
            audio = np.frombuffer(pcm_data, dtype=np.int16).astype(np.float32)
            
            audio = audio / 32768.0
            
            if len(audio) % 2 == 0:
                try:
                    stereo = audio.reshape(-1, 2)
                    audio = np.mean(stereo, axis=1)
                except:
                    pass  
            
            logger.info(f"Raw audio processing successful: {len(audio)} samples")
            return audio
            
        except Exception as e:
            logger.error(f"Raw audio processing failed: {str(e)}")
            return None
    
    def _process_with_tempfile(self, audio_bytes: bytes, audio_format: str) -> Optional[np.ndarray]:
        """Process audio using temporary file (most reliable method)"""
        temp_file = None
        try:
            suffix = f'.{audio_format.lower()}'
            if suffix not in ['.wav', '.mp3', '.flac', '.ogg', '.m4a']:
                suffix = '.wav'  
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_file.write(audio_bytes)
                temp_file.flush()
                
                audio, sr = librosa.load(temp_file.name, sr=self.sample_rate, mono=True)
                
            if temp_file:
                os.unlink(temp_file.name)
            
            return audio
            
        except Exception as e:
            if temp_file and os.path.exists(temp_file.name):
                try:
                    os.unlink(temp_file.name)
                except:
                    pass
            raise e
    
    def _process_with_librosa(self, audio_bytes: bytes) -> Optional[np.ndarray]:
        """Process audio using librosa with BytesIO"""
        audio_buffer = io.BytesIO(audio_bytes)
        audio, sr = librosa.load(audio_buffer, sr=self.sample_rate, mono=True)
        return audio
    
    def _process_with_soundfile(self, audio_bytes: bytes) -> Optional[np.ndarray]:
        """Process audio using soundfile with BytesIO"""
        audio_buffer = io.BytesIO(audio_bytes)
        audio, sr = sf.read(audio_buffer, dtype=np.float32)
        
        # Resample if necessary
        if sr != self.sample_rate:
            audio = librosa.resample(audio, orig_sr=sr, target_sr=self.sample_rate)
        
        if audio.ndim > 1:
            audio = np.mean(audio, axis=1)
            
        return audio
    
    def _post_process_audio(self, audio: np.ndarray) -> np.ndarray:
        """Apply post-processing to audio"""
        audio = self._trim_silence(audio)
        audio = self._normalize_audio(audio)
        audio = self._preemphasis(audio)
        
        min_samples = int(self.sample_rate * 0.5)
        if len(audio) < min_samples:
            audio = self._pad_audio(audio, min_samples)
        
        logger.info(f"Processed audio: {len(audio)} samples, {len(audio)/self.sample_rate:.2f} seconds")
        return audio
    
    def _trim_silence(self, audio: np.ndarray, top_db: int = 30) -> np.ndarray:
        """Remove silence from beginning and end"""
        try:
            audio_trimmed, _ = librosa.effects.trim(audio, top_db=top_db)
            return audio_trimmed if len(audio_trimmed) > 0 else audio
        except:
            return audio
    
    def _normalize_audio(self, audio: np.ndarray) -> np.ndarray:
        """Normalize audio to [-1, 1] range"""
        if np.max(np.abs(audio)) > 0:
            return audio / np.max(np.abs(audio))
        return audio
    
    def _preemphasis(self, audio: np.ndarray, coeff: float = 0.97) -> np.ndarray:
        """Apply pre-emphasis filter"""
        return np.append(audio[0], audio[1:] - coeff * audio[:-1])
    
    def _pad_audio(self, audio: np.ndarray, min_length: int) -> np.ndarray:
        """Pad audio to minimum length"""
        if len(audio) >= min_length:
            return audio
        pad_length = min_length - len(audio)
        return np.pad(audio, (0, pad_length), mode='constant', constant_values=0)


class RealTimeFeatureExtractor:
    """Extract voice features for real-time comparison"""
    
    def __init__(self, sample_rate: int = 16000, n_mfcc: int = 13):
        self.sample_rate = sample_rate
        self.n_mfcc = n_mfcc
    
    def extract_features(self, audio: np.ndarray) -> Optional[np.ndarray]:
        """
        Extract comprehensive voice features from audio
        
        Args:
            audio: Audio signal array
            
        Returns:
            Feature vector or None if extraction fails
        """
        try:
            if len(audio) == 0:
                logger.error("Empty audio array provided")
                return None
                
            features = []
            
            mfcc_features = self._extract_mfcc_stats(audio)
            if mfcc_features is not None:
                features.extend(mfcc_features)
            
            spectral_features = self._extract_spectral_features(audio)
            if spectral_features is not None:
                features.extend(spectral_features)
            
            pitch_features = self._extract_pitch_features(audio)
            if pitch_features is not None:
                features.extend(pitch_features)
            
            if not features:
                logger.error("No features extracted")
                return None
            
            feature_vector = np.array(features)
            feature_vector = np.nan_to_num(feature_vector, nan=0.0, posinf=1.0, neginf=-1.0)
            
            logger.info(f"Extracted {len(feature_vector)} features")
            return feature_vector
            
        except Exception as e:
            logger.error(f"Error extracting features: {str(e)}")
            return None
    
    def _extract_mfcc_stats(self, audio: np.ndarray) -> Optional[List[float]]:
        """Extract MFCC statistical features"""
        try:
            mfccs = librosa.feature.mfcc(y=audio, sr=self.sample_rate, n_mfcc=self.n_mfcc)
            delta_mfccs = librosa.feature.delta(mfccs)
            
            features = []
            for coeff_set in [mfccs, delta_mfccs]:
                features.extend(np.mean(coeff_set, axis=1))
                features.extend(np.std(coeff_set, axis=1))
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting MFCC features: {str(e)}")
            return None
    
    def _extract_spectral_features(self, audio: np.ndarray) -> Optional[List[float]]:
        """Extract key spectral features"""
        try:
            features = []
            
            centroid = librosa.feature.spectral_centroid(y=audio, sr=self.sample_rate)[0]
            features.extend([np.mean(centroid), np.std(centroid)])
            
            # Zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(audio)[0]
            features.extend([np.mean(zcr), np.std(zcr)])
            
            # RMS energy
            rms = librosa.feature.rms(y=audio)[0]
            features.extend([np.mean(rms), np.std(rms)])
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting spectral features: {str(e)}")
            return None
    
    def _extract_pitch_features(self, audio: np.ndarray) -> Optional[List[float]]:
        """Extract pitch-related features"""
        try:
            # Fundamental frequency estimation
            f0, voiced_flag, _ = librosa.pyin(
                audio,
                fmin=80,
                fmax=400,
                sr=self.sample_rate
            )
            
            # Remove unvoiced frames
            f0_voiced = f0[voiced_flag]
            
            if len(f0_voiced) > 0:
                features = [
                    np.mean(f0_voiced),
                    np.std(f0_voiced),
                    np.median(f0_voiced)
                ]
            else:
                features = [0, 0, 0]  # No voiced segments
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting pitch features: {str(e)}")
            return [0, 0, 0]


class RealTimeVoiceVerifier:
    """Main class for real-time voice verification"""
    
    def __init__(self, similarity_threshold: float = 0.75):
        self.audio_processor = RealTimeVoiceProcessor()
        self.feature_extractor = RealTimeFeatureExtractor()
        self.similarity_threshold = similarity_threshold
        self.registered_voices = {}  # In-memory storage
        self.active_interviews = {}  # Track active interviews
        
    def register_voice_for_interview(self, interview_id: str, user_id: str, audio_bytes: bytes, audio_format: str = 'wav') -> Dict:
        """
        Register a voice for a specific interview session
        
        Args:
            interview_id: Unique interview identifier
            user_id: User identifier
            audio_bytes: Audio data as bytes
            audio_format: Audio format (wav, mp3, etc.)
            
        Returns:
            Registration result dictionary
        """
        try:
            logger.info(f"Registering voice for interview {interview_id}, user {user_id}")
            
            # Process audio
            processed_audio = self.audio_processor.process_audio_bytes(audio_bytes, audio_format)
            if processed_audio is None:
                return {'success': False, 'error': 'Failed to process audio'}
            
            # Extract features
            features = self.feature_extractor.extract_features(processed_audio)
            if features is None:
                return {'success': False, 'error': 'Failed to extract features'}
            
            # Store voice profile for this interview
            if interview_id not in self.registered_voices:
                self.registered_voices[interview_id] = {}
            
            self.registered_voices[interview_id][user_id] = {
                'features': features,
                'audio_length': len(processed_audio) / self.audio_processor.sample_rate
            }
            
            # Initialize interview session
            if interview_id not in self.active_interviews:
                self.active_interviews[interview_id] = {
                    'user_id': user_id,
                    'verification_count': 0,
                    'positive_matches': 0,
                    'violations': []
                }
            
            logger.info(f"Voice registered successfully for interview {interview_id}, user {user_id}")
            
            return {
                'success': True,
                'message': 'Voice registered successfully',
                'features_count': len(features),
                'audio_length': len(processed_audio) / self.audio_processor.sample_rate
            }
            
        except Exception as e:
            logger.error(f"Error registering voice: {str(e)}")
            return {'success': False, 'error': f'Internal error during registration: {str(e)}'}
    
    def verify_voice_realtime(self, interview_id: str, user_id: str, audio_bytes: bytes, audio_format: str = 'wav') -> Dict:
        """
        Verify voice in real-time during interview
        
        Args:
            interview_id: Interview identifier
            user_id: Expected user identifier
            audio_bytes: Current audio data as bytes
            audio_format: Audio format (wav, mp3, etc.)
            
        Returns:
            Verification result dictionary
        """
        try:
            logger.info(f"Verifying voice for interview {interview_id}, user {user_id}")
            
            # Check if voice is registered for this interview
            if interview_id not in self.registered_voices or user_id not in self.registered_voices[interview_id]:
                return {'success': False, 'error': 'Voice not registered for this interview'}
            
            # Process current audio
            processed_audio = self.audio_processor.process_audio_bytes(audio_bytes, audio_format)
            if processed_audio is None:
                return {'success': False, 'error': 'Failed to process audio'}
            
            # Extract features from current audio
            current_features = self.feature_extractor.extract_features(processed_audio)
            if current_features is None:
                return {'success': False, 'error': 'Failed to extract features'}
            
            # Get registered features
            registered_features = self.registered_voices[interview_id][user_id]['features']
            
            # Calculate similarity
            similarity_score = self._calculate_similarity(registered_features, current_features)
            
            # Determine if voice matches
            is_match = similarity_score >= self.similarity_threshold
            
            # Update interview statistics
            if interview_id in self.active_interviews:
                session = self.active_interviews[interview_id]
                session['verification_count'] += 1
                if is_match:
                    session['positive_matches'] += 1
                else:
                    # Log potential violation
                    session['violations'].append({
                        'timestamp': len(session['violations']) + 1,
                        'similarity_score': similarity_score,
                        'expected_user': user_id
                    })
            
            # Determine alert level
            alert_level = 'normal'
            if not is_match:
                if similarity_score < 0.5:
                    alert_level = 'high'  # Very different voice
                else:
                    alert_level = 'medium'  # Somewhat different voice
            
            result = {
                'success': True,
                'is_match': is_match,
                'confidence': float(similarity_score),
                'threshold': self.similarity_threshold,
                'alert_level': alert_level,
                'verification_count': self.active_interviews[interview_id]['verification_count'] if interview_id in self.active_interviews else 1
            }
            
            # Add warning for multiple failures
            if interview_id in self.active_interviews:
                session = self.active_interviews[interview_id]
                if len(session['violations']) >= 3:
                    result['warning'] = f"Multiple voice violations detected ({len(session['violations'])})"
            
            logger.info(f"Voice verification - Interview: {interview_id}, Match: {is_match}, "
                       f"Confidence: {similarity_score:.3f}, Alert: {alert_level}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error in real-time verification: {str(e)}")
            return {'success': False, 'error': f'Internal error during verification: {str(e)}'}
    
    def _calculate_similarity(self, ref_features: np.ndarray, test_features: np.ndarray) -> float:
        """Calculate similarity between two feature vectors"""
        try:
            # Ensure same dimensions
            min_len = min(len(ref_features), len(test_features))
            ref_features = ref_features[:min_len].reshape(1, -1)
            test_features = test_features[:min_len].reshape(1, -1)
            
            # Normalize features
            ref_norm = ref_features / (np.linalg.norm(ref_features) + 1e-8)
            test_norm = test_features / (np.linalg.norm(test_features) + 1e-8)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(ref_norm, test_norm)[0, 0]
            
            # Convert from [-1, 1] to [0, 1]
            return (similarity + 1) / 2
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            return 0.0
    
    def get_interview_stats(self, interview_id: str) -> Dict:
        """Get statistics for an interview session"""
        if interview_id not in self.active_interviews:
            return {'error': 'Interview not found'}
        
        session = self.active_interviews[interview_id]
        match_rate = (session['positive_matches'] / session['verification_count'] 
                     if session['verification_count'] > 0 else 0)
        
        return {
            'interview_id': interview_id,
            'total_verifications': session['verification_count'],
            'positive_matches': session['positive_matches'],
            'match_rate': match_rate,
            'violations_count': len(session['violations']),
            'violations': session['violations']
        }
    
    def end_interview(self, interview_id: str) -> Dict:
        """Clean up interview session"""
        try:
            # Get final stats
            stats = self.get_interview_stats(interview_id)
            
            # Clean up memory
            if interview_id in self.registered_voices:
                del self.registered_voices[interview_id]
            if interview_id in self.active_interviews:
                del self.active_interviews[interview_id]
            
            logger.info(f"Interview {interview_id} ended and cleaned up")
            
            return {
                'success': True,
                'message': 'Interview ended successfully',
                'final_stats': stats
            }
            
        except Exception as e:
            logger.error(f"Error ending interview: {str(e)}")
            return {'success': False, 'error': 'Error cleaning up interview session'}


# Example usage class for integration
class InterviewVoiceMonitor:
    """
    Integration class for interview platforms
    """
    
    def __init__(self, similarity_threshold: float = 0.75):
        self.verifier = RealTimeVoiceVerifier(similarity_threshold)
    
    def start_interview_monitoring(self, interview_id: str, participant_id: str, 
                                 registration_audio: bytes, audio_format: str = 'wav') -> Dict:
        """
        Start voice monitoring for an interview
        
        Args:
            interview_id: Unique interview identifier
            participant_id: Interview participant ID
            registration_audio: Audio sample for voice registration (bytes)
            audio_format: Audio format (wav, mp3, etc.)
            
        Returns:
            Setup result
        """
        return self.verifier.register_voice_for_interview(
            interview_id, participant_id, registration_audio, audio_format
        )
    
    def check_voice_during_interview(self, interview_id: str, participant_id: str, 
                                   current_audio: bytes, audio_format: str = 'wav') -> Dict:
        """
        Check if current speaker matches registered voice
        
        Args:
            interview_id: Interview identifier
            participant_id: Expected participant ID
            current_audio: Current audio sample (bytes)
            audio_format: Audio format (wav, mp3, etc.)
            
        Returns:
            Verification result with alert information
        """
        return self.verifier.verify_voice_realtime(
            interview_id, participant_id, current_audio, audio_format
        )
    
    def get_interview_report(self, interview_id: str) -> Dict:
        """Get comprehensive report for interview"""
        return self.verifier.get_interview_stats(interview_id)
    
    def finish_interview_monitoring(self, interview_id: str) -> Dict:
        """End monitoring and cleanup"""
        return self.verifier.end_interview(interview_id)