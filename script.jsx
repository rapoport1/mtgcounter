import * as React from "react";
import { createRoot } from "react-dom/client";
import { SparkApp, PageContainer, Button, Card } from "@github/spark/components";
import { Plus, Minus, Sword, Heart, Users, PaintBrush } from "@phosphor-icons/react";
import { useKV } from "@github/spark/hooks";

// Predefined colors for players
const PLAYER_COLORS = [
  'bg-accent-1 border-accent-6',
  'bg-accent-secondary-1 border-accent-secondary-6',
  'bg-green-100 border-green-600',
  'bg-red-100 border-red-600',
  'bg-purple-100 border-purple-600',
  'bg-yellow-100 border-yellow-600'
];

// Custom component for tracking commander damage between players
function CommanderDamage({ fromPlayer, toPlayer, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-fg-secondary">From P{fromPlayer + 1}:</span>
      <Button 
        icon={<Minus />} 
        variant="plain"
        onClick={() => onChange(Math.max(0, value - 1))}
      />
      <span className="w-8 text-center">{value}</span>
      <Button 
        icon={<Plus />} 
        variant="plain"
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
}

// Player card component that shows health and commander damage
function PlayerCard({ index, playerCount, life, commanderDamage, onLifeChange, onCommanderDamageChange }) {
  const [expanded, setExpanded] = React.useState(false);
  const colorClasses = PLAYER_COLORS[index];

  return (
    <Card>
      <div className={`p-4 ${colorClasses} rounded-lg border`}>
        {/* Player header with life total */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Player {index + 1}</h2>
          <div className="flex items-center gap-2">
            <Button 
              icon={<Minus />} 
              variant="plain"
              onClick={() => onLifeChange(life - 1)}
            />
            <span className="text-2xl font-bold w-12 text-center">{life}</span>
            <Button 
              icon={<Plus />} 
              variant="plain"
              onClick={() => onLifeChange(life + 1)}
            />
          </div>
        </div>

        {/* Commander damage tracking */}
        <div>
          <Button 
            variant="plain" 
            className="w-full mb-2"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-2">
              <Sword className="text-accent-secondary-9" />
              <span>Commander Damage</span>
            </div>
          </Button>
          
          {expanded && (
            <div className="space-y-2 bg-white bg-opacity-50 p-3 rounded-lg">
              {Array.from({ length: playerCount }).map((_, fromIdx) => {
                if (fromIdx === index) return null;
                return (
                  <CommanderDamage
                    key={fromIdx}
                    fromPlayer={fromIdx}
                    toPlayer={index}
                    value={commanderDamage[fromIdx] || 0}
                    onChange={(value) => onCommanderDamageChange(fromIdx, value)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function App() {
  // State management using Spark's KV store
  const [playerCount, setPlayerCount] = useKV("playerCount", 4);
  const [players, setPlayers] = useKV("players", Array(6).fill().map(() => ({
    life: 40,
    commanderDamage: {}
  })));

  const handleLifeChange = (playerIndex, newLife) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        life: newLife
      };
      return newPlayers;
    });
  };

  const handleCommanderDamageChange = (playerIndex, fromPlayer, damage) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        commanderDamage: {
          ...newPlayers[playerIndex].commanderDamage,
          [fromPlayer]: damage
        }
      };
      return newPlayers;
    });
  };

  const resetGame = () => {
    setPlayers(Array(6).fill().map(() => ({
      life: 40,
      commanderDamage: {}
    })));
  };

  return (
    <SparkApp>
      <PageContainer maxWidth="large">
        <div className="space-y-4 py-4">
          {/* Header controls */}
          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="text-accent-secondary-9" />
              <select
                className="bg-neutral-3 border border-neutral-6 rounded px-2 py-1"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Players</option>
                ))}
              </select>
            </div>
            <Button 
              variant="secondary"
              onClick={resetGame}
            >
              Reset Game
            </Button>
          </div>

          {/* Player cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: playerCount }).map((_, index) => (
              <PlayerCard
                key={index}
                index={index}
                playerCount={playerCount}
                life={players[index].life}
                commanderDamage={players[index].commanderDamage}
                onLifeChange={(newLife) => handleLifeChange(index, newLife)}
                onCommanderDamageChange={(fromPlayer, damage) => 
                  handleCommanderDamageChange(index, fromPlayer, damage)
                }
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </SparkApp>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

