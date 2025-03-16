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
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [numFailed1, setNumFailed1] = useState(0);
    const [numFailed2, setNumFailed2] = useState(0);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSnake(ctx, snake1, "lime");
        drawSnake(ctx, snake2, "blue");
        drawFood(ctx, food);
    }, [snake1, snake2, food]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSnake1(prev => moveSnake(prev, snake2, dir1, setDir1, setScore1, setNumFailed1));
            setSnake2(prev => moveSnake(prev, snake1, dir2, setDir2, setScore2, setNumFailed2));
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

    const moveSnake = (snake, otherSnake, direction, setDirection, setScore, setNumFailed) => {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount ||
            snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y) ||
            otherSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setNumFailed(prev => prev + 0.5);
            console.log("numFail1: ", numFailed1);
            console.log("numFail2: ", numFailed2);
            setDirection({ x: 0, y: 0 });
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
        ctx.font = `${gridSize}px Arial`;
        ctx.fillText("🍎", food.x * gridSize, (food.y + 1) * gridSize);

    };

    const restartGame = () => {
        setSnake1([{ x: 10, y: 10 }]);
        setSnake2([{ x: 5, y: 5 }]);
        setDir1({ x: 0, y: 0 });
        setDir2({ x: 0, y: 0 });
        setNumFailed1(0);
        setNumFailed2(0);
        placeFood();
    };


    return (
        <div>
            <h1>משחק נחש - שני שחקנים</h1>
            {numFailed1 >= 3 && numFailed2 >= 3 ? (
                <div style={{
                    textAlign: "center",
                    background: "#222",
                    padding: "20px",
                    borderRadius: "10px",
                    color: "white",
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
                }}>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#ff4444" }}>!המשחק נגמר</h1>
                    <button
                        onClick={restartGame}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1.5rem",
                            color: "white",
                            background: "#28a745",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "0.3s"
                        }}>
                        שחק שוב
                    </button>
                </div>

            ) : (

                <canvas ref={canvasRef} width={tileCount * gridSize} height={tileCount * gridSize}
                    style={{ border: "2px solid white", background: "#111" }} />)}

            <div style={{ display: "flex", justifyContent: "center", fontSize: "45px", gap: "40px", margin: 0 }}>
                <h2 style={{ color: "green", margin: 0 }}> {score1}</h2>
                <h2 style={{ margin: 0 }}>:</h2>
                <h2 style={{ color: "blue", margin: 0 }}> {score2}</h2>
            </div>

            {/* {end}&&{<p>akuo</p>} */}

        </div>

    );
};

export default Game;
