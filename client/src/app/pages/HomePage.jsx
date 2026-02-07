import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../../utils/roomUtils';
import '../../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('الرجاء إدخال اسمك');
      return;
    }
    
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}?name=${encodeURIComponent(playerName)}`);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('الرجاء إدخال اسمك');
      return;
    }
    
    if (!roomId.trim()) {
      setError('الرجاء إدخال رمز الغرفة');
      return;
    }
    
    navigate(`/room/${roomId.trim().toUpperCase()}?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="title">كود نيمز</h1>
        <p className="subtitle">لعبة كلمات متعددة اللاعبين عبر الإنترنت</p>
        
        <div className="form-container">
          <input
            type="text"
            placeholder="أدخل اسمك"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
            maxLength={20}
            dir="rtl"
          />
          
          {error && <p className="error">{error}</p>}
          
          <button 
            onClick={handleCreateRoom}
            className="btn btn-primary"
          >
            إنشاء غرفة جديدة
          </button>
          
          <div className="divider">
            <span>أو</span>
          </div>
          
          <input
            type="text"
            placeholder="أدخل رمز الغرفة"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="input"
            maxLength={6}
            dir="rtl"
          />
          
          <button 
            onClick={handleJoinRoom}
            className="btn btn-secondary"
            disabled={!roomId.trim()}
          >
            الانضمام للغرفة
          </button>
        </div>
        
        <div className="rules" dir="rtl">
          <h3>كيفية اللعب</h3>
          <ul>
            <li>يتنافس فريقان: الأحمر ضد الأزرق</li>
            <li>يعطي القائد تلميحًا من كلمة واحدة</li>
            <li>يحاول اللاعبون تخمين كلمات فريقهم</li>
            <li>تجنب كرت القاتل!</li>
          </ul>
        </div>
        
        <div className="debug-link">
          <button 
            onClick={() => navigate('/test')}
            className="btn btn-text"
          >
            🔧 فحص الاتصال
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
