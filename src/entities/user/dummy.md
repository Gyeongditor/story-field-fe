# User Entity

사용자 도메인 모델과 관련 서비스들을 포함합니다.

## 구현된 파일들:
- ✅ **user.types.ts** - User 타입 정의 (interface, enum 등)
- ✅ **user.service.ts** - 사용자 관련 API 서비스
  - 로그인/로그아웃
  - 회원가입/탈퇴
  - 프로필 관리
  - 토큰 갱신
- ✅ **index.ts** - Entity exports

## 향후 추가 예정:
- user.model.ts - 사용자 비즈니스 로직 (복잡한 도메인 로직 시)
- user.constants.ts - 사용자 관련 상수들

## 사용 예시:

```typescript
import { loginUser, type LoginCredentials } from '../../entities/user';

const credentials: LoginCredentials = { email, password };
const { tokens, user } = await loginUser(credentials);
``` 