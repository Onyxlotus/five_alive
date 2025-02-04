import React, { useState } from "react";
import heart from "./../images/heard.png";
import skull from "./../images/skull.webp";
import { motion } from "framer-motion";

export default function GameScreen({ onBack }) {
    function drawCard() {
        const specialCards = [0, -1, -2]; // Reset и Skip
        return Math.random() < 0.1 ? specialCards[Math.floor(Math.random() * specialCards.length)] : Math.floor(Math.random() * 10) + 1;
    }

    const cardClasses = {
        "0": "card-reset",
        "-1": "card-skip",
        "-2": "card-bomb",
        "1": "card-one",
        "2": "card-two",
        "3": "card-three",
        "4": "card-four",
        "5": "card-five",
        "6": "card-six",
        "7": "card-seven",
        "8": "card-eight",
        "9": "card-nine",
        "10": "card-ten"
    };

    const [playerLives, setPlayerLives] = useState(5);
    const [botLives, setBotLives] = useState(5);
    const [playerHand, setPlayerHand] = useState([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
    const [botHand, setBotHand] = useState([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
    const [currentSum, setCurrentSum] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isBotTurn, setIsBotTurn] = useState(false);
    const [lastBotCard, setLastBotCard] = useState(null);

    function playCard(card) {
        if (gameOver) return;

        setPlayerHand((prevHand) => {
          const newHand = [...prevHand];
          const index = prevHand.indexOf(card);
          if (index !== -1) newHand[index] = drawCard();
          return newHand;
        });

        if (card === 0) {
            setCurrentSum(0);
            setIsBotTurn(true);
            setTimeout(() => botTurn(0), 1000);
            return;
        } else if (card === -1) {
            setIsBotTurn(true);
            setTimeout(() => botTurn(currentSum), 1000);
            return;
        } else if (card === -2) {
            triggerBomb();
            setIsBotTurn(true);
            setTimeout(() => botTurn(currentSum), 1000);
            return;
        }

        const newSum = currentSum + card;
        if (newSum > 21) {
            const newPlayerLives = playerLives - 1;
            checkGameOver(newPlayerLives, botLives);
            setPlayerLives(newPlayerLives);
        } else {
            setCurrentSum(newSum);
            setIsBotTurn(true);
            setTimeout(() => botTurn(newSum), 1000);
        }
    }

    function botTurn(sum) {
        if (gameOver) return;

        let botCard = botHand.find((card) => card + sum <= 21) || botHand[0];
        if (botHand.includes(0) && sum > 15) {
            botCard = 0;
        } else if (botHand.includes(-1) && Math.random() < 0.5) {
           botCard = -1;
        } else if (botHand.includes(-2) && Math.random() < 0.2) {
            botCard = -2;
        }
        

        setBotHand((prevHand) => {
          const newHand = [...prevHand];
          const index = prevHand.indexOf(botCard);
          if (index !== -1) newHand[index] = drawCard();
          return newHand;
        });
        setLastBotCard(botCard);

        if (botCard === -1) {
            setIsBotTurn(false);
            return;
        } else
        if (botCard === 0) {
          setCurrentSum(0);
          setIsBotTurn(false);
          return;
      } else if (botCard === -2) {
          triggerBomb();
          setIsBotTurn(false);
          return;
      }

        const newSum = sum + botCard;
        if (newSum > 21) {
            const newBotLives = botLives - 1;
            checkGameOver(playerLives, newBotLives);
            setBotLives(newBotLives);
        } else {
            setCurrentSum(newSum);
        }

        setIsBotTurn(false);
    }

    function triggerBomb() {
        const playerDraw = drawCard();
        const botDraw = drawCard();

        if (playerDraw < botDraw) {
            setPlayerLives((lives) => lives - 1);
        } else if (botDraw < playerDraw) {
            setBotLives((lives) => lives - 1);
        }
    }

    function checkGameOver(updatedPlayerLives, updatedBotLives) {
        if (updatedPlayerLives <= 0) {
            setGameOver(true);
            setWinner("Бот");
        } else if (updatedBotLives <= 0) {
            setGameOver(true);
            setWinner("Игрок");
        } else {
            resetRound();
        }
    }

    function resetRound() {
        setCurrentSum(0);
        setPlayerHand([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
        setBotHand([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
        setLastBotCard(null);
    }

    function restartGame() {
        setPlayerLives(5);
        setBotLives(5);
        setPlayerHand([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
        setBotHand([drawCard(), drawCard(), drawCard(), drawCard(), drawCard()]);
        setCurrentSum(0);
        setGameOver(false);
        setWinner(null);
        setIsBotTurn(false);
        setLastBotCard(null);
    }

    function renderLives(lives) {
        return (
            <div className="lives-container">
                {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="life-card"
                        animate={{ rotateY: index >= lives ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src={index >= lives ? skull : heart}
                            alt="life"
                            className="life-icon"
                            width="25px"
                            height="25px"
                        />
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="screen game-screen">
            <h2 className="subtitle">Игровое поле</h2>
            <p>Текущая сумма: {currentSum}</p>
            <div className="lives-wrapper">
                <div>
                    <h3>Жизни игрока:</h3>
                    {renderLives(playerLives)}
                </div>
                <div>
                    <h3>Жизни бота:</h3>
                    {renderLives(botLives)}
                </div>
            </div>
            {lastBotCard !== null && <p>Бот сыграл: {lastBotCard === 0 ? "RESET" : lastBotCard === -1 ? "SKIP" : lastBotCard === -2 ? "BOMB" : lastBotCard}</p>}
            {gameOver ? (
                <div className="game-over">
                    <h3>{winner === "Игрок" ? "Поздравляем, вы победили!" : "К сожалению, вы проиграли!"}</h3>
                    <button className="button" onClick={restartGame}>Начать заново</button>
                </div>
            ) : (
                <div>
                    <h3>Ваши карты</h3>
                    {isBotTurn ? (
                        <p>Ход противника...</p>
                    ) : (
                        playerHand.map((card, index) => (
                            <motion.button
                                key={index}
                                className={`card-button ${cardClasses[card] || ""}`}
                                onClick={() => playCard(card)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {card === 0 ? "RESET" : card === -1 ? "SKIP" : card === -2 ? "BOMB" : card}
                            </motion.button>
                        ))
                    )}
                </div>
            )}
            <button className="button" onClick={onBack}>Назад</button>
        </div>
    );
}