import './App.css';
import KakaoCallback from './pages/KakaoCallback';
import MainPage from './pages/MainPage';
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
              <KakaoLoginButton />
            </header>
          } />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/main" element={<MainPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
