import React from 'react';
import './MainBottomNav.css';
import calendarIcon from '../assets/calendar-icon.png';
import calendarIconYellow from '../assets/calendar-icon-yellow.png';
import homeIcon from '../assets/home-icon.png';
import homeIconYellow from '../assets/home-icon-yellow.png';
import settingsIcon from '../assets/settings-icon.png';
import settingsIconYellow from '../assets/settings-icon-yellow.png';
import { useNavigate } from 'react-router-dom';

const MainBottomNav = ({ active = 'home' }) => {
  const navigate = useNavigate();
  return (
    <nav className="main-bottom-nav">
      <span className="nav-icon" onClick={() => navigate('/calendar')}>
        <img 
          src={active === 'calendar' ? calendarIconYellow : calendarIcon} 
          alt="캘린더" 
          className="nav-img" 
        />
      </span>
      <span className="nav-icon" onClick={() => navigate('/main')}>
        <img 
          src={active === 'home' ? homeIconYellow : homeIcon} 
          alt="홈" 
          className="nav-img" 
        />
      </span>
      <span className="nav-icon" onClick={() => navigate('/settings')}>
        <img 
          src={active === 'settings' ? settingsIconYellow : settingsIcon} 
          alt="설정" 
          className="nav-img" 
        />
      </span>
    </nav>
  );
};

export default MainBottomNav; 