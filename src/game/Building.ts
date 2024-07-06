import buildings from "./buildings.ts";
import {titleCase} from "title-case";

export default interface Building {
    readonly id: string;
    readonly description: string;
    readonly basePaperclipsPerSecond: number;
    readonly baseCost: number;
    readonly bigIcon: string;
    readonly smallIcon: string;
}

/**
 * Loads all base buildings
 */
export function loadBuildings(): Record<string, Building> {
    return buildings
        .reduce((p, b) => {
            p[b.id] = b;
            return p;
        }, {} as Record<string, Building>);
}

/**
 * Converts a building's id into a clean title
 * @param building
 */
export function buildingTitle(building: Building | string): string {
    let id: string;
    if (typeof building === "string") {
        id = building;
    } else {
        id = building.id;
    }
    return titleCase(id.replace(/[\s_-]/, ' '));
}