import './App.css';
import {useEffect, useState} from "react";
import Game, {GameContext} from "./game/Game";
import {UpdateProvider} from "./common/update.tsx";
import {GameView} from "./components/game/GameView.tsx";

declare global {
    interface Window {
        Game?: Game
    }
}

function App() {

    const [game, setGame] = useState<Game>();

    useEffect(() => {
        const game = new Game();
        console.log("set game to", game);
        setGame(game);
    }, []);

    useEffect(() => {
        window.Game = game;
    }, [game]);

    if (!game) return null;

    return (
        <UpdateProvider>
            <GameContext.Provider value={game}>
                <GameView />
            </GameContext.Provider>
        </UpdateProvider>
    );
}

export default App;
