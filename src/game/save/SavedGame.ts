import Game, {ascensionStats, AscensionStats} from "../Game.ts";

export default interface SavedGame {
    timestamp: number,
    ownedBuildings: Record<string, number>,
    ownedUpgrades: number[],
    current: number,
    currentAscension: number | AscensionStats,
    prevAscensions: (number | AscensionStats)[],
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
        const upgrade = game.Upgrades[upgradeId];
        game.applyUpgrade(upgrade);
    });

    game.paperclips.current = savedGame.current;
    if (typeof savedGame.currentAscension === "number") {
        game.paperclips.thisAscension.built = savedGame.currentAscension;
    } else {
        game.paperclips.thisAscension = savedGame.currentAscension;
    }
    for (const prevAscension of savedGame.prevAscensions) {
        let stats = ascensionStats();

        if (typeof prevAscension === "number") {
            stats.built = prevAscension;
        } else {
            stats = prevAscension;
        }

        game.paperclips.prevAscensions.push(stats);
    }

    game.updateData();
    return game;
}