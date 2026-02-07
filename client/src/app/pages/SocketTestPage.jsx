import { useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useGame } from '../../contexts/GameContext';
import '../../styles/SocketTest.css';

function SocketTestPage() {
  const { socket, isConnected, connectionError, reconnectAttempt } = useSocket();
  const { room, game, error } = useGame();
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    addLog('Socket Test Page loaded', 'info');
  }, []);

  useEffect(() => {
    if (isConnected) {
      addLog('Socket connected!', 'success');
    } else {
      addLog('Socket disconnected', 'warning');
    }
  }, [isConnected]);

  useEffect(() => {
    if (connectionError) {
      addLog(`Connection error: ${connectionError}`, 'error');
    }
  }, [connectionError]);

  useEffect(() => {
    if (room) {
      addLog(`Room updated: ${room.id} (${room.players?.length} players)`, 'success');
    }
  }, [room]);

  useEffect(() => {
    if (game) {
      addLog(`Game updated: ${game.phase}, ${game.board?.length} cards`, 'success');
    }
  }, [game]);

  const testConnection = () => {
    if (!socket) {
      addLog('No socket instance found', 'error');
      return;
    }

    addLog(`Socket ID: ${socket.id}`, 'info');
    addLog(`Connected: ${socket.connected}`, socket.connected ? 'success' : 'error');
    addLog(`Transport: ${socket.io?.engine?.transport?.name || 'unknown'}`, 'info');

    // List all event listeners
    const events = [
      'ROOM_UPDATE', 'GAME_UPDATE', 'GAME_STARTED', 'PLAYER_JOINED',
      'PLAYER_LEFT', 'CLUE_RECEIVED', 'WORD_SELECTED', 'TURN_ENDED',
      'GAME_ENDED', 'ERROR'
    ];
    
    events.forEach(event => {
      const listeners = socket.listeners(event);
      addLog(`Event ${event}: ${listeners.length} listener(s)`, 
        listeners.length > 0 ? 'success' : 'warning');
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="socket-test-page">
      <div className="test-container">
        <h1>Socket Connection Test</h1>
        
        <div className="status-panel">
          <div className={`status-item ${isConnected ? 'success' : 'error'}`}>
            <span className="status-label">Connection:</span>
            <span className="status-value">
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Socket ID:</span>
            <span className="status-value">{socket?.id || 'N/A'}</span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Reconnect Attempts:</span>
            <span className="status-value">{reconnectAttempt}</span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Room:</span>
            <span className="status-value">
              {room ? `${room.id} (${room.players?.length} players)` : 'Not in room'}
            </span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Game:</span>
            <span className="status-value">
              {game ? `${game.phase} (${game.board?.length} cards)` : 'No game'}
            </span>
          </div>
          
          {error && (
            <div className="status-item error">
              <span className="status-label">Error:</span>
              <span className="status-value">{error}</span>
            </div>
          )}
        </div>

        <div className="test-actions">
          <button onClick={testConnection} className="btn btn-primary">
            Test Connection
          </button>
          <button onClick={clearLogs} className="btn btn-secondary">
            Clear Logs
          </button>
        </div>

        <div className="logs-panel">
          <h3>Event Logs</h3>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">No logs yet. Click "Test Connection" to start.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.type}`}>
                  <span className="log-time">{log.time}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="debug-info">
          <h3>Debug Information</h3>
          <pre>{JSON.stringify({
            socket: {
              id: socket?.id,
              connected: socket?.connected,
              transport: socket?.io?.engine?.transport?.name
            },
            room: room ? {
              id: room.id,
              playerCount: room.players?.length,
              status: room.status
            } : null,
            game: game ? {
              phase: game.phase,
              turn: game.turn,
              boardSize: game.board?.length,
              winner: game.winner
            } : null
          }, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default SocketTestPage;
