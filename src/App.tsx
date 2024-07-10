import './App.css';
import React, {useState} from "react";
import Game, {GameContext} from "./game/Game";
import {UpdateProvider} from "./common/update.tsx";
import {GameBoard} from "./components/game/GameBoard.tsx";
import {loadGame, saveGame} from "./game/save";

declare global {
    interface Window {
        Game: Game
    }
}


function App() {
    const [game, setGame] = useState<Game>(window.Game);
    const [lastSaved, setLastSaved] = useState<undefined | number>();

    React.useEffect(() => {
        const game = loadGame() || new Game();
        setGame(game);
    }, []);

    React.useEffect(() => {
        window.Game = game;
        const handle = setInterval(() => {
            if (game) {
                saveGame(game);
                setLastSaved(Date.now());
            }
        }, 15_000);

        return () => {
            clearInterval(handle);
        };
    }, [game]);

    React.useEffect(() => {
        if (lastSaved) {
            console.debug("Game saved!");
        }
    }, [lastSaved]);

    const resetGame = () => {
        setGame(new Game());
    };

    if (!game) return null;

    return (
        <UpdateProvider>
            <button className={"absolute left-1 bottom-1 hover:border-red-600 text-red-700"} onClick={resetGame}> Reset game</button>
            <GameContext.Provider value={game}>
                <GameBoard />
            </GameContext.Provider>
        </UpdateProvider>
    );
}

export default App;
