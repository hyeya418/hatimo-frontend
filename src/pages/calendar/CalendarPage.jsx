import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import MainBottomNav from '../../components/MainBottomNav';
import TopNavBar from '../../components/TopNavBar';
import { getDailyEmotion, getMonthlyEmotions, getEmotionCodes } from '../../api/emotion';
import './CalendarPage.css';

// Assets
import heartGray from '../../assets/emotion-heart-gray.png';
import heartYellow from '../../assets/emotion-heart-yellow.png';
import heartRed from '../../assets/emotion-heart-red.png';
import heartBlue from '../../assets/emotion-heart-blue.png';
import heartPurple from '../../assets/emotion-heart-purple.png';
import heartGreen from '../../assets/emotion-heart-green.png';
import heartOrange from '../../assets/emotion-heart-orange.png';

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

const EMOTION_TEXT_COLORS = {
  yellow: '#FCE48B',
  orange: '#D76400',
  mint: '#AFDAC5',
  red: '#EF8686',
  blue: '#A1C3F0',
  purple: '#C4B2EA',
  gray: '#bfa76a',
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
  const [emotionNameMap, setEmotionNameMap] = useState({});

  useEffect(() => {
    const fetchEmotionCodes = async () => {
      try {
        const response = await getEmotionCodes();
        if (response.code === 'SUCCESS') {
          const colorMap = {};
          const nameMap = {};
          response.data.forEach(emotion => {
            colorMap[emotion.code] = emotion.color;
            nameMap[emotion.code] = emotion.label;
          });
          setEmotionColorMap(colorMap);
          setEmotionNameMap(nameMap);
        }
      } catch (error) {
        console.error('감정 코드 조회 실패:', error);
      }
    };
    fetchEmotionCodes();
  }, []);

  return { emotionColorMap, emotionNameMap };
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

const useEmotionData = (emotionColorMap, emotionNameMap) => {
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
            color: emotionColorMap[item.emotionCode] || 'gray',
            emotionName: emotionNameMap[item.emotionCode] || item.emotionCode
          };
        });
        console.log('변환된 감정 데이터:', emotionMap);
        setMonthlyEmotions(emotionMap);
      }
    } catch (error) {
      console.error('월별 감정 데이터 조회 실패:', error);
    }
  }, [emotionColorMap, emotionNameMap]);

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
            content: emotion.content,
            emotionName: emotionNameMap[emotion.emotionCode] || emotion.emotionCode
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
  }, [emotionColorMap, emotionNameMap]);

  return {
    emotions,
    monthlyEmotions,
    loading,
    fetchMonthlyData,
    fetchDailyData
  };
};

// Components
const DiaryPreview = React.memo(({ selected, selectedDiary, loading }) => {
  const content = useMemo(() => {
    console.log('DiaryPreview - selectedDiary:', selectedDiary);
    console.log('DiaryPreview - calculated color:', EMOTION_TEXT_COLORS[selectedDiary?.color] || COLORS.emotion);
    if (loading && !selectedDiary) {
      return <span style={{ color: COLORS.loading }}>로딩 중...</span>;
    } else if (selectedDiary) {
      return (
        <>
          <span style={{ color: COLORS.loading, marginRight: '8px' }}>{selected}</span>{}
          <span style={{ color: EMOTION_TEXT_COLORS[selectedDiary.color] || COLORS.emotion }}>{selectedDiary.emotionName || selectedDiary.emotion}</span>{/* 감정 색상 매핑 적용 */}
        </>
      );
    } else {
      return <span style={{ color: COLORS.loading }}>{selected}</span>;
    }
  }, [selected, selectedDiary, loading]);

  return (
    <div className="diary-preview">
      {content}
    </div>
  );
});

// Main component
const CalendarPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [selected, setSelected] = useState(formatDate(new Date()));
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const { emotionColorMap, emotionNameMap } = useEmotionCodes();
  useAuthCheck();
  
  const {
    emotions,
    monthlyEmotions,
    loading,
    fetchMonthlyData,
    fetchDailyData
  } = useEmotionData(emotionColorMap, emotionNameMap);

  useEffect(() => {
    let isMounted = true;
    if (Object.keys(emotionColorMap).length > 0 && Object.keys(emotionNameMap).length > 0 && activeStartDate) {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;
      fetchMonthlyData(year, month, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [activeStartDate, emotionColorMap, emotionNameMap, fetchMonthlyData]);

  useEffect(() => {
    let isMounted = true;
    if (Object.keys(emotionColorMap).length > 0 && Object.keys(emotionNameMap).length > 0 && selected) {
      fetchDailyData(selected, isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [selected, emotionColorMap, emotionNameMap, fetchDailyData]);

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

  // 현재 월에 속하지 않는 날짜에 클래스 추가
  const tileClassName = useCallback(({ date, view }) => {
    if (view === 'month' && date.getMonth() !== activeStartDate.getMonth()) {
      return 'other-month';
    }
    return null;
  }, [activeStartDate]);

  // 현재 월에 속하지 않는 날짜 비활성화
  const tileDisabled = useCallback(({ date, view }) => {
    if (view === 'month' && date.getMonth() !== activeStartDate.getMonth()) {
      return true;
    }
    return false;
  }, [activeStartDate]);

  const onChange = useCallback((date) => {
    setValue(date);
    setSelected(formatDate(date));
  }, []);

  const handleActiveStartDateChange = useCallback(({ activeStartDate }) => {
    setActiveStartDate(activeStartDate);
  }, []);

  const selectedDiary = useMemo(() => emotions[selected], [emotions, selected]);

  const today = useMemo(() => formatDate(new Date()), []);
  const selectedDateObj = useMemo(() => new Date(selected), [selected]);
  const todayObj = useMemo(() => new Date(today), [today]);

  const handleViewDiary = useCallback(() => {
    const selectedEmotion = emotions[selected];
    if (selectedEmotion?.id) {
      navigate(`/emotion/${selectedEmotion.id}`);
    } else {
      if (selected === today) {
        console.log('오늘 날짜에 감정 기록이 없습니다. 감정 기록 페이지로 이동합니다.');
        navigate('/emotion-select');
      } else if (selectedDateObj < todayObj) {
        console.log('과거 날짜입니다. 감정 기록을 할 수 없습니다.');
      } else if (selectedDateObj > todayObj) {
        console.log('미래 날짜입니다. 감정 기록을 할 수 없습니다.');
      }
    }
  }, [emotions, selected, navigate, today, selectedDateObj, todayObj]);

  const isButtonDisabled = useMemo(() => 
    !selectedDiary && selected !== today,
    [selectedDiary, selected, today]
  );

  const buttonText = useMemo(() => {
    if (selectedDiary) {
      return '쿠키 맛보기';
    } else {
      if (selected === today) {
        return '감정 기록';
      } else if (selectedDateObj < todayObj) {
        return '쿠키가 없어요';
      } else if (selectedDateObj > todayObj) {
        return '쿠키 구워줄거죠?';
      }
      return '기록 불가';
    }
  }, [selectedDiary, selected, today, selectedDateObj, todayObj]);

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
          onActiveStartDateChange={handleActiveStartDateChange}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
      </div>
      <DiaryPreview 
        selected={selected}
        selectedDiary={selectedDiary}
        loading={loading}
      />
      <button 
        className={`diary-btn${isButtonDisabled ? ' disabled-look' : ''}`}
        onClick={handleViewDiary}
        disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
      <MainBottomNav active="calendar" />
    </div>
  );
};

export default CalendarPage; 