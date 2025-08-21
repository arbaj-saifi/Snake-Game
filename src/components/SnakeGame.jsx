import React, { useEffect, useState, useRef } from "react";

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 200, y: 200 }]);
  const canvasRef = useRef(null);
  const [direction, setDirection] = useState("Right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const box = 20;
  const canvasSize = 400;

  function getRandomFood() {
    return {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  }

  const [food, setFood] = useState(getRandomFood());

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp" && direction !== "Down") setDirection("Up");
      if (e.key === "ArrowDown" && direction !== "Up") setDirection("Down");
      if (e.key === "ArrowRight" && direction !== "Left") setDirection("Right");
      if (e.key === "ArrowLeft" && direction !== "Right") setDirection("Left");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const ctx = canvasRef.current.getContext("2d");

    const interval = setInterval(() => {
      // clear
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, box, box);

      // snake
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(s.x, s.y, box, box);
      });

      // move
      const head = { ...snake[0] };
      if (direction === "Up") head.y -= box;
      if (direction === "Down") head.y += box;
      if (direction === "Left") head.x -= box;
      if (direction === "Right") head.x += box;

      // wall collision
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize
      ) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      // self collision
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          setGameOver(true);
          clearInterval(interval);
          return;
        }
      }

      // eat
      const next = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomFood());
        setScore((s) => s + 1);
      } else {
        next.pop();
      }
      setSnake(next);
    }, 250);

    return () => clearInterval(interval);
  }, [snake, food, direction, gameOver]);

  const restart = () => {
    setSnake([{ x: 200, y: 200 }]);
    setFood(getRandomFood());
    setDirection("Right");
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-wrap">
      <div className="game">
        <h2>🐍 Snake Game</h2>

        <div className="hud">
          <span className="badge">Score&nbsp;:&nbsp;{score}</span>
          <button className="btn" onClick={restart}>
            Restart
          </button>
        </div>

        <div className="canvas-wrap">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            width={canvasSize}
            height={canvasSize}
          />
          {gameOver && (
            <div className="overlay">
              <div className="overlay-card">
                <h3>Game Over!</h3>
                <p>Score: {score}</p>
                <button className="btn" onClick={restart}>
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="hint">Use Arrow Keys to move</p>
      </div>
      <div className="controls">
        <button onClick={() => setDirection("Up")}>⬆️</button>
        <div>
          <button onClick={() => setDirection("Left")}>⬅️</button>
          <button onClick={() => setDirection("Down")}>⬇️</button>
          <button onClick={() => setDirection("Right")}>➡️</button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
