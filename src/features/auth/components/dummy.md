# Auth Components

인증 관련 UI 컴포넌트들을 포함합니다.

## 구현된 컴포넌트들:
- ✅ **LoginForm.tsx** - 로그인 폼 컴포넌트 (에러 처리, 로딩 상태 포함)
- ✅ **SignupForm.tsx** - 회원가입 폼 컴포넌트 (비밀번호 확인, 유효성 검사 포함)
- ✅ **index.ts** - 컴포넌트 exports

## 향후 추가 예정:
- SocialLoginButtons.tsx - SNS 로그인 버튼들
- PasswordInput.tsx - 비밀번호 입력 컴포넌트 (강도 표시기 등)
- EmailVerification.tsx - 이메일 인증 컴포넌트

## 컴포넌트 사용법:

### LoginForm
```tsx
import { LoginForm } from './LoginForm';

<LoginForm
  onLoginSuccess={() => router.replace('/')}
  onSignupPress={() => router.push('/auth/signup')}
  onGuestBrowse={() => router.replace('/?guest=1')}
/>
```

### SignupForm
```tsx
import { SignupForm } from './SignupForm';

<SignupForm
  onSignupSuccess={() => router.replace('/auth/login')}
  onLoginPress={() => router.push('/auth/login')}
/>
```

## 특징:
- **독립적인 상태 관리**: 각 폼이 자체 상태 관리
- **에러 처리**: 사용자 친화적 에러 메시지
- **로딩 상태**: 제출 중 UI 비활성화
- **유효성 검사**: 실시간 입력 검증
- **Entity 사용**: User entity 서비스 활용 