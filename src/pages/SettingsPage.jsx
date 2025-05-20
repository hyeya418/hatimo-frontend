import React from 'react';
import MainBottomNav from '../components/MainBottomNav';
import './SettingsPage.css';

const settings = [
  { icon: '👤', label: '개인정보 설정' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '🎚️', label: '앱 설정' },
  { icon: 'ℹ️', label: '앱 정보' },
];

const SettingsPage = () => (
  <div className="container">
    <div className="title">설정</div>
    <div className="list">
      {settings.map((item, idx) => (
        <React.Fragment key={item.label}>
          <div className="item">
            <span className="iconLabel">
              <span className="icon">{item.icon}</span>
              {item.label}
            </span>
            <span className="arrow">&#8250;</span>
          </div>
          {idx !== settings.length - 1 && <div className="divider" />}
        </React.Fragment>
      ))}
    </div>
    <MainBottomNav active="settings" />
  </div>
);

export default SettingsPage; 