import buildings from "./buildings.json";
const typedBuildings: Building[] = buildings;

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
    return typedBuildings
        .reduce((p, b) => {
            p[b.id] = b;
            return p;
        }, {} as Record<string, Building>);
}