import {useState, useEffect, useRef} from 'react'

// everything taht is not a hook -> into new file


// !TODO -> Fix that game doesnt stop when arrowkey is hold down


export default function Canvas(props) {
  const ref = useRef();

  const [dir, setDir] = useState({ x: 10, y: 0 });

  const [food, setFood] = useState({x: 200, y:200});

  const [snake, setSnake] = useState([{x: 40, y: 20}, {x: 40, y: 10}, {x: 30, y: 10}, {x: 20, y: 10}]);

  const snakeRef = useRef(snake);

  const dirRef = useRef(dir);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  const spawnFood = () => {
    const newFood = {x: Math.floor(Math.random() * (props.width-10) / 10) * 10, y: Math.floor(Math.random() * (props.height-10) / 10) * 10}
    if (snake.some(food => food.x === newFood.x && food.y === newFood.y)) {
      spawnFood();
    } else {
      console.log(`Food spawned at: x: ${newFood.x} y: ${newFood.y}`)
      setFood(newFood);
    }
  }

  const direction = (key) => {
    if (key == 'ArrowUp') {
      setDir({x: 0, y: -10});
    } else if (key == 'ArrowDown') {
      setDir({x: 0, y: 10});
    } else if (key == 'ArrowLeft') {
      setDir({x: -10, y: 0});
    } else {
      setDir({x: 10, y: 0});
    }
  }

  const update = () => {
    // console.log(JSON.parse(JSON.stringify(testArray)));
    const currentDir = dirRef.current;

    setSnake(snake => {
      const newSnake = snake.map((item, index) => {
        if (index == 0) {
          return {
            x: item.x + currentDir.x,
            y: item.y + currentDir.y
          };
        }
         return {...snake[index-1]};
      });
      return newSnake;
    })

    //food department
    const currentSnake = snakeRef.current;
    if (currentSnake[0].x == food.x && currentSnake[0].y == food.y) {
      console.log(`Found food at x: ${currentSnake[0].x} y: ${currentSnake[0].y}`, {...food})
      setSnake(snake => [...snake, {...food}]);
      spawnFood();
    }

    //handle wall collisions  with reload page
   if (snakeRef.current[0].x < 0 || snakeRef.current[0].y < 0 || snakeRef.current[0].x >= props.width || snakeRef.current[0].y >= props.height) return window.location.reload(); //change reload later to main menue screen

   //handle self collisions with reload page
   const head = snakeRef.current[0];
   if (snakeRef.current.slice(1).some(snake => snake.x === head.x && snake.y === head.y)) return window.location.reload(); //change reload later to main menue screen

  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        direction(event.key);
        console.log('Key pressed:', event.key, props.width);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const drawSnake = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.clear
    //drawSnake each element
    snakeRef.current.forEach((element, index) => {
      if (index == 0) {
        context.fillStyle = 'orange';
        context.fillRect(element.x, element.y, 9, 9);
        context.fillStyle = 'yellow';
      } else {
        context.fillRect(element.x, element.y, 9, 9);
      }

    });
  }

  const drawFood = (context) => {
    context.fillStyle = 'green';

    //drawFood at location
    context.fillRect(food.x, food.y, 9, 9);
  }

  // for re-rendering the current position of each element
  useEffect(() => {
    update();
    const interval = setInterval(update, 100);

    return () => clearInterval(interval);
  }, [dir]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    let animationID;
    const render = () => {
      drawSnake(context);
      drawFood(context);
      animationID = window.requestAnimationFrame(render);
    }
    render()
    return () => window.cancelAnimationFrame(animationID);
  },[food])

  return (
    <>
    <canvas id='canvas' ref={ref} {...props}></canvas>
    </>
  )
}

