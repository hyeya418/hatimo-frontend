import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNavBar.css';

const TopNavBar = ({ title, showBackButton = true }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="top-nav-bar">
      {showBackButton ? (
        <button onClick={handleBackClick} className="top-nav-back-button">{'<'}</button>
      ) : (
        <div className="top-nav-placeholder"></div>
      )}
      <div className="top-nav-title">{title}</div>
      <div className="top-nav-placeholder"></div> {/* 중앙 정렬을 위한 빈 공간 */}
    </div>
  );
};

export default TopNavBar; 