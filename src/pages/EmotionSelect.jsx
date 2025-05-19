import React from 'react';
import './EmotionSelect.css';
import { useNavigate } from 'react-router-dom';
import heartYellow from '../assets/emotion-heart-yellow.png';
import heartOrange from '../assets/emotion-heart-orange.png';
import heartGreen from '../assets/emotion-heart-green.png';
import heartRed from '../assets/emotion-heart-red.png';
import heartBlue from '../assets/emotion-heart-blue.png';
import heartPurple from '../assets/emotion-heart-purple.png';

const emotions = [
  { label: '기쁨', color: 'yellow', img: heartYellow, code: 'JOY' },
  { label: '사랑', color: 'orange', img: heartOrange, code: 'LOVE' },
  { label: '평온', color: 'mint', img: heartGreen, code: 'CALM' },
  { label: '분노', color: 'red', img: heartRed, code: 'ANGER' },
  { label: '슬픔', color: 'blue', img: heartBlue, code: 'SAD' },
  { label: '불안', color: 'purple', img: heartPurple, code: 'ANXIOUS' },
];

const EmotionSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="emotion-select-container">
      <div className="emotion-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>&lt;</span>
        <span className="emotion-title">감정 선택</span>
      </div>
      <div className="emotion-grid">
        {emotions.map((e) => (
          <div key={e.label} className={`emotion-card ${e.color}`} onClick={() => navigate('/emotion-write', { state: { emotion: e } })}>
            <img src={e.img} alt={e.label} className="emotion-emoji" />
            <div className="emotion-label">{e.label}</div>
          </div>
        ))}
      </div>
      <button className="skip-btn" onClick={() => navigate('/main')}>건너뛰기</button>
    </div>
  );
};

export default EmotionSelect; 