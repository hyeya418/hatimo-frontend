import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8090',  // ✅ 백엔드 API 주소 (Spring Boot 서버 주소)
  withCredentials: true,             // ✅ 요청에 쿠키 포함 (JWT를 HttpOnly 쿠키에 넣었기 때문)
});

export default api; 