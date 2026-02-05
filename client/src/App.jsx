import { GameProvider } from './contexts/GameContext'
import GameBoard from './components/GameBoard'
import TeamPanel from './components/TeamPanel'
import GameLog from './components/GameLog'
import ClueInput from './components/ClueInput'
import GameControls from './components/GameControls'
import WinDisplay from './components/WinDisplay'
import { ARABIC_TEXT, TEAMS } from './data/words'
import './App.css'

function App() {
  return (
    <GameProvider>
      <div className="app" dir="rtl">
        <header className="game-header">
          <div className="header-left">
            <div className="players-count">
              <span className="players-icon">👥</span>
              <span className="players-number">4</span>
            </div>
          </div>
          
          <div className="header-center">
            <WinDisplay />
          </div>
          
          <div className="header-right">
            <GameControls />
          </div>
        </header>
        
        <main className="game-main">
          <aside className="sidebar left">
            <TeamPanel team={TEAMS.RED} />
          </aside>
          
          <section className="game-center">
            <GameBoard />
            <ClueInput />
          </section>
          
          <aside className="sidebar right">
            <TeamPanel team={TEAMS.BLUE} />
            <GameLog />
          </aside>
        </main>
      </div>
    </GameProvider>
  )
}

export default App
