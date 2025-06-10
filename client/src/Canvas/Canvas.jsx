import { useState, useEffect, useRef } from 'react';
import {
  spawnFood,
  direction,
  update,
  drawSnake,
  drawFood,
  resetGame
} from '../Gamelogic/Gamelogic';

export default function Canvas(props) {
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

  const snakeRef = useRef(snake);
  const dirRef = useRef(dir);
  const lastInputRef = useRef(dir);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        direction(event.key, dirRef, lastInputRef, setDir);
        console.log('Key pressed:', event.key, props.width);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameOver) return;


    const wrappedSpawnFood = () =>
      spawnFood(props.width, props.height, snakeRef, setFood);

    // manual update call
    update(snakeRef, dirRef, setSnake, props, food, setScore, wrappedSpawnFood, setGameOver);
    const interval = setInterval(() => {
      update(snakeRef, dirRef, setSnake, props, food, setScore, wrappedSpawnFood, setGameOver);
    }, 100);

    return () => clearInterval(interval);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, gameOver]);

  useEffect(() => {
    const canvas = ref.current;
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
    {!gameOver &&
    <div id='running'>
      <p>Score: {score}</p>
      <button id='cancel' onClick={cancel}>X</button>
      <canvas id='canvas' ref={ref} {...props}></canvas>
    </div>
    }

    {gameOver  &&
    <div id='stopped' style={{ color: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', width: '100px' }}>
      <h2 id='gameover'>Game Over</h2>
      <p id='score'>Your score: {score}</p>
      <button id='restart' onClick={() => resetGame(setSnake, setDir, setScore, setFood, setGameOver, snakeRef, dirRef, lastInputRef)}>Start New Game</button>
      <button id='leaderboard' onClick={() => alert('Leaderboard coming soon!')}>Leaderboard</button>
    </div>
    }
    </>
  );
}
