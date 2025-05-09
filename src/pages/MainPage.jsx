// src/pages/MainPage.jsx
import React from 'react';
import './MainPage.css';
import hamster from '../assets/hamster.png'

const MainPage = () => {
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
      <button className="main-gradient-btn">감정 기록</button>
      <nav className="main-bottom-nav">
        <span className="nav-icon">📅</span>
        <span className="nav-icon active">🏠</span>
        <span className="nav-icon">⚙️</span>
      </nav>
    </div>
  );
};

export default MainPage;
