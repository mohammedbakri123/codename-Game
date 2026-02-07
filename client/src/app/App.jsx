import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from '../contexts/SocketContext';
import { GameProvider } from '../contexts/GameContext';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import GamePage from './pages/GamePage';
import SocketTestPage from './pages/SocketTestPage';
import styles from '../styles/App.module.css';

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <div className={styles.app}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="/game/:roomId" element={<GamePage />} />
            <Route path="/test" element={<SocketTestPage />} />
          </Routes>
        </div>
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
