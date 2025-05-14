import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleKakaoCallback } from '../api/auth';
import './KakaoCallback.css';

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      handleKakaoCallback(code)
        .then((response) => {
          console.log('로그인 성공:', response);
          // 로그인 성공 후 메인 페이지로 이동
          navigate('/');
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
          // 에러 페이지로 이동하거나 에러 메시지 표시
          navigate('/login-error');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallback; 