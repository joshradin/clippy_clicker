import { test, expect } from "vitest";
import Game from "./Game.ts";
import UnlockCriteria from "./UnlockCriteria.ts";


test('total-paperclips', () => {
    const game = new Game();
    expect(game.criteriaEvaluator.eval({
        type: "total-paperclips",
        quantity: 1
    })).toBeFalsy();
    game.addPaperclips(1);
    expect(game.criteriaEvaluator.eval({
        type: "total-paperclips",
        quantity: 1
    })).toBeTruthy();
})

test('total-paperclips and specific-buildings-owned', () => {
    const game = new Game();
    const criteria: UnlockCriteria = {
        type: "bool",
        must: [
            {
                type: "total-paperclips",
                quantity: 1
            },
            {
                type: "specific-buildings-owned",
                buildingId: "bender",
                quantity: 1
            }
        ]
    };
    expect(game.criteriaEvaluator.eval(criteria)).toBeFalsy();
    game.addPaperclips(1);
    expect(game.criteriaEvaluator.eval(criteria)).toBeFalsy();
    game.buildingsOwned["bender"] += 1;
    expect(game.criteriaEvaluator.eval(criteria)).toBeTruthy();
})