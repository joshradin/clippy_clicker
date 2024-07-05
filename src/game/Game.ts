import React, {useContext} from 'react';
import Building, {loadBuildings} from "./Building.ts";
import ModifierContainer from "./ModifierContainer.ts";
import {baseModifiers} from "./modifiers.ts";
import {CriteriaEvaluator} from "./CriteriaEvaluator.ts";
import Upgrade, {loadUpgrades} from "./Upgrade.ts";

/**
 * Used for representing the state of a game
 */
export default class Game {
    readonly paperclips: Paperclips;
    clicks: number;

    /**
     * The time to build manually
     */
    buildTime: number;
    /**
     * Provides access to all building types
     */
    readonly Buildings: Record<string, Readonly<Building>>;
    readonly Upgrades: Record<number, Upgrade>;


    readonly buildingsOwned: Record<string, number>;
    readonly activeUpgrades: Set<number>;
    readonly modifiers: ModifierContainer;
    readonly criteriaEvaluator: CriteriaEvaluator;


    private _lastUpdated: number;
    private _dataLastUpdated: number;


    constructor() {
        this.paperclips = {
            current: 0,
            bonus: 0,
            multiplier: 1,
            perSecond: 0,
            perClick: 1,
            thisAscension: 0,
            prevAscensions: [],
            get allTime(): number {
                return this.thisAscension + this.prevAscensions.reduce((acc, current) => acc + current, 0);
            }
        };
        this.clicks = 0;
        this.buildTime = 1000;
        this.Buildings = loadBuildings();
        this.Upgrades = loadUpgrades();


        this.buildingsOwned = Object.keys(this.Buildings).reduce(function (map, obj) {
            map[obj] = 0;
            return map;
        }, {} as Record<string, number>);
        this.activeUpgrades = new Set();
        this.modifiers = new ModifierContainer(...baseModifiers);
        this.criteriaEvaluator = new CriteriaEvaluator(this);

        this._lastUpdated = Date.now();
        this._dataLastUpdated = Date.now();
    }

    /**
     * Updates the game
     */
    update() {
        const time = Date.now();
        const elapsed = time - this._lastUpdated;
        if (elapsed < 1000) {
            return;
        }

        const seconds = elapsed / 1000.0;
        const pcS = this.paperclips.perSecond;
        const clipsMade = pcS * seconds;

        this.addPaperclips(clipsMade);

        this._lastUpdated = time;
    }

    get lastUpdated(): number {
        return this._lastUpdated;
    }

    get dataLastUpdated(): number {
        return this._dataLastUpdated;
    }

    get totalBuildings(): number {
        return Object.values(this.buildingsOwned).reduce((accum, next) => accum + next, 0);
    }

    private determinePaperclipsPerSecond(): number {
        let sum = 0;

        for (const buildingId in this.Buildings) {
            if (this.getBuildingCount(buildingId) > 0) {
                sum += this.getBuildingPcps(buildingId) * this.getBuildingCount(buildingId);
            }
        }

        return sum * this.paperclips.multiplier + this.paperclips.bonus;
    }

    private determinePaperclipsPerClick(): number {
        let sum = 1;
        for (const modifier of this.modifiers.perClickModifiers) {
            switch (modifier.type) {
                case "per-click-addition": {
                    sum += modifier.quantity;
                    break;
                }
                case "per-click-addition-from-building": {
                    sum += modifier.quantity * this.getBuildingCount(modifier.buildingId);
                    break;
                }
                default:
                    break;
            }
        }
        return sum;
    }

    private determineBuildTime(): number {
        let base = 1000;

        for (const m of this.modifiers.buildTimeModifiers) {
            switch (m.type) {
                case "build-time-reduction":
                    base *= m.reduction;
                    break;
                case "build-time-reduction-per-building": {
                    let times;
                    if (!m.buildingId) {
                        times = Math.floor(this.totalBuildings / m.count);
                    } else {
                        times = Math.floor(this.getBuildingCount(m.buildingId) / m.count);
                    }
                    base *= m.reduction ** times;
                    break;
                }

            }
        }

        // minimum time is 0
        return base < 1 ? 0 : base;
    }

    /**
     * Gets the building paperclips per second
     * @param buildingId the building id
     * @private
     */
    getBuildingPcps(buildingId: string): number {
        const pcps = this.Buildings[buildingId].basePaperclipsPerSecond;
        let multiplier = 1.0;

        const modifiers = [...this.modifiers
            .pcpsPerBuildingModifiers];
        for (const modifier of modifiers.filter(m => m.multiplierKind === "additive")) {
            switch (modifier.type) {
                case "building-pcps-multiplier-from-building-quantity": {
                    if (modifier.buildingId === buildingId) {
                        if (this.getBuildingCount(modifier.sourceBuildingId) > 0) {
                            const buildingMult = modifier.multiplier ** this.getBuildingCount(modifier.sourceBuildingId);
                            multiplier += buildingMult - 1.0;
                        }
                    }
                    break;
                }
                default:
                    break;
            }
        }

        for (const modifier of modifiers
            .filter(m => m.multiplierKind === "multiplicative")
            ) {
            switch (modifier.type) {
                case "building-pcps-multiplier": {
                    if (modifier.buildingId === buildingId) {
                        multiplier *= modifier.multiplier;
                    }
                    break;
                }
                default:
                    break;
            }
        }

        return pcps * multiplier;
    }

    private updateData() {
        this.paperclips.perSecond = this.determinePaperclipsPerSecond();
        this.paperclips.perClick = this.determinePaperclipsPerClick();
        this.buildTime = this.determineBuildTime();

        this._dataLastUpdated = Date.now();
    }

    /**
     * Event for when a paperclip is clicked
     * @returns the amount of time required to 'complete' making this paperclip, in milliseconds
     */
    clickPaperclip(): number {
        this.clicks += 1;
        const buildTime = this.buildTime;
        const perClick = this.paperclips.perClick;

        const interval = setInterval(() => {
            this.addPaperclips(perClick);
            clearInterval(interval);
        }, buildTime);

        return buildTime;
    }

    addPaperclips(paperclips: number): void {
        this.paperclips.current += paperclips;
        this.paperclips.thisAscension += paperclips;
    }

    /**
     * Gets the cost of purchasing `count` amount of buildings
     * @param buildingId the id of the building
     * @param count the number of buildings to purchase
     */
    getBuildingCost(buildingId: string, count: number = 1): number {
        const building = this.Buildings[buildingId];
        const owned = this.getBuildingCount(buildingId);
        let sum = 0;

        for (let b = owned + 1; b <= owned + count; ++b) {
            sum += this.getNthBuildingCost(building, b);
        }

        return Math.round(sum);
    }

    canPurchase(cost: number): boolean {
        return cost <= this.paperclips.current;
    }

    /**
     * Gets the cost of the n-th building
     * @param building the building
     * @param n  the number of said building
     * @private
     */
    private getNthBuildingCost(building: Building, n: number): number {
        if (n === 1) {
            return building.baseCost;
        } else {
            return this.getNthBuildingCost(building, n - 1) * 1.15;
        }
    }

    /**
     * Gets the number of buildings of a type owned
     * @param buildingId the id of the building
     */
    getBuildingCount(buildingId: string): number {
        return this.buildingsOwned[buildingId];
    }

    /**
     * Sends a buy order
     * @param order
     */
    buy(order: BuyOrder): boolean {
        const ret = (() => {
                switch (order.kind) {
                    case "building": {
                        const buildingId = order.id;
                        const quantity = order.quantity;
                        const cost = this.getBuildingCost(buildingId, quantity);
                        if (this.paperclips.current >= cost) {
                            this.paperclips.current -= cost;
                            this.buildingsOwned[buildingId] += quantity;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    case "upgrade":
                        const upgradeId = order.id;
                        const cost = this.Upgrades[upgradeId].cost;
                        if (this.paperclips.current >= cost && !this.activeUpgrades.has(upgradeId)) {
                            this.paperclips.current -= cost;
                            this.activeUpgrades.add(upgradeId);

                            const upgrade = this.Upgrades[upgradeId];
                            for (const modifier of upgrade.modifiers) {
                                this.modifiers.addModifier(modifier);
                            }

                            return true;
                        } else {
                            return false;
                        }
                }
            }
        )();
        if (ret) {
            this.updateData();
        }
        return ret;
    }


}

/**
 * Used for storing the number of paperclips in the system
 */
export interface Paperclips {
    /**
     * Current amount of paperclips stored up
     */
    current: number;
    perSecond: number;
    multiplier: number;
    perClick: number;
    bonus: number;
    /**
     * The total number of paperclips made over all runs
     */
    allTime: number;
    /**
     * The number of paperclips created in this ascension
     */
    thisAscension: number;
    /**
     * The number of paperclips created in previous ascensions
     */
    prevAscensions: number[];
}


/**
 * A Game context
 */
export const GameContext = React.createContext<Game | undefined>(undefined);
export const useGameContext = () => {
    return useContext(GameContext)!;
};


export interface BuyBuildingOrder {
    kind: 'building',
    id: string,
    quantity: number,
}

export interface BuyUpgradeOrder {
    kind: 'upgrade',
    id: number
}

export type BuyOrder = BuyBuildingOrder | BuyUpgradeOrder;
