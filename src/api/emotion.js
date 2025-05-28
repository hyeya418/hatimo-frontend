import api from './axios';

// 감정 기록 생성
export const createEmotion = async (emotionRequest) => {
  // emotionRequest: { emotionCode, content, date }
  const response = await api.post('/api/emotions/record', emotionRequest);
  return response.data;
};

// 감정 코드 목록 불러오기
export const getEmotionCodes = async () => {
  const response = await api.get('/api/emotions/codes');
  return response.data;
};

// 일일 감정 조회
export const getDailyEmotion = async (date) => {
  const response = await api.get(`/api/emotions/daily?date=${date}`);
  return response.data;
};

// 월별 감정 조회 (캘린더용)
export const getMonthlyEmotions = async (year, month) => {
  const response = await api.get(`/api/emotions/calendar?year=${year}&month=${month}`);
  return response.data;
};

// 감정 응답 조회
export const getEmotionResponse = async (emotionId) => {
  const response = await api.get(`/api/emotions/${emotionId}/response`);
  return response.data;
}; 