import './App.css';
import {useState} from "react";
import Game, {GameContext} from "./game/Game";
import {UpdateProvider} from "./common/update.tsx";
import {GameBoard} from "./components/game/GameBoard.tsx";

declare global {
    interface Window {
        Game: Game
    }
}

const game = new Game();
window.Game = game;
function App() {
    const [game,] = useState<Game>(window.Game);

    if (!game) return null;

    return (
        <UpdateProvider>
            <GameContext.Provider value={game}>
                <GameBoard />
            </GameContext.Provider>
        </UpdateProvider>
    );
}

export default App;
