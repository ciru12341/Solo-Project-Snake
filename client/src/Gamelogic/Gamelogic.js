
export function spawnFood(width, height, snakeRef, setFood) {
  const newFood = {
    x: Math.floor(Math.random() * (width - 10) / 10) * 10,
    y: Math.floor(Math.random() * (height - 10) / 10) * 10
  };

  if (snakeRef.current.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
    spawnFood(width, height, snakeRef, setFood);
  } else {
    setFood(newFood);
  }
}

export function direction(key, dirRef, lastInputRef, setDir) {
  const current = dirRef.current;
  const lastInput = lastInputRef.current;

  let newDir = null;

  if ((key === 'ArrowUp' || key === 'w')&& current.y === 0) newDir = { x: 0, y: -10 };
  else if ((key === 'ArrowDown' || key === 's')&& current.y === 0) newDir = { x: 0, y: 10 };
  else if ((key === 'ArrowLeft' || key === 'a')&& current.x === 0) newDir = { x: -10, y: 0 };
  else if ((key === 'ArrowRight' || key === 'd') && current.x === 0) newDir = { x: 10, y: 0 };
  else return;

  if (newDir.x === lastInput.x && newDir.y === lastInput.y) return;

  setDir(newDir);
  lastInputRef.current = newDir;
}

export function update(snakeRef, dirRef, setSnake, props, food, setScore, spawnFoodFn, setGameOver) {
  const currentDir = dirRef.current;

  setSnake(prevSnake => {
    const newSnake = prevSnake.map((item, index) => {
      if (index === 0) return { x: item.x + currentDir.x, y: item.y + currentDir.y };
      return { ...prevSnake[index - 1] };
    });

    const head = newSnake[0];

    //handle wall collisions  with reload page
    if (head.x < 0 || head.y < 0 || head.x >= props.width || head.y >= props.height) {
      setGameOver(true);
      return prevSnake;
    }

    //handle self collisions with reload page
    if (newSnake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
      setGameOver(true);
      return prevSnake;
    }

    return newSnake;
  });

  const snake = snakeRef.current;
  const head = snake[0];
  if (head.x === food.x && head.y === food.y) {
    setSnake(prev => [...prev, { ...food }]);
    setScore(prev => prev + 1);
    spawnFoodFn();
  }
}

export function drawSnake(context, snakeRef) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  snakeRef.current.forEach((segment, index) => {
    context.fillStyle = index === 0 ? 'orange' : 'yellow';
    context.fillRect(segment.x, segment.y, 9, 9);
  });
}

export function drawFood(context, food) {
  context.fillStyle = 'green';
  context.fillRect(food.x, food.y, 9, 9);
}

export function resetGame(setSnake, setDir, setScore, setFood, setGameOver, snakeRef, dirRef, lastInputRef, setScoreSubmitted) {
  const initialSnake = [
    { x: 40, y: 20 },
    { x: 40, y: 10 },
    { x: 30, y: 10 },
    { x: 20, y: 10 }
  ];
  const initialDir = { x: 10, y: 0 };
  const initialFood = { x: 200, y: 200 };

  setSnake(initialSnake);
  setDir(initialDir);
  setScore(0);
  setFood(initialFood);
  setGameOver(false);
  setScoreSubmitted(false);

  snakeRef.current = initialSnake;
  dirRef.current = initialDir;
  lastInputRef.current = initialDir;
}

export async function submitScore(userName, score, setScoreSubmitted) {

  const cleanedName = userName
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 20);

  if (!cleanedName) {
    alert('Please enter your name.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/Leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: userName.trim(), highScore: score })
    });
    const data = await res.json();
    console.log('Score submitted:', data);
    setScoreSubmitted(true);
  } catch (error) {
    console.error('Failed to submit score:', error);
    alert('Something went wrong while submitting your score.');
  }
}