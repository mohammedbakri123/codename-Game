import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../../utils/roomUtils';
import styles from '../../styles/HomePage.module.css';

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
    <div className={styles['home-page']}>
      <div className={styles['home-container']}>
        <h1 className={styles.title}>كود نيمز</h1>
        <p className={styles.subtitle}>لعبة كلمات متعددة اللاعبين عبر الإنترنت</p>
        
        <div className={styles['form-container']}>
          <input
            type="text"
            placeholder="أدخل اسمك"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={styles.input}
            maxLength={20}
            dir="rtl"
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button 
            onClick={handleCreateRoom}
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            إنشاء غرفة جديدة
          </button>
          
          <div className={styles.divider}>
            <span>أو</span>
          </div>
          
          <input
            type="text"
            placeholder="أدخل رمز الغرفة"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className={styles.input}
            maxLength={6}
            dir="rtl"
          />
          
          <button 
            onClick={handleJoinRoom}
            className={`${styles.btn} ${styles['btn-secondary']}`}
            disabled={!roomId.trim()}
          >
            الانضمام للغرفة
          </button>
        </div>
        
        <div className={styles.rules} dir="rtl">
          <h3>كيفية اللعب</h3>
          <ul>
            <li>يتنافس فريقان: الأحمر ضد الأزرق</li>
            <li>يعطي القائد تلميحًا من كلمة واحدة</li>
            <li>يحاول اللاعبون تخمين كلمات فريقهم</li>
            <li>تجنب كرت القاتل!</li>
          </ul>
        </div>
        
        <div className={styles['debug-link']}>
          <button 
            onClick={() => navigate('/test')}
            className={`${styles.btn} ${styles['btn-text']}`}
          >
            🔧 فحص الاتصال
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
