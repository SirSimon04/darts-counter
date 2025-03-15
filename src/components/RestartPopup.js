import React from "react";
import {
  Modal,
  Button,
  Typography,
  Table,
  Card,
  Statistic,
  Row,
  Col,
} from "antd";

function RestartPopup({
  visible,
  winner,
  players,
  onRestart,
  onBackToSetup,
  onClose,
}) {
  const { Title } = Typography;

  // Tabellenspalten für die Spielerstatistik
  const columns = [
    {
      title: "Spieler",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gewonnene Legs",
      dataIndex: "legsWon",
      key: "legsWon",
      sorter: (a, b) => a.legsWon - b.legsWon,
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "Geworfene Darts",
      dataIndex: "dartsThrown",
      key: "dartsThrown",
    },
    {
      title: "Durchschnitt",
      dataIndex: "average",
      key: "average",
      render: (average) => average.toFixed(2),
      sorter: (a, b) => a.average - b.average,
    },
    {
      title: "Höchster Wurf",
      dataIndex: "highestThrow",
      key: "highestThrow",
    },
  ];

  // Daten für die Tabelle aufbereiten, mit höchstem Wurf
  const tableData = players
    ? players.map((player) => ({
        key: player.name,
        name: player.name,
        legsWon: player.legsWon,
        dartsThrown: player.dartsThrown,
        average: player.average,
        highestThrow:
          player.history.length > 0 ? Math.max(...player.history) : 0,
      }))
    : [];

  // Finde den besten Durchschnitt und den Spieler mit dem besten Durchschnitt
  let bestAveragePlayer = null;
  let bestAverage = 0;
  if (players && players.length > 0) {
    bestAverage = Math.max(...players.map((player) => player.average));
    bestAveragePlayer = players.find(
      (player) => player.average === bestAverage,
    );
  }

  // Finde den höchsten Wurf im Spiel und den dazugehörigen Spieler
  let highestThrowPlayer = null;
  let highestThrowInGame = 0;
  if (players && players.length > 0) {
    players.forEach((player) => {
      if (player.history.length > 0) {
        const playerHighest = Math.max(...player.history);
        if (playerHighest > highestThrowInGame) {
          highestThrowInGame = playerHighest;
          highestThrowPlayer = player;
        }
      }
    });
  }

  // Finde die Gesamtzahl der geworfenen Darts
  const totalDartsThrown =
    players && players.length > 0
      ? players.reduce((sum, player) => sum + player.dartsThrown, 0)
      : 0;

  return (
    <Modal
      title={<Title level={3}>Spiel beendet</Title>}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="back" onClick={onBackToSetup}>
          Zurück zur Spielauswahl
        </Button>,
        <Button key="submit" type="primary" onClick={onRestart}>
          Erneut spielen
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "20px" }}>
        {winner && (
          <Title level={4} style={{ textAlign: "center", color: "#1890ff" }}>
            🏆 {winner} hat gewonnen! 🏆
          </Title>
        )}
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Bester Durchschnitt"
              value={bestAverage.toFixed(2)}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix={bestAveragePlayer ? `(${bestAveragePlayer.name})` : ""}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Höchster Wurf"
              value={highestThrowInGame}
              valueStyle={{ color: "#cf1322" }}
              suffix={highestThrowPlayer ? `(${highestThrowPlayer.name})` : ""}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Geworfene Darts"
              value={totalDartsThrown}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Title level={5}>Spielerstatistiken</Title>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        size="small"
      />
    </Modal>
  );
}

export default RestartPopup;
