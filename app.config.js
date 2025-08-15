import 'dotenv/config';
import { config as dotEnvConfig } from 'dotenv';

// 환경(개발 | 테스트 | 프로덕션)에 따라 .env 파일 로드
const env = process.env.REACT_NATIVE_ENV || process.env.NODE_ENV || 'development';
dotEnvConfig({ path: `.env.${env}` });

export default ({ config }) => {
  return {
    ...config,
    extra: {
      FIGMA_PERSONAL_ACCESS_TOKEN: process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      // 필요 시 추가 환경변수 작성
    },
  };
};
