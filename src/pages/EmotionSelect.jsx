import React from 'react';
import './EmotionSelect.css';
import { useNavigate } from 'react-router-dom';
import { getEmotionCodes } from '../api/emotion';
import heartYellow from '../assets/emotion-heart-yellow.png';
import heartOrange from '../assets/emotion-heart-orange.png';
import heartGreen from '../assets/emotion-heart-green.png';
import heartRed from '../assets/emotion-heart-red.png';
import heartBlue from '../assets/emotion-heart-blue.png';
import heartPurple from '../assets/emotion-heart-purple.png';

const emotionImgMap = {
  yellow: heartYellow,
  orange: heartOrange,
  mint: heartGreen,
  red: heartRed,
  blue: heartBlue,
  purple: heartPurple,
};

const EmotionSelect = () => {
  const navigate = useNavigate();
  const [emotions, setEmotions] = React.useState([]);

  React.useEffect(() => {
    getEmotionCodes().then(res => {
      setEmotions(res.data);
    });
  }, []);

  const handleSelect = (e) => {
    navigate('/emotion-write', { state: { emotion: e } });
  };

  const handleSkip = () => {
    const skip = emotions.find(e => e.code === 'SKIP') || { code: 'SKIP', label: '건너뛰기', color: 'gray' };
    navigate('/emotion-write', { state: { emotion: skip } });
  };

  return (
    <div className="emotion-select-container">
      <div className="emotion-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>&lt;</span>
        <span className="emotion-title">감정 선택</span>
      </div>
      <div className="emotion-grid">
        {emotions.filter(e => e.code !== 'SKIP').map((e) => (
          <div key={e.code} className={`emotion-card ${e.color}`} onClick={() => handleSelect({ ...e, img: emotionImgMap[e.color] })}>
            {emotionImgMap[e.color] && <img src={emotionImgMap[e.color]} alt={e.label} className="emotion-emoji" />}
            <div className="emotion-label">{e.label}</div>
          </div>
        ))}
      </div>
      <button className="skip-btn" onClick={handleSkip}>건너뛰기</button>
    </div>
  );
};

export default EmotionSelect; 