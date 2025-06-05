import {useState, useEffect, useRef} from 'react'

const testArray = [{x: 40, y: 20},{x: 40, y: 10},{x: 30, y: 10},{x: 20, y: 10},{x: 10, y: 10},{x: 10, y: 20}]; //change to useState


export default function Canvas(props) {
  const ref = useRef();
  const [dir, setDir] = useState({ x: 10, y: 0 });
  const [food, setFood] = useState({x: 200, y:200});

    const spawnFood = () => {
      const newFood = {x: Math.floor(Math.random()*800), y: Math.floor(Math.random()*500)} // change 800 and 500 to variable
      if (testArray[0].x == food.x && testArray[0].y == food.y) {
        spawnFood();
      } else {
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
    for (let i = testArray.length-1; i >= 0; i--) {
      if (i == 0) {
        testArray[i] = {x: testArray[i].x + dir.x, y: testArray[i].y + dir.y}
      } else {
        testArray[i] = testArray[i-1];
      }
    }
    if (testArray[0].x == food.x && testArray[0].y == food.y) {
      testArray.push(food);
      setFood({});
      spawnFood();
    }
    // console.log(JSON.parse(JSON.stringify(testArray)));
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        direction(event.key);
        console.log('Key pressed:', event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const drawSnake = (context) => {
    context.clearRect(0,0,context.canvas.width, context.canvas.height);
    context.fillStyle = 'orange';

    //drawSnake each element
    testArray.forEach(element => {
      context.fillRect(element.x, element.y, 9, 9);
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
  },[])

  return (
    <>
    <canvas ref={ref} {...props}></canvas>
    </>
  )
}

