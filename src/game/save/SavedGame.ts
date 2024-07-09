import Game, {ascensionStats, AscensionStats} from "../Game.ts";
import Badge from "../Badge.ts";
import {VERSION} from "lodash";

interface ISavedGame<S extends number | undefined> {
    metadata: S extends number ? {
        gameVersion: string,
        saveFormat: S
    } : undefined
}

interface BaseSavedGame extends ISavedGame<undefined> {
    timestamp: number,
    ownedBuildings: Record<string, number>,
    ownedUpgrades: number[],
    current: number,
    currentAscension: number,
    prevAscensions: number[],
    metadata: undefined
}

interface V1SavedGame extends Omit<BaseSavedGame, "currentAscension" | "prevAscensions" | "metadata">, ISavedGame<0> {
    currentAscension: AscensionStats,
    prevAscensions: AscensionStats[],
}

interface V2SavedGame extends Omit<V1SavedGame, "metadata">, ISavedGame<2> {
    ownedBadges: Badge["id"][],
    activeBadges: Badge["id"][]
}

export type UpToDateSavedGame = V2SavedGame;

export type SavedGame =
    | BaseSavedGame
    | V1SavedGame
    | V2SavedGame
    ;

export default SavedGame;

/**
 * Migrates a saved game to the new version
 * @param game
 */
function migrateSavedGame<S extends SavedGame>(game: S): UpToDateSavedGame {
    let migrated: SavedGame = {...game};
    if (migrated.metadata === undefined) {
        migrated = {
            ...migrated,
            currentAscension: {
                built: migrated.currentAscension, clicks: 0, fromClicks: 0, total: migrated.currentAscension
            },
            prevAscensions: [],
            metadata: {
                gameVersion: APP_VERSION, saveFormat: 0
            }
        };
        const newPrevAscensions = [];
        for (const prevAscension of migrated.prevAscensions) {
            let stats = ascensionStats();

            if (typeof prevAscension === "number") {
                stats.built = prevAscension;
            } else {
                stats = prevAscension;
            }
            newPrevAscensions.push(stats);
        }
        migrated.prevAscensions = newPrevAscensions;

    }
    if (migrated.metadata?.saveFormat < 1) {
        migrated = {
            ...migrated,
            metadata: {
                gameVersion: VERSION,
                saveFormat: 2
            },
            ownedBadges: [],
            activeBadges: []
        };
    }

    return migrated as UpToDateSavedGame;
}

/**
 * Converts a game to a saved game
 * @param game the game to save
 */
export function toSavedGame(game: Game): UpToDateSavedGame {
    return {
        activeBadges: [],
        ownedBadges: [],
        timestamp: Date.now(),
        ownedBuildings: game.buildingsOwned,
        ownedUpgrades: [...game.activeUpgrades],
        current: game.paperclips.current,
        currentAscension: game.paperclips.thisAscension,
        prevAscensions: game.paperclips.prevAscensions,
        metadata: {
            gameVersion: APP_VERSION, saveFormat: 2
        }
    };
}

/**
 * Converts a saved game to a game instance
 * @param anySavedGame the saved game
 */
export function toGame(anySavedGame: SavedGame): Game {
    const game = new Game();
    const savedGame = migrateSavedGame(anySavedGame);

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
    game.paperclips.thisAscension = savedGame.currentAscension;


    game.updateData();
    return game;
}