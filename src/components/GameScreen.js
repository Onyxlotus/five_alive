import React, { useState, useEffect } from "react";
import heart from './../images/heard.png';
import skull from './../images/skull.webp';
import { motion } from "framer-motion";

export default function GameScreen({ onBack }) {
    function drawCard() {
        return Math.floor(Math.random() * 10) + 1;
    }

    const [playerLives, setPlayerLives] = useState(5);
    const [botLives, setBotLives] = useState(5);
    const [playerHand, setPlayerHand] = useState([drawCard(), drawCard()]);
    const [botHand, setBotHand] = useState([drawCard(), drawCard()]);
    const [currentSum, setCurrentSum] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isBotTurn, setIsBotTurn] = useState(false);

    function playCard(card) {
        setPlayerHand(([first, second]) => (first === card ? [second, drawCard()] : [first, drawCard()]));

        const newSum = currentSum + card;
        if (newSum > 21) {
            setPlayerLives((prevLives) => {
                const updatedLives = prevLives - 1;
                checkGameOver(updatedLives, botLives);
                return updatedLives;
            });
        } else {
            setCurrentSum(newSum);
            setIsBotTurn(true);
            setTimeout(() => botTurn(newSum), 1000);
        }
    }

    function botTurn(sum) {
        const botCard = botHand[0];

        setBotHand(([first, second]) => [second, drawCard()]);

        const newSum = sum + botCard;
        if (newSum > 21) {
            setBotLives((prevLives) => {
                const updatedLives = prevLives - 1;
                checkGameOver(playerLives, updatedLives);
                return updatedLives;
            });
        } else {
            setCurrentSum(newSum);
        }

        setIsBotTurn(false);
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
        setPlayerHand([drawCard(), drawCard()]);
        setBotHand([drawCard(), drawCard()]);
    }

    function restartGame() {
        setPlayerLives(5);
        setBotLives(5);
        setPlayerHand([drawCard(), drawCard()]);
        setBotHand([drawCard(), drawCard()]);
        setCurrentSum(0);
        setGameOver(false);
        setWinner(null);
        setIsBotTurn(false);
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
                                className="card-button"
                                onClick={() => playCard(card)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {card}
                            </motion.button>
                        ))
                    )}
                </div>
            )}
            <button className="button" onClick={onBack}>Назад</button>
        </div>
    );
}