import Game from "./Game.ts";
import UnlockCriteria from "./UnlockCriteria.ts";

/**
 * Responsible for checking if {@link UnlockCriteria} are met
 */
export class CriteriaEvaluator {
    private readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Checks if the given criteria are met
     * @param criteria the criteria to check against
     * @returns if the criteria is met
     */
    eval(criteria: UnlockCriteria): boolean {
        switch (criteria.type) {
            case "specific-buildings-owned":
                return this.game.getBuildingCount(criteria.buildingId) >= criteria.quantity;
            case "total-paperclips":
                return this.game.paperclips.thisAscension >= criteria.quantity;
            case "bool": {
                if (criteria.must) {
                    for (const must of criteria.must) {
                        if (!this.eval(must)) {
                            return false;
                        }
                    }
                }
                if (criteria.should) {
                    let sum = false;
                    for (const should of criteria.should) {
                        if (this.eval(should)) {
                            sum = true;
                            break;
                        }
                    }
                    if (!sum) return false;
                }

                if (criteria.not) {
                    for (const not of criteria.not) {
                        if (this.eval(not)) {
                            return false;
                        }
                    }
                }

                return true;
            }
            default:
                throw new Error("Invalid criteria type: " + criteria.type);
        }
    }
}