import React, { useState, useEffect, useRef } from "react";
import "./index.css";

const gridSize = 20;
const tileCount = 20;

const Game = () => {
    const [snake1, setSnake1] = useState([{ x: 5, y: 5 }]);
    const [snake2, setSnake2] = useState([{ x: 15, y: 15 }]);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [dir1, setDir1] = useState({ x: 0, y: 0 });
    const [dir2, setDir2] = useState({ x: 0, y: 0 });
    const [score1, setScore1] = useState(3);
    const [score2, setScore2] = useState(3);
    const [end, setEnd] = useState(false)
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSnake(ctx, snake1, "lime");
        drawSnake(ctx, snake2, "blue");
        drawFood(ctx, food);
    }, [snake1, snake2, food]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSnake1(prev => moveSnake(prev, snake2, dir1, setScore1));
            setSnake2(prev => moveSnake(prev, snake1, dir2, setScore2));
        }, 100);
        return () => clearInterval(interval);
    }, [dir1, dir2]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp": if (dir1.y === 0) setDir1({ x: 0, y: -1 }); break;
                case "ArrowDown": if (dir1.y === 0) setDir1({ x: 0, y: 1 }); break;
                case "ArrowLeft": if (dir1.x === 0) setDir1({ x: -1, y: 0 }); break;
                case "ArrowRight": if (dir1.x === 0) setDir1({ x: 1, y: 0 }); break;
                case "w": if (dir2.y === 0) setDir2({ x: 0, y: -1 }); break;
                case "s": if (dir2.y === 0) setDir2({ x: 0, y: 1 }); break;
                case "a": if (dir2.x === 0) setDir2({ x: -1, y: 0 }); break;
                case "d": if (dir2.x === 0) setDir2({ x: 1, y: 0 }); break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dir1, dir2]);

    const moveSnake = (snake, otherSnake, direction, setScore) => {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount ||
            snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y) ||
            otherSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            // alert("הפסדת!");
            setScore(prev => prev > 0 ? prev - 0.5 : setEnd(true))

            return [{ x: 10, y: 10 }];
        }
        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
            setScore(prev => prev + 0.5);
            placeFood();
        } else {
            newSnake.pop();
        }
        return newSnake;
    };

    const placeFood = () => {
        const newFood = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
        if (snake1.concat(snake2).some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return placeFood();
        }
        setFood(newFood);
    };

    const drawSnake = (ctx, snake, color) => {
        ctx.fillStyle = color;
        snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
    };

    const drawFood = (ctx, food) => {
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    };

    return (
        <div>
            <h1>משחק נחש - שני שחקנים</h1>
            <canvas ref={canvasRef} width={tileCount * gridSize} height={tileCount * gridSize}
                style={{ border: "2px solid white", background: "#111" }} />
            <div style={{display:"flex", justifyContent:"center", fontSize:"45px", gap:"40px", margin:0}}>
                <h2 style={{color:"green", margin:0}}> {score1}</h2>
                <h2 style={{margin:0}}>:</h2>
                <h2 style={{color:"blue", margin:0}}> {score2}</h2>
            </div>

            {/* {end}&&{<p>akuo</p>} */}

        </div>

    );
};

export default Game;
