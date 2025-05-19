import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EmotionWrite.css';
import { createEmotion } from '../api/emotion';
import ovenImg from '../assets/hatimo-cookie-oven.png';

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
};

const EmotionWrite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emotion = location.state?.emotion;
  const [text, setText] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);

  if (!emotion) {
    // 감정 정보 없이 접근 시 감정 선택으로 이동
    navigate('/emotion-select');
    return null;
  }

  const handleAiDraft = () => {
    // TODO: AI 초안 작성 기능 구현 예정
    alert('AI가 감정 일기 초안을 작성해줍니다! (예정)');
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('감정을 입력해 주세요!');
      return;
    }
    const emotionRequest = {
      emotionCode: emotion.code, // 영어 코드
      content: text,
    };
    console.log('emotionRequest to send:', emotionRequest);
    try {
      await createEmotion(emotionRequest);
      setShowToast(true);
      setTimeout(() => navigate('/main'), 2000); // 3초 후 메인으로 이동
    } catch (e) {
      alert('감정 기록 전송에 실패했습니다.');
    }
  };

  if (showToast) {
    return (
      <div className="emotion-toast-container">
        <div className="emotion-toast-paper">
          <div className="emotion-toast-title">감정 전송 완료!</div>
          <div className="emotion-toast-desc">하티모가 곧 쿠키를 구워줄거예요.</div>
          <img src={ovenImg} alt="오븐 속 하트쿠키" className="emotion-toast-img" />
        </div>
      </div>
    );
  }

  return (
    <div className="emotion-write-container">
      <div className="emotion-write-header">
        <span className="back-arrow" onClick={() => navigate(-1)}>&lt;</span>
        <span className="emotion-title">감정 쓰기</span>
      </div>
      <div className="emotion-write-paper">
        <div className="emotion-write-date-row">
          <span className="emotion-write-date">{getToday()}</span>
          <span className={`emotion-badge ${emotion.color}`}>#{emotion.label}</span>
        </div>
        <textarea
          className="emotion-write-textarea"
          placeholder="오늘의 감정을 자유롭게 기록해보세요."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
        />
      </div>
      <div className="emotion-write-bottom-bar">
        <button className="emotion-write-cancel" onClick={handleAiDraft}>쓰기 찬스✏️</button>
        <button className="emotion-write-submit" onClick={handleSubmit}>감정 전송💖</button>
      </div>
    </div>
  );
};

export default EmotionWrite; 