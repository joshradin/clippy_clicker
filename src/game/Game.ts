import React, {useContext} from 'react';
import Building, {loadBuildings} from "./Building.ts";

/**
 * Used for representing the state of a game
 */
export default class Game {
    paperclips: Paperclips;
    clicks: number;

    /**
     * The time to build manually
     */
    buildTime: number;
    /**
     * Provides access to all building types
     */
    readonly Buildings: Record<string, Readonly<Building>>;
    readonly buildingsOwned: Record<string, number>;
    private lastUpdated: number;

    constructor() {
        const game = this;
        this.paperclips = {
            current: 0,
            bonus: 0,
            multiplier: 1,
            get perSecond(): number {
                let sum = 0;

                for (const buildingId in game.Buildings) {
                    if (game.getBuildingCount(buildingId) > 0) {
                        sum += game.getBuildingPcS(buildingId);
                    }
                }

                return sum * this.multiplier + this.bonus;
            },
            get perClick(): number {
                return 1 + game.buildingsOwned["bender"];
            },
            thisAscension: 0,
            prevAscensions: [],
            get allTime(): number {
                return this.thisAscension + this.prevAscensions.reduce((acc, current) => acc + current, 0);
            }
        };
        this.clicks = 0;
        this.buildTime = 1000;
        this.Buildings = loadBuildings();
        this.buildingsOwned = Object.keys(this.Buildings).reduce(function (map, obj) {
            map[obj] = 0;
            return map;
        }, {} as Record<string, number>);
        this.lastUpdated = Date.now();
    }

    /**
     * Updates the game
     */
    update() {
        const time = Date.now();
        const elapsed = time - this.lastUpdated;

        const seconds = elapsed / 1000.0;
        const pcS = this.paperclips.perSecond;
        console.log("PcS:", pcS);
        const clipsMade = pcS * seconds;

        this.paperclips.current += clipsMade;

        this.lastUpdated = time;
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
        console.log("checking if", cost, "is less than", this.paperclips.current);
        return cost <= this.paperclips.current;
    }

    /**
     * Gets the cost of the n-th building
     * @param building the building
     * @param n  the number of said building
     * @private
     */
    private getNthBuildingCost(building: Building, n: number): number {
        if (n == 1) {
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
                return false;
        }
    }

    /**
     * Gets the building paperclips per second
     * @param buildingId the building id
     * @private
     */
    private getBuildingPcS(buildingId: string): number {
        return this.Buildings[buildingId].basePaperclipsPerSecond * this.buildingsOwned[buildingId];
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

export interface BuyOrder {
    kind: 'building' | 'upgrade',
    id: string,
    quantity: number,
}