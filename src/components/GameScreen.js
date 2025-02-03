import React, { useState } from "react";

export default function GameScreen({ onBack }) {
    const [playerLives, setPlayerLives] = useState(5);
    const [botLives, setBotLives] = useState(5);
    const [playerHand, setPlayerHand] = useState(drawCards(2));
    const [botHand, setBotHand] = useState(drawCards(2));
    const [currentSum, setCurrentSum] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
  
    function drawCards(count) {
      return Array.from({ length: count }, () => Math.floor(Math.random() * 10) + 1);
    }
  
    function renderLives(lives) {
      return (
        <div className="lives-container">
          {Array.from({ length: lives }).map((_, index) => (
            <img key={index} src="/images/heart.png" alt="life" className="life-icon" />
          ))}
        </div>
      );
    }
  
    function playCard(card) {
      const newSum = currentSum + card;
      if (newSum > 21) {
        setPlayerLives(prevLives => prevLives - 1);
        checkGameOver(playerLives - 1, botLives);
      } else {
        setCurrentSum(newSum);
        botTurn(newSum);
      }
    }
  
    function botTurn(sum) {
      setTimeout(() => {
        const botCard = botHand[0];
        const newSum = sum + botCard;
        if (newSum > 21) {
          setBotLives(prevLives => prevLives - 1);
          checkGameOver(playerLives, botLives - 1);
        } else {
          setCurrentSum(newSum);
        }
      }, 1000);
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
      setPlayerHand(drawCards(2));
      setBotHand(drawCards(2));
    }
  
    function restartGame() {
      setPlayerLives(5);
      setBotLives(5);
      setPlayerHand(drawCards(2));
      setBotHand(drawCards(2));
      setCurrentSum(0);
      setGameOver(false);
      setWinner(null);
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
            {playerHand.map((card, index) => (
              <button key={index} className="card-button" onClick={() => playCard(card)}>
                {card}
              </button>
            ))}
          </div>
        )}
        <button className="button" onClick={onBack}>Назад</button>
      </div>
    );
  }