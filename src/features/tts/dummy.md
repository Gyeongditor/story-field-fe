# TTS (Text-to-Speech) Feature

기본 음성 합성 기능을 포함합니다.

## 예정된 파일들:
- components/
  - VoiceSettings.tsx - 음성 설정 (속도, 톤 등)
  - PlaybackControls.tsx - 재생 컨트롤
- tts.api.ts - TTS API 호출
- tts.slice.ts - TTS 상태 관리
- tts.service.ts - expo-speech 래퍼 