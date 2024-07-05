import Modifier, {
    BuildingPcpsMultiplierFromBuildingQuantity, BuildTimeReduction, BuildTimeReductionPerBuilding,
    PerClickAdditionFromBuildingQuantity
} from "./Modifier.ts";

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


export const baseModifiers: readonly Modifier[] = [
    perClickFromBuilding("bender", 0.1),
    buildTimeReductionPerBuilding(0.75, 10)
];
