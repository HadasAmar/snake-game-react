import React, { useState, useEffect, useRef } from "react";
import "./index.css"

const gridSize = 20; // גודל הריבועים
const tileCount = 20; // מספר תאים בלוח

const Game = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // גוף הנחש
    const [food, setFood] = useState({ x: 5, y: 5 }); // המיקום של האוכל
    const [direction, setDirection] = useState({ x: 0, y: 0 }); // הכיוון של הנחש
    const [score, setScore] = useState(0); // הניקוד

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        // מנקה את המסך
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // ציור הנחש
        ctx.fillStyle = "lime";
        snake.forEach(segment => {
          ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
      
        // ציור האוכל
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
      
      }, [snake, food]);
      

    // עדכון תנועה כל 100 מילי-שניות
    useEffect(() => {
        const moveSnake = () => {
            setSnake((prevSnake) => {
                const newHead = {
                    x: prevSnake[0].x + direction.x,
                    y: prevSnake[0].y + direction.y
                };

                if(newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount || prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    // אם הנחש פגע בקיר או בעצמו, המשחק נגמר
                    alert("הפסדת! ניקוד: " + score);
                    setSnake([{ x: 10, y: 10 }]);
                    setDirection({ x: 0, y: 0 });
                    setScore(0);
                    placeFood();
                    return [{ x: 10, y: 10 }];
                }

                // הוספת הראש החדש
                const newSnake = [newHead, ...prevSnake];

                // אם הנחש אכל את האוכל, אנחנו לא מסירים את הזנב
                if (newHead.x === food.x && newHead.y === food.y) {
                    // ניקוד עולה
                    setScore((prevScore) => prevScore + 0.5);
                    // מניחים אוכל חדש
                    placeFood();
                } else {
                    // אם לא אכלנו את האוכל, מסירים את הזנב
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, 100);
        return () => clearInterval(interval);
    }, [direction]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case "ArrowDown":
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case "ArrowLeft":
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case "ArrowRight":
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    const placeFood = () => {
        const newFoodPosition = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
      
        // אם האוכל ייפול על הנחש, נוציא אוכל חדש
        if (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
          return placeFood();
        }
      
        setFood(newFoodPosition);
      };
      

    return (
        <div>
            <h1>משחק נחש</h1>
            <canvas
                ref={canvasRef}
                width={tileCount * gridSize}
                height={tileCount * gridSize}
                style={{ border: "2px solid white", background: "#111" }}
            />
            <p>ניקוד: {score}</p>
        </div>
    );

};

export default Game;
