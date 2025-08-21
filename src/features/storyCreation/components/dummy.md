# Story Creation Components

동화 생성 관련 UI 컴포넌트들을 포함합니다.

## 예정된 컴포넌트들:
- StoryForm.tsx - 텍스트 + STT 입력 폼
- SpeechInput.tsx - 음성 인식 버튼/UI

## 구현된 컴포넌트들:
- ✅ **StoryForm.tsx** - 텍스트 입력 폼 (2단계: 기본정보 → 옵션선택)
- ✅ **SpeechInput.tsx** - 음성 인식 버튼/UI (녹음 → STT 변환)
- ✅ **GeneratingScreen.tsx** - 동화 생성 진행 화면 (10초 프로그레스바)

## 향후 추가 예정:
- StoryPreview.tsx - 생성된 동화 미리보기
- CharacterSelector.tsx - 등장인물 설정
- GenreSelector.tsx - 장르 선택
- LengthSelector.tsx - 동화 길이 설정

## 컴포넌트 사용법:

### StoryForm
```tsx
import { StoryForm, StoryFormData } from './StoryForm';

<StoryForm
  initialVoiceText="음성에서 변환된 텍스트"
  onCancel={() => router.back()}
  onComplete={(data: StoryFormData) => {
    // 폼 완료 처리
  }}
/>
```

### SpeechInput
```tsx
import SpeechInput from './SpeechInput';

<SpeechInput
  onCancel={() => router.back()}
  onComplete={(text: string) => {
    // STT 완료 텍스트 처리
  }}
/>
```

### GeneratingScreen
```tsx
import GeneratingScreen from './GeneratingScreen';

<GeneratingScreen
  storyData={formData}
  onComplete={(storyId) => router.push(`/stories/${storyId}`)}
  onError={() => router.back()}
/>
``` 