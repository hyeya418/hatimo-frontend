// src/pages/MainPage.jsx
import React from 'react';
import './MainPage.css';
import hamster from '../assets/hamster.png'
import { useNavigate } from 'react-router-dom';
import MainBottomNav from '../components/MainBottomNav';

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className="main-content">
      <div className="star-bg"></div>
      <div className="main-greeting">
        <h2>안녕! 난 하티모.</h2>
        <p>
          쿠키 굽는걸 좋아하는 햄쥐야.<br />
          오늘의 감정을 기록하면 하트쿠키를 구워줄게~
        </p>
      </div>
      <img
        src={hamster}
        alt="햄스터"
        className="main-hamster"
      />
      <button className="main-gradient-btn" onClick={() => navigate('/emotion-select')}>감정 기록</button>
      <MainBottomNav active="home" />
    </div>
  );
};

export default MainPage;
