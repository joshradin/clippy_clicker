import Modifier, {
    BuildingPcpsMultiplierFromBuildingQuantity, BuildTimeReduction, BuildTimeReductionPerBuilding,
    PerClickAdditionFromBuildingQuantity
} from "./Modifier.ts";
import {buildingTitle} from "./Building.ts";

/**
 * Creates a per-click-addition-from-building modifier
 * @param buildingId the building id
 * @param quantity the quantity per click from each building
 */
export function perClickFromBuilding(buildingId: string, quantity: number = 1): PerClickAdditionFromBuildingQuantity {
    return {classification: "per-click", type: "per-click-addition-from-building", buildingId, quantity};
}

export function buildingPcpsMultiplierFromBuildingQuantity(sourceBuilding: string, targetBuilding: string, multiplier: number): BuildingPcpsMultiplierFromBuildingQuantity {
    return {
        classification: "building-pcps",
        multiplier,
        multiplierKind: "additive",
        sourceBuildingId: sourceBuilding,
        buildingId: targetBuilding,
        type: "building-pcps-multiplier-from-building-quantity"
    };
}

export function buildTimeReduction(reduction: number): BuildTimeReduction {
    return {
        classification: "build-time", reduction, type: "build-time-reduction"
    };
}

export function buildTimeReductionPerBuilding(reduction: number, count: number = 1, buildingId?: string): BuildTimeReductionPerBuilding {
    return {
        classification: "build-time",
        type: "build-time-reduction-per-building",
        buildingId: buildingId,
        count,
        reduction
    };
}

/**
 * Converts a modifier to a list of strings to get its description
 * @param modifier the modifier
 */
export function modifierToDescription(modifier: Modifier): string[] {
    switch (modifier.type) {
        case "per-click-addition":
            return [
                `Adds ${modifier.quantity} to every click`
            ];
        case "building-pcps-multiplier":
            return [
                `${modifier.multiplier}x ${buildingTitle(modifier.buildingId)} effectiveness`
            ];
        case "building-pcps-multiplier-from-building-quantity":
            return [
                `Adds ${modifier.multiplier} to ${buildingTitle(modifier.buildingId)} for every ${buildingTitle(modifier.sourceBuildingId)}`
            ];
        case "per-click-addition-from-building":
            return [
                `Adds ${modifier.quantity} to every click for each ${modifier.buildingId}`
            ];
        case "build-time-reduction":
            return [
                `Reduces build time by ${modifier.reduction * 100}%`
            ];
        case "build-time-reduction-per-building":
            return [
                `Reduces build time by ${modifier.reduction * 100}% for each${modifier.buildingId ? buildingTitle(modifier.buildingId) : " building"}`
            ];

    }
}

export const baseModifiers: readonly Modifier[] = [
    perClickFromBuilding("bender", 0.1),
    buildTimeReductionPerBuilding(0.75, 10)
];
