export interface BaseModifier {
    classification: string;
    type: string
}

interface BuildingPcpsModifier extends BaseModifier {
    classification: "building-pcps";
    multiplierKind: "additive" | "multiplicative";
}

export interface BuildingPcpsMultiplier extends BuildingPcpsModifier {
    type: "building-pcps-multiplier",
    buildingId: string,
    multiplier: number,
    multiplierKind: "multiplicative"
}

export interface BuildingPcpsMultiplierFromBuildingQuantity extends BuildingPcpsModifier {
    type: "building-pcps-multiplier-from-building-quantity",
    sourceBuildingId: string,
    targetBuildingId: string,
    multiplier: number,
    multiplierKind: "additive"
}

export interface PerClickAddition extends BaseModifier{
    classification: "per-click";
    type: "per-click-addition"
    quantity: number
}

export interface PerClickAdditionFromBuildingQuantity extends BaseModifier{
    classification: "per-click";
    type: "per-click-addition-from-building"
    buildingId: string,
    quantity: number
}

export interface BuildTimeReduction extends BaseModifier {
    classification: "build-time";
    type: "build-time-reduction";
    reduction: number;
}

export interface BuildTimeReductionPerBuilding extends BaseModifier {
    classification: "build-time";
    type: "build-time-reduction-per-building";
    reduction: number;
    buildingId?: string,
    count: number
}


type Modifier =
    | BuildingPcpsMultiplier
    | BuildingPcpsMultiplierFromBuildingQuantity
    | PerClickAddition
    | PerClickAdditionFromBuildingQuantity
    | BuildTimeReduction
    | BuildTimeReductionPerBuilding
    ;
export default Modifier;



