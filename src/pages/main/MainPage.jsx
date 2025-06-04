// src/pages/main/MainPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import './MainPage.css';
import hamster from '../../assets/hamster.png';
import { useNavigate } from 'react-router-dom';
import MainBottomNav from '../../components/MainBottomNav';
import { getDailyEmotion } from '../../api/emotion';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MainPage = () => {
  const navigate = useNavigate();
  const [todayEmotion, setTodayEmotion] = useState(null);
  const [loading, setLoading] = useState(true);

  // 오늘 날짜의 감정 기록 가져오기
  useEffect(() => {
    const fetchTodayEmotion = async () => {
      try {
        setLoading(true);
        const today = formatDate(new Date());
        const response = await getDailyEmotion(today);
        console.log('MainPage today emotion response:', response);
        if (response.code === 'SUCCESS' && response.data !== null) {
          setTodayEmotion(response.data[0]);
        } else {
          setTodayEmotion(null);
        }
      } catch (error) {
        console.error('오늘 감정 기록 조회 실패:', error);
        setTodayEmotion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayEmotion();
  }, []);

  const handleButtonClick = () => {
    if (todayEmotion?.id) {
      // 기록이 있으면 상세 페이지로 이동
      navigate(`/emotion/${todayEmotion.id}`);
    } else {
      // 기록이 없으면 감정 기록 페이지로 이동
      navigate('/emotion-select');
    }
  };

  const buttonText = useMemo(() => 
    todayEmotion ? '쿠키 맛보기' : '감정 기록',
    [todayEmotion]
  );

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
      {/* 로딩 중에는 버튼을 표시하지 않고 로딩 인디케이터를 표시 */}
      {!loading && (
        <button 
          className="main-gradient-btn"
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      )}
      <MainBottomNav active="home" />
    </div>
  );
};

export default MainPage;
