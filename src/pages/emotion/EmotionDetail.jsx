import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopNavBar from '../../components/TopNavBar';
import { getEmotionResponse, getEmotionCodes } from '../../api/emotion';
import './EmotionDetail.css';

const EMOTION_COLORS = {
  yellow: '#FCE48B',
  orange: '#D76400',
  mint: '#AFDAC5',
  red: '#EF8686',
  blue: '#A1C3F0',
  purple: '#C4B2EA',
  gray: '#bfa76a',
};

const EmotionDetail = () => {
  const { id } = useParams();
  const [emotionDetail, setEmotionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emotionNameMap, setEmotionNameMap] = useState({});

  useEffect(() => {
    const fetchEmotionCodes = async () => {
      try {
        const response = await getEmotionCodes();
        if (response.code === 'SUCCESS') {
          const nameMap = {};
          response.data.forEach(emotion => {
            nameMap[emotion.code] = emotion.label;
          });
          setEmotionNameMap(nameMap);
        }
      } catch (err) {
        console.error('감정 코드 조회 실패:', err);
      }
    };

    fetchEmotionCodes();
  }, []);

  useEffect(() => {
    const fetchEmotionDetail = async () => {
      try {
        setLoading(true);
        const response = await getEmotionResponse(id);
        console.log('Emotion Detail API Response:', response);
        if (response.code === 'SUCCESS' && response.data && response.data[0]) {
          // API 응답 구조에 맞게 데이터 설정
          setEmotionDetail({
            id: response.data[0].emotion.id,
            date: new Date(response.data[0].emotion.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '.').slice(0, -1),
            emotionCode: response.data[0].emotion.emotionCode,
            content: response.data[0].emotion.content,
            gptResponse: response.data[0].gptResponse,
            color: response.data[0].emotion.color,
          });
        } else {
          setError('감정 상세 데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('감정 상세 데이터 조회 실패:', err);
        setError('감정 상세 데이터를 불러오는데 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmotionDetail();
    }
  }, [id]);

  if (loading) {
    return <div className="loading-message">로딩 중...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!emotionDetail) {
    return <div className="no-data-message">데이터가 없습니다.</div>;
  }

  return (
    <div className="emotion-detail-container">
      <TopNavBar title="감정 기록" />
      <div className="emotion-detail-content-area">
        <div className="emotion-detail-section">
          <div className="emotion-detail-date-row">
            <span className="emotion-detail-date">{emotionDetail.date} <span role="img" aria-label="달력">🗓️</span></span>
            {emotionDetail.emotionCode && (
              console.log('EmotionDetail - emotionDetail.color:', emotionDetail.color),
              console.log('EmotionDetail - EMOTION_COLORS:', EMOTION_COLORS),
              console.log('EmotionDetail - Calculated Background Color:', EMOTION_COLORS[emotionDetail.color] || EMOTION_COLORS.gray),
              <span 
                className="emotion-tag"
                style={{ backgroundColor: EMOTION_COLORS[emotionDetail.color] || EMOTION_COLORS.gray }}
              >#{emotionNameMap[emotionDetail.emotionCode] || emotionDetail.emotionCode}</span>
            )}
          </div>
          <div className="emotion-detail-title">내가 기록한 감정 <span role="img" aria-label="하트">💖</span></div>
          <div className="emotion-detail-content">{emotionDetail.content}</div>
        </div>
        <div className="emotion-detail-divider" />
        <div className="emotion-detail-section">
          <div className="emotion-detail-cookie-title">
            하티모의 쿠키 <span role="img" aria-label="쿠키">🍪</span>
          </div>
          <div className="emotion-detail-cookie-desc">
            {emotionDetail.gptResponse}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetail; 