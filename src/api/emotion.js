import api from './axios';

// 감정 기록 생성
export const createEmotion = async (emotionRequest) => {
  // emotionRequest: { emotionCode, content, date }
  const response = await api.post('/api/emotions/create', emotionRequest);
  return response.data;
};

// 감정 코드 목록 불러오기
export const getEmotionCodes = async () => {
  const response = await api.get('/api/emotions/codes');
  return response.data;
}; 