"""
توليد الصوت من النص.
يمكن استخدام مكتبة gTTS أو خدمة مثل ElevenLabs.
"""
from gtts import gTTS
import uuid

def generate_voice_for_text(text):
    tts = gTTS(text, lang='ar')
    voice_path = f"media/slides/voices/{uuid.uuid4()}.mp3"
    tts.save(voice_path)
    return voice_path