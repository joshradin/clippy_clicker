interface IUnlockCriteria {
    type: string;
}

/**
 * Number of buildings currently owned
 */
export interface SpecificBuildingsOwned extends IUnlockCriteria {
    type: "specific-buildings-owned",
    buildingId: string;
    quantity: number;
}

/**
 * Some other upgrade has already been purchased
 */
export interface UpgradePurchased extends IUnlockCriteria {
    type: "upgrade-purchased",
    upgradeId: number;
}

/**
 * Total number of paperclips made
 */
export interface TotalPaperclips extends IUnlockCriteria {
    type: "total-paperclips",
    quantity: number;
}

export interface UnlockCriteriaBool extends IUnlockCriteria {
    type: "bool";
    must?: UnlockCriteria[];
    should?: UnlockCriteria[];
    not?: UnlockCriteria[];
}

type UnlockCriteria =
    | SpecificBuildingsOwned
    | UpgradePurchased
    | TotalPaperclips
    | UnlockCriteriaBool
    ;


export default UnlockCriteria;