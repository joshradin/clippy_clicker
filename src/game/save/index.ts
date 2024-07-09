import utf8 from "utf8";
import base64 from "base-64";
import Game from "../Game.ts";
import BaseSavedGame, {toGame, toSavedGame} from "./SavedGame.ts";

const SAVE_STATE_KEY = "clippy_clicker_save";

export function saveGame(game: Game) {
    const savedGame = toSavedGame(game);
    const text = JSON.stringify(savedGame);
    const bytes = utf8.encode(text);
    const encoded = base64.encode(bytes);
    localStorage.setItem(SAVE_STATE_KEY, encoded);
}

export function loadGame(): Game | null {
    const encoded = localStorage.getItem(SAVE_STATE_KEY);
    if (!encoded) {
        return null;
    }
    const bytes = base64.decode(encoded);
    const text = utf8.decode(bytes);

    const savedGame = JSON.parse(text) as BaseSavedGame;
    return toGame(savedGame);
}