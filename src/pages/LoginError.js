import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginError.css';

const LoginError = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1 className="error-title">로그인 실패</h1>
      <p className="error-message">
        죄송합니다. 로그인 처리 중 문제가 발생했습니다.<br />
        다시 시도해 주시기 바랍니다.
      </p>
      <button
        className="home-button"
        onClick={() => navigate('/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default LoginError; 