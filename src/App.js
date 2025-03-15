import React, { useState } from "react";
import GameSetup from "./components/GameSetup";
import Game from "./components/Game";
import { ConfigProvider } from "antd";
import theme from "./theme";
import "./App.css";

function App() {
  const [gameSettings, setGameSettings] = useState(null);
  const [players, setPlayers] = useState([{ name: "" }]);

  const handleStartGame = (settings) => {
    setGameSettings(settings);
  };

  const handleRestartGame = () => {
    setGameSettings((prevSettings) => ({
      ...prevSettings,
      players: prevSettings.players.map((player) => ({
        ...player,
        score:
          prevSettings.gameVariant === "Around the Clock"
            ? 1
            : parseInt(prevSettings.gameVariant),
        history: [],
        dartsThrown: 0,
        average: 0,
        lastScore: 0,
      })),
    }));
  };

  const handleBackToSetup = () => {
    setGameSettings(null);
  };

  const handlePlayersChange = (players) => {
    setPlayers(players);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="app-container">
        {!gameSettings ? (
          <GameSetup
            onStartGame={handleStartGame}
            players={players}
            onPlayersChange={handlePlayersChange}
          />
        ) : (
          <Game
            gameSettings={gameSettings}
            onRestart={handleRestartGame}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
