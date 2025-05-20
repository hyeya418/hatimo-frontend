import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import heartGray from '../assets/emotion-heart-gray.png';
import heartYellow from '../assets/emotion-heart-yellow.png';
import heartRed from '../assets/emotion-heart-red.png';
import heartBlue from '../assets/emotion-heart-blue.png';
import heartPurple from '../assets/emotion-heart-purple.png';
import heartGreen from '../assets/emotion-heart-green.png';
import heartOrange from '../assets/emotion-heart-orange.png';
import MainBottomNav from '../components/MainBottomNav';
import './CalendarPage.css';

const mockDiary = {
  '2025-04-11': { emotion: '기쁨', color: 'yellow', content: '아이스크림을 세개나 먹었다!' },
  '2025-04-16': { emotion: '분노', color: 'red', content: '짜증나는 일이 있었다.' },
};
const heartMap = {
  yellow: heartYellow,
  red: heartRed,
  blue: heartBlue,
  purple: heartPurple,
  mint: heartGreen,
  orange: heartOrange,
  gray: heartGray,
};

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());
  const [selected, setSelected] = useState(formatDate(new Date()));

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = formatDate(date);
    const diary = mockDiary[key];
    const color = diary ? diary.color : 'gray';
    return (
      <img src={heartMap[color]} alt="감정하트" className={`heart-img${color === 'gray' ? ' gray' : ''}`} />
    );
  };

  const onChange = (date) => {
    setValue(date);
    setSelected(formatDate(date));
  };

  const selectedDiary = mockDiary[selected];

  return (
    <div className="calendar-container">
      <div className="calendar-title">감정 캘린더</div>
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
        />
      </div>
      <div className="diary-preview">
        {selectedDiary ? (
          <>
            <span style={{ color: '#ffe6b0' }}>{selected}</span> <span style={{ color: '#ffe066' }}>{selectedDiary.emotion}</span>
          </>
        ) : (
          <span style={{ color: '#ffe6b0' }}>{selected}</span>
        )}
      </div>
      <button className="diary-btn">일기 보기</button>
      <MainBottomNav active="home" />
    </div>
  );
};

export default CalendarPage; 