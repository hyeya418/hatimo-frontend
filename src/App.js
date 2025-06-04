import './App.css';
import KakaoCallback from './pages/kakao/KakaoCallback';
import MainPage from './pages/main/MainPage';
import LoginError from './pages/error/LoginError';
import EmotionSelect from './pages/emotion/EmotionSelect';
import EmotionWrite from './pages/emotion/EmotionWrite';
import CalendarPage from './pages/calendar/CalendarPage';
import SettingsPage from './pages/settings/SettingsPage';
import EmotionDetail from './pages/emotion/EmotionDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KakaoLoginButton from './components/KakaoLoginButton';
import logo from './assets/hatimo-text-logo.png'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <header className="App-header">
              <img src={logo} alt="Hatimo Logo" className="hatimo-logo" />
              <div className="hatimo-subtitle">매일 쓰는 감정 기록</div>
              <KakaoLoginButton />
            </header>
          } />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/emotion-select" element={<EmotionSelect />} />
          <Route path="/emotion-write" element={<EmotionWrite />} />
          <Route path="/login-error" element={<LoginError />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/emotion/:id" element={<EmotionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
