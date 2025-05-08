import api from './axios';

// 카카오 로그인 콜백 처리
export const handleKakaoCallback = async (code) => {
  try {
    const response = await api.get(`/auth/kakao/callback?code=${code}`);
    return response.data;
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    throw error;
  }
};

// 카카오 로그인 URL 생성
export const getKakaoLoginUrl = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  
  return `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile_nickname profile_image`;
}; 