import React, { useState, useEffect, useRef } from "react";
import { InputNumber, Button, Row, Col, Card, Typography } from "antd";
import RestartPopup from "./RestartPopup";
import "./Game.css";

function Game({ gameSettings, onRestart, onBackToSetup }) {
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [legStarterIndex, setLegStarterIndex] = useState(0);
  const [inputScore, setInputScore] = useState("");
  const [gameHistory, setGameHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [gameStateHistory, setGameStateHistory] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    const initialPlayers = gameSettings.players.map((player) => ({
      name: player.name,
      score:
        gameSettings.gameVariant === "Around the Clock"
          ? 1
          : parseInt(gameSettings.gameVariant),
      history: [],
      dartsThrown: 0,
      average: 0,
      lastScore: 0,
      legsWon: 0,
    }));
    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setLegStarterIndex(0);
    setWinner(null);
    setGameHistory([]);
    setGameStateHistory([]);
  }, [gameSettings]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPlayerIndex, winner]);

  const handleScoreInput = (value) => {
    setInputScore(value);
  };

  const handleThrow = () => {
    const score = parseInt(inputScore);
    if (!isNaN(score)) {
      const currentGameState = {
        players: JSON.parse(JSON.stringify(players)),
        currentPlayerIndex,
        legStarterIndex,
        winner,
        showPopup,
      };

      setGameStateHistory((prevHistory) => [...prevHistory, currentGameState]);

      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player, index) => {
          if (index === currentPlayerIndex) {
            const updatedPlayer = { ...player };
            updatedPlayer.dartsThrown += 3;
            updatedPlayer.lastScore = score;

            if (gameSettings.gameVariant === "Around the Clock") {
              if (score === updatedPlayer.score) {
                if (updatedPlayer.score === 20) {
                  updatedPlayer.legsWon++;
                } else {
                  updatedPlayer.score++;
                }
              }
            } else {
              if (updatedPlayer.score - score >= 0) {
                updatedPlayer.score -= score;
                if (updatedPlayer.score === 0) {
                  updatedPlayer.legsWon++;
                }
              }
            }

            updatedPlayer.history.push(score);
            updatedPlayer.average =
              updatedPlayer.history.reduce((a, b) => a + b, 0) /
              updatedPlayer.dartsThrown;
            return updatedPlayer;
          }
          return player;
        });
        return updatedPlayers;
      });

      setGameHistory((prevHistory) => [...prevHistory, score]);
      setInputScore("");

      const currentPlayer = players[currentPlayerIndex];

      if (
        (gameSettings.gameVariant === "Around the Clock" &&
          currentPlayer.score === 20 &&
          score === 20) ||
        (gameSettings.gameVariant !== "Around the Clock" &&
          currentPlayer.score - score === 0)
      ) {
        const requiredLegs = Math.ceil(gameSettings.bestOf / 2);
        if (currentPlayer.legsWon + 1 >= requiredLegs) {
          setWinner(currentPlayer);
          setShowPopup(true);
        } else {
          resetLeg();
          setLegStarterIndex((prevIndex) => (prevIndex + 1) % players.length);
          setCurrentPlayerIndex(
            (prevIndex) => (prevIndex + 1) % players.length,
          );
        }
      } else {
        nextPlayer();
      }

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const resetLeg = () => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => ({
        ...player,
        score:
          gameSettings.gameVariant === "Around the Clock"
            ? 1
            : parseInt(gameSettings.gameVariant),
        lastScore: 0,
      }));
    });

    setCurrentPlayerIndex(legStarterIndex);
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  const handleUndo = () => {
    if (gameStateHistory.length > 0) {
      const previousGameState = gameStateHistory[gameStateHistory.length - 1];

      setPlayers(previousGameState.players);
      setCurrentPlayerIndex(previousGameState.currentPlayerIndex);
      setLegStarterIndex(previousGameState.legStarterIndex);
      setWinner(previousGameState.winner);
      setShowPopup(previousGameState.showPopup);

      setGameStateHistory((prevHistory) => prevHistory.slice(0, -1));

      if (gameHistory.length > 0) {
        setGameHistory((prevHistory) => prevHistory.slice(0, -1));
      }

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleRestart = () => {
    setShowPopup(false);
    onRestart();
  };

  const handleBackToSetup = () => {
    setShowPopup(false);
    onBackToSetup();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !winner) {
      handleThrow();
    }
  };

  return (
    <div className="game-container">
      <Row gutter={[16, 16]} className="player-row">
        {players.map((player, index) => (
          <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
            <Card
              className={`player-card ${
                currentPlayerIndex === index ? "active-player" : ""
              } ${legStarterIndex === index ? "leg-starter" : ""}`}
            >
              <div className="player-legs">{player.legsWon}</div>
              <Typography.Title level={3} className="player-name">
                {player.name}
              </Typography.Title>
              <Typography.Title level={2} className="player-score">
                {player.score}
              </Typography.Title>
              <div className="player-stats">
                <Typography.Text>
                  Darts: {player.dartsThrown}
                  <br />
                  Durchschnitt: {player.average.toFixed(2)}
                  <br />
                  Letzter Wurf: {player.lastScore}
                </Typography.Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="input-area">
        <div className="input-container">
          <InputNumber
            ref={inputRef}
            value={inputScore}
            onChange={handleScoreInput}
            onKeyDown={handleKeyPress}
            className="score-input"
            disabled={winner !== null}
            autoFocus
          />
          <Button
            type="primary"
            onClick={handleThrow}
            className="throw-button"
            disabled={winner !== null}
          >
            Werfen
          </Button>
          <Button onClick={handleUndo} className="undo-button">
            Rückgängig
          </Button>
        </div>
      </div>
      <RestartPopup
        visible={showPopup}
        winner={winner ? winner.name : ""}
        players={players}
        onRestart={handleRestart}
        onBackToSetup={handleBackToSetup}
        onClose={handlePopupClose}
      />
    </div>
  );
}

export default Game;
