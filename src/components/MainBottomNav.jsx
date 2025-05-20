import React from 'react';
import './MainBottomNav.css';
import calendarIcon from '../assets/calendar-icon.png';
import homeIcon from '../assets/home-icon.png';
import settingsIcon from '../assets/settings-icon.png';
import { useNavigate } from 'react-router-dom';

const MainBottomNav = ({ active = 'home' }) => {
  const navigate = useNavigate();
  return (
    <nav className="main-bottom-nav">
      <span className={`nav-icon${active === 'calendar' ? ' active' : ''}`} onClick={() => navigate('/calendar')}>
        <img src={calendarIcon} alt="캘린더" className="nav-img" />
      </span>
      <span className={`nav-icon${active === 'home' ? ' active' : ''}`} onClick={() => navigate('/main')}>
        <img src={homeIcon} alt="홈" className="nav-img" />
      </span>
      <span className={`nav-icon${active === 'settings' ? ' active' : ''}`} onClick={() => navigate('/settings')}>
        <img src={settingsIcon} alt="설정" className="nav-img" />
      </span>
    </nav>
  );
};

export default MainBottomNav; 