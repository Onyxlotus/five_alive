import { useState } from "react";
import GameScreen from "./components/GameScreen";
import RulesScreen from "./components/RulesScreen";

export default function FiveAlive() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="container">
      {screen === "menu" && (
        <div className="card">
          <h1 className="title">Five Alive</h1>
          <button className="button" onClick={() => setScreen("game")}>Играть</button>
          <button className="button" onClick={() => setScreen("rules")}>Правила</button>
          <button className="button" onClick={() => setScreen("settings")}>Настройки</button>
        </div>
      )}
      {screen === "game" && <GameScreen onBack={() => setScreen("menu")} />}
      {screen === "rules" && <RulesScreen onBack={() => setScreen("menu")} />}
      {screen === "settings" && <SettingsScreen onBack={() => setScreen("menu")} />}
    </div>
  );
}

function SettingsScreen({ onBack }) {
  return (
    <div className="screen">
      <h2 className="subtitle">Настройки</h2>
      <p>Здесь будут настройки игры.</p>
      <button className="button" onClick={onBack}>Назад</button>
    </div>
  );
}