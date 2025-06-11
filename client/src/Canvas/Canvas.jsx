import { useState, useEffect, useRef } from 'react';
import {
  spawnFood,
  direction,
  update,
  drawSnake,
  drawFood,
  resetGame,
  submitScore,
} from '../Gamelogic/Gamelogic';
import './canvas.css';


export default function Canvas(props) {
    const {
    width,
    height,
    style,
    fetchData,
    leaderboard,
    showLeaderboard,
    hideLeaderboard,
    toggleMute,
    muted,
    startMusic
  } = props;
  const ref = useRef();

  const [dir, setDir] = useState({ x: 10, y: 0 });
  const [food, setFood] = useState({ x: 200, y: 200 });
  const [snake, setSnake] = useState([
    { x: 40, y: 20 },
    { x: 40, y: 10 },
    { x: 30, y: 10 },
    { x: 20, y: 10 }
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const snakeRef = useRef(snake);
  const dirRef = useRef(dir);
  const lastInputRef = useRef(dir);
  const [userName, setUserName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight','w','s','a','d'].includes(event.key)) {
        direction(event.key, dirRef, lastInputRef, setDir);
        console.log('Key pressed:', event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameOver) return;


    const wrappedSpawnFood = () =>
      spawnFood(width, height, snakeRef, setFood);

    // manual update call
    update(snakeRef, dirRef, setSnake, {width, height}, food, setScore, wrappedSpawnFood, setGameOver);
    const interval = setInterval(() => {
      update(snakeRef, dirRef, setSnake, {width, height}, food, setScore, wrappedSpawnFood, setGameOver);
    }, 100);

    return () => clearInterval(interval);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, gameOver]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    let animationID;

    const render = () => {
      drawSnake(context, snakeRef);
      drawFood(context, food);
      animationID = window.requestAnimationFrame(render);
    };

    render();

    return () => window.cancelAnimationFrame(animationID);
  }, [food]);

  const cancel = () => {
    setGameOver(true);
  }


  return (
    <>
      {!gameStarted && (
        <div id="stopped">
          <h2 id="welcome">Welcome to Snakesss</h2>
          <button id="restart" onClick={() => {
            startMusic();
            setGameStarted(true);
            resetGame(setSnake, setDir, setScore, setFood, setGameOver, snakeRef, dirRef, lastInputRef, setScoreSubmitted);
          }}>
            Start Game
          </button>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div id='running'>
          <div id='runningButtons'>
          <button id='cancel' onClick={cancel}>X</button>
            <button id="mute" onClick={toggleMute}>
                {muted ? '🔇' : '🔊'}
            </button>
          </div>
          <canvas
            id='canvas'
            ref={ref}
            width={width}
            height={height}
            style={style}
          />
        </div>
      )}

      {gameStarted && gameOver && (
        <div id='stopped'>
          <h2 id='gameover'>Game Over</h2>
          <p id='score'>Your score: {score}</p>

          {!showLeaderboard && (
            <>
            {score > 0 && (
              scoreSubmitted ? (
                <p>Your score has been submitted.</p>
              ) : (
                <div id='scoreInput'>

                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                  />
                  <button onClick={() => {
                    submitScore(userName, score, setScoreSubmitted);
                    setUserName('');
                  }}>Submit score</button>
                </div>
              )
            )}

              <button id='restart' onClick={() => {
                setGameStarted(true);
                resetGame(setSnake, setDir, setScore, setFood, setGameOver, snakeRef, dirRef, lastInputRef, setScoreSubmitted);
              }}>
                Start New Game
              </button>

              <button id='leaderboard' onClick={fetchData}>Leaderboard</button>
            </>
          )}

          {showLeaderboard && (
            <div id='leaderboard-box'>
              <h3>Top 10 Players</h3>
              <ol>
                {leaderboard.map((user, index) => (
                  <li key={index}>
                    {user.userName} — {user.highScore}
                  </li>
                ))}
              </ol>
              <button onClick={hideLeaderboard}>Hide Leaderboard</button>
            </div>
          )}
        </div>
      )}
    </>
  );

}
