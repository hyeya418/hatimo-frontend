import React from 'react';
import { getKakaoLoginUrl } from '../api/auth';

const KakaoLoginButton = () => {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <button
      className="kakao-login-btn"
      onClick={handleKakaoLogin}
    >
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오 로그인"
        style={{ width: '24px', height: '24px' }}
      />
      카카오톡으로 로그인
    </button>
  );
};

export default KakaoLoginButton; 