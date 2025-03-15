import React, { useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Radio,
  Divider,
  Badge,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  TrophyOutlined,
  AimOutlined,
} from "@ant-design/icons";
import "./GameSetup.css";

function GameSetup({ onStartGame }) {
  const [players, setPlayers] = useState([{ name: "", id: Date.now() }]);
  const [gameVariant, setGameVariant] = useState("501");
  const [bestOf, setBestOf] = useState(3);

  const addPlayer = () => {
    setPlayers([...players, { name: "", id: Date.now() }]);
  };

  const removePlayer = (id) => {
    if (players.length > 1) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const handlePlayerNameChange = (id, value) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, name: value } : player,
    );
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    const validPlayers = players.filter((player) => player.name.trim());
    if (validPlayers.length < 1) return;

    onStartGame({
      players: validPlayers,
      gameVariant,
      bestOf,
    });
  };

  const { Title, Text } = Typography;

  return (
    <Card className="setup-container" bordered={false}>
      <div className="setup-header">
        <Title level={2}>
          <AimOutlined /> Darts Scorekeeper
        </Title>
        <Text type="secondary">Konfiguriere dein Dartspiel</Text>
      </div>

      <Divider orientation="left">Spieler</Divider>

      <div className="player-list">
        {players.map((player, index) => (
          <div key={player.id} className="player-input-row">
            <Badge count={index + 1} color="#4096ff" offset={[0, 32]}>
              <Avatar
                size={40}
                className="player-avatar"
                style={{ backgroundColor: player.name ? "#4096ff" : "#d9d9d9" }}
              >
                {player.name ? player.name[0]?.toUpperCase() : index + 1}
              </Avatar>
            </Badge>
            <Input
              placeholder={`Spieler ${index + 1}`}
              value={player.name}
              onChange={(e) =>
                handlePlayerNameChange(player.id, e.target.value)
              }
              className="player-input"
            />
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              disabled={players.length <= 1}
              onClick={() => removePlayer(player.id)}
              className="remove-button"
            />
          </div>
        ))}
      </div>

      <Button
        icon={<PlusOutlined />}
        onClick={addPlayer}
        className="add-player-button"
        disabled={players.length >= 8}
      >
        Spieler hinzufügen
      </Button>

      <Divider orientation="left">Spielvariante</Divider>

      <div className="game-options">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              title="Spielmodus"
              size="small"
              className="option-card"
              headStyle={{ backgroundColor: "#414559" }}
            >
              <Radio.Group
                value={gameVariant}
                onChange={(e) => setGameVariant(e.target.value)}
                buttonStyle="solid"
                className="radio-group"
              >
                <Radio.Button value="301">301</Radio.Button>
                <Radio.Button value="501">501</Radio.Button>
                <Radio.Button value="Around the Clock">
                  Around the Clock
                </Radio.Button>
              </Radio.Group>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Satzformat"
              size="small"
              className="option-card"
              headStyle={{ backgroundColor: "#414559" }}
            >
              <Radio.Group
                value={bestOf}
                onChange={(e) => setBestOf(e.target.value)}
                buttonStyle="solid"
                className="radio-group"
              >
                <Radio.Button value={3}>Best of 3</Radio.Button>
                <Radio.Button value={5}>Best of 5</Radio.Button>
                <Radio.Button value={7}>Best of 7</Radio.Button>
                <Radio.Button value={9}>Best of 9</Radio.Button>
              </Radio.Group>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="start-button-container">
        <Button
          type="primary"
          size="large"
          icon={<TrophyOutlined />}
          onClick={startGame}
          className="start-button"
          disabled={!players.some((p) => p.name.trim())}
        >
          Spiel starten
        </Button>
      </div>
    </Card>
  );
}

export default GameSetup;
