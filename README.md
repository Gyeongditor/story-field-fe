# Story Field - AI 동화 생성 앱

React Native + Expo + TypeScript로 구축된 AI 기반 동화 생성 및 읽기 앱입니다.

## 🚀 기술 스택

### Core Frameworks
- **Expo** / **Expo Router** - 파일 기반 라우팅
- **React Native** - 크로스 플랫폼 모바일 앱
- **TypeScript** - 타입 안전성

### Styling
- **@emotion/native** - CSS-in-JS 스타일링

### Networking & State
- **axios** - HTTP 클라이언트
- **@tanstack/react-query** - API 캐싱 및 관리
- **zustand** - 전역 상태 관리

### Speech & Media
- **@react-native-community/voice** - 음성 인식 (STT)
- **expo-speech** - 기본 TTS
- **react-native-tts** - 커스텀 음성 모델
- **expo-camera** - 카메라 접근
- **expo-location** - 위치 서비스
- **expo-av** - 오디오/비디오 재생

### Animation & Gesture
- **react-native-reanimated** - 고성능 애니메이션
- **react-native-gesture-handler** - 제스처 처리
- **lottie-react-native** - Lottie 애니메이션

## 📁 폴더 구조 (FSD 기반)

```
src/
├── app/                     # Expo Router 파일시스템 라우팅
│   ├── _layout.tsx         # 전역 레이아웃
│   ├── index.tsx           # 홈 화면
│   ├── auth/               # 인증 관련 페이지
│   └── stories/            # 스토리 관련 페이지
├── shared/                 # 공통 모듈
│   ├── ui/                # UI 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   └── lib/               # 유틸리티
├── entities/              # 도메인 모델
│   ├── user/              # 사용자 관련
│   └── story/             # 스토리 관련
├── features/              # 기능 단위
│   ├── auth/              # 인증
│   ├── storyCreation/     # 동화 생성
│   ├── storyReader/       # 동화 읽기
│   └── ...                # 기타 기능들
└── widgets/               # 복합 UI 컴포넌트
```

## 🛠️ 개발 환경 설정

### 로컬 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm start

# 플랫폼별 실행
pnpm run android
pnpm run ios
pnpm run web
```

### Docker 개발 환경

```bash
# Docker 컨테이너 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d
```

## 📱 주요 기능

- 🎤 **음성 입력 동화 생성** - STT를 통한 음성→텍스트 변환
- 🎨 **AI 삽화 생성** - 프롬프트 기반 이미지 자동 생성
- 🔊 **다양한 음성 재생** - 가족 목소리, 연예인 음성 등
- 🗣️ **음성 클로닝** - 사용자 음성 학습 및 재생
- 🌏 **사투리 변환** - 지역별 사투리로 동화 변환
- 📚 **스토리 라이브러리** - 생성한 동화 관리 및 검색
- 🎵 **음향 효과** - 배경음악 및 효과음
- 📤 **공유 기능** - SNS 공유, PDF 내보내기

## 🌐 환경 변수

```bash
# .env.local 파일 생성
EXPO_PUBLIC_API_URL=https://your-api-server.com
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key
```

## 📦 주요 명령어

```bash
# 개발 서버 시작
pnpm start

# 타입 체크
pnpm run type-check

# 빌드 (프로덕션)
pnpm run build

# Docker 환경
docker-compose up
docker-compose down
```

## 🚀 배포

### EAS Build (Expo Application Services)

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 프로젝트 설정
eas build:configure

# 빌드 실행
eas build --platform all
```

## 🤝 개발 가이드

1. **브랜치 전략**: GitFlow 사용
2. **커밋 메시지**: Conventional Commits 규칙 준수
3. **코드 스타일**: ESLint + Prettier 설정 준수
4. **타입 안전성**: TypeScript strict 모드 사용

## 📄 라이선스

MIT License 