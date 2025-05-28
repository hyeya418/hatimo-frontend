import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import MainBottomNav from '../components/MainBottomNav';
import TopNavBar from '../components/TopNavBar';
import { getDailyEmotion, getMonthlyEmotions, getEmotionCodes } from '../api/emotion';
import './CalendarPage.css';

// Assets
import heartGray from '../assets/emotion-heart-gray.png';
import heartYellow from '../assets/emotion-heart-yellow.png';
import heartRed from '../assets/emotion-heart-red.png';
import heartBlue from '../assets/emotion-heart-blue.png';
import heartPurple from '../assets/emotion-heart-purple.png';
import heartGreen from '../assets/emotion-heart-green.png';
import heartOrange from '../assets/emotion-heart-orange.png';

// Constants
const HEART_MAP = {
  yellow: heartYellow,
  red: heartRed,
  blue: heartBlue,
  purple: heartPurple,
  mint: heartGreen,
  orange: heartOrange,
  gray: heartGray,
};

const COLORS = {
  loading: '#ffe6b0',
  emotion: '#ffe066',
};

// Utility functions
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Custom hooks
const useEmotionCodes = () => {
  const [emotionColorMap, setEmotionColorMap] = useState({});

  useEffect(() => {
    const fetchEmotionCodes = async () => {
      try {
        const response = await getEmotionCodes();
        if (response.code === 'SUCCESS') {
          const colorMap = {};
          response.data.forEach(emotion => {
            colorMap[emotion.code] = emotion.color;
          });
          setEmotionColorMap(colorMap);
        }
      } catch (error) {
        console.error('감정 코드 조회 실패:', error);
      }
    };
    fetchEmotionCodes();
  }, []);

  return emotionColorMap;
};

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getDailyEmotion(formatDate(new Date()));
      } catch (error) {
        if (error.response?.status === 403) {
          navigate('/');
        }
      }
    };
    checkAuth();
  }, [navigate]);
};

const useEmotionData = (emotionColorMap) => {
  const [emotions, setEmotions] = useState({});
  const [monthlyEmotions, setMonthlyEmotions] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMonthlyData = useCallback(async (year, month, isMounted) => {
    try {
      console.log('월별 감정 데이터 요청:', { year, month });
      const response = await getMonthlyEmotions(year, month);
      console.log('월별 감정 데이터 응답:', response);
      if (isMounted && response.code === 'SUCCESS') {
        const emotionMap = {};
        response.data.forEach(item => {
          emotionMap[item.date] = {
            emotion: item.emotionCode,
            color: emotionColorMap[item.emotionCode] || 'gray'
          };
        });
        console.log('변환된 감정 데이터:', emotionMap);
        setMonthlyEmotions(emotionMap);
      }
    } catch (error) {
      console.error('월별 감정 데이터 조회 실패:', error);
    }
  }, [emotionColorMap]);

  const fetchDailyData = useCallback(async (date, isMounted) => {
    try {
      setLoading(true);
      console.log('일일 감정 데이터 요청:', date);
      const response = await getDailyEmotion(date);
      console.log('일일 감정 데이터 응답:', response);
      if (isMounted) {
        if (response.code === 'SUCCESS' && response.data !== null) {
          const emotion = response.data[0];
          const newEmotion = {
            id: emotion.id,
            emotion: emotion.emotionCode,
            color: emotionColorMap[emotion.emotionCode] || 'gray',
            content: emotion.content
          };
          console.log('변환된 일일 감정 데이터:', newEmotion);
          setEmotions(prev => ({
            ...prev,
            [date]: newEmotion
          }));
        } else {
          setEmotions(prev => ({
            ...prev,
            [date]: null
          }));
        }
      }
    } catch (error) {
      console.error('감정 데이터 조회 실패:', error);
      if (isMounted) {
        setEmotions(prev => ({
          ...prev,
          [date]: null
        }));
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [emotionColorMap]);

  return {
    emotions,
    monthlyEmotions,
    loading,
    fetchMonthlyData,
    fetchDailyData
  };
};

// Components
const DiaryPreview = ({ selected, selectedDiary, loading }) => (
  <div className="diary-preview">
    {loading ? (
      <span style={{ color: COLORS.loading }}>로딩 중...</span>
    ) : selectedDiary ? (
      <>
        <span style={{ color: COLORS.loading }}>{selected}</span>{' '}
        <span style={{ color: COLORS.emotion }}>{selectedDiary.emotion}</span>
      </>
    ) : (
      <span style={{ color: COLORS.loading }}>{selected}</span>
    )}
  </div>
);

// Main component
const CalendarPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [selected, setSelected] = useState(formatDate(new Date()));

  const emotionColorMap = useEmotionCodes();
  useAuthCheck();
  
  const {
    emotions,
    monthlyEmotions,
    loading,
    fetchMonthlyData,
    fetchDailyData
  } = useEmotionData(emotionColorMap);

  useEffect(() => {
    let isMounted = true;
    if (Object.keys(emotionColorMap).length > 0) {
      const year = value.getFullYear();
      const month = value.getMonth() + 1;
      fetchMonthlyData(year, month, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [value, emotionColorMap, fetchMonthlyData]);

  useEffect(() => {
    let isMounted = true;
    if (Object.keys(emotionColorMap).length > 0) {
      fetchDailyData(selected, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [selected, emotionColorMap, fetchDailyData]);

  const tileContent = useCallback(({ date, view }) => {
    if (view !== 'month') return null;
    const key = formatDate(date);
    const diary = monthlyEmotions[key];
    const color = diary ? diary.color : 'gray';
    return (
      <img 
        src={HEART_MAP[color]} 
        alt="감정하트" 
        className={`heart-img${color === 'gray' ? ' gray' : ''}`} 
      />
    );
  }, [monthlyEmotions]);

  const onChange = useCallback((date) => {
    setValue(date);
    setSelected(formatDate(date));
  }, []);

  const selectedDiary = useMemo(() => emotions[selected], [emotions, selected]);

  const handleViewDiary = useCallback(() => {
    const selectedEmotion = emotions[selected];
    if (selectedEmotion?.id) {
      navigate(`/emotion/${selectedEmotion.id}`);
    } else {
      console.warn('선택된 날짜에 감정 기록이 없습니다.');
    }
  }, [emotions, selected, navigate]);

  const isButtonDisabled = useMemo(() => 
    !selectedDiary,
    [selectedDiary]
  );

  const buttonText = '일기 보기';

  return (
    <div className="calendar-container">
      <TopNavBar title="감정 캘린더" showBackButton={false} />
      <div className="calendar-wrap">
        <Calendar
          onChange={onChange}
          value={value}
          tileContent={tileContent}
          calendarType="gregory"
          locale="ko-KR"
          next2Label={null}
          prev2Label={null}
          formatMonthYear={(_, date) => `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`}
          formatDay={(_, date) => date.getDate()}
        />
      </div>
      <DiaryPreview 
        selected={selected}
        selectedDiary={selectedDiary}
        loading={loading}
      />
      <button 
        className="diary-btn" 
        onClick={handleViewDiary}
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
      <MainBottomNav active="home" />
    </div>
  );
};

export default CalendarPage; 