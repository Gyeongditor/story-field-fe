# Node.js 20.14.0 버전 사용
FROM node:20.14.0-alpine

# pnpm 설치
RUN npm install -g pnpm@9.1.2

# Expo CLI 설치
RUN npm install -g @expo/cli

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 관련 파일들 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install

# 앱 소스코드 복사
COPY . .

# Expo 개발 서버 포트 노출
EXPOSE 8081

# Metro 번들러 포트 노출
EXPOSE 19000 19001 19002

# Expo 개발 서버 실행
CMD ["pnpm", "start"] 