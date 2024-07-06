import Game from "../Game.ts";

export default interface SavedGame {
    timestamp: number,
    ownedBuildings: Record<string, number>,
    ownedUpgrades: number[],
    current: number,
    currentAscension: number,
    prevAscensions: number[]
}

/**
 * Converts a game to a saved game
 * @param game the game to save
 */
export function toSavedGame(game: Game): SavedGame {
    return {
        timestamp: Date.now(),
        ownedBuildings: game.buildingsOwned,
        ownedUpgrades: [...game.activeUpgrades],
        current: game.paperclips.current,
        currentAscension: game.paperclips.thisAscension,
        prevAscensions: game.paperclips.prevAscensions
    };
}

/**
 * Converts a saved game to a game instance
 * @param savedGame the saved game
 */
export function toGame(savedGame: SavedGame): Game {
    const game = new Game();
    Object.entries(savedGame.ownedBuildings)
        .forEach(([key, value]) => {
            game.buildingsOwned[key] = value;
        });
    savedGame.ownedUpgrades.forEach(upgradeId => {
        game.activeUpgrades.add(upgradeId);
    });

    game.paperclips.current = savedGame.current;
    game.paperclips.thisAscension = savedGame.currentAscension;
    game.paperclips.prevAscensions = savedGame.prevAscensions;

    game.updateData();
    return game;
}