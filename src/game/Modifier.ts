export type ModifierClassification =
    | "building-pcps"
    | "per-click"
    | "build-time"
    ;

interface BaseModifier {
    classification: ModifierClassification;
    type: string
}

export interface BuildingModifier extends BaseModifier {
    /**
     * The target building
     */
    buildingId: string
}

interface BuildingPcpsModifier extends BuildingModifier {
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
    multiplier: number,
    multiplierKind: "additive"
}

export interface PerClickAddition extends BaseModifier{
    classification: "per-click";
    type: "per-click-addition"
    quantity: number
}

export interface PerClickAdditionFromBuildingQuantity extends BaseModifier {
    classification: "per-click";
    type: "per-click-addition-from-building"
    buildingId: string,
    quantity: number
}

export interface PerClickAdditionFromPcps extends BaseModifier {
    classification: "per-click";
    type: "per-click-addition-from-pcps",
    /**
     * Provides per-click pcps
     */
    percentage: number
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
    | PerClickAdditionFromPcps
    | BuildTimeReduction
    | BuildTimeReductionPerBuilding
    ;
export default Modifier;



