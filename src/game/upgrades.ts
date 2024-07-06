import Upgrade from "./Upgrade.ts";
import {UpgradeIconEffect} from "../components/common/UpgradeIcon.tsx";
import Game from "./Game.ts";
import Building from "./Building.ts";


interface ScalingBuildingUpgradeProps {
    name: string,
    description: string,
    cost: number,
    buildingsReq: number
}

const effectScale: (UpgradeIconEffect | undefined)[] = [
    undefined,
    "gold"
];

/**
 * Creates a scaling building upgrade
 * @param baseId
 * @param buildingId
 * @param baseIcon
 * @param upgrades
 */
function scalingBuildingUpgrades(
    baseId: number,
    building: Building,
    upgrades: ScalingBuildingUpgradeProps[]
): Upgrade[] {
    const built: Upgrade[] = [];
    const ids = idGenerator(baseId);
    const { buildingId, baseIcon } = { buildingId: building.id, baseIcon: building.upgradeIcon };

    for (const upgrade of upgrades) {
        const id = ids.next().value;
        const effect = effectScale[built.length];
        built.push({
            id,
            name: upgrade.name,
            description: upgrade.description,
            icon: baseIcon,
            effect,
            cost: upgrade.cost,
            criteria: {
                type: "specific-buildings-owned",
                buildingId,
                quantity: upgrade.buildingsReq,
            },
            modifiers: [
                {
                    classification: "building-pcps",
                    type: "building-pcps-multiplier",
                    multiplier: 2,
                    multiplierKind: "multiplicative",
                    buildingId
                }
            ]
        });
    }

    return built;
}

function *idGenerator(baseId: number): Generator<number, never> {
    let emit = baseId;
    while(true) {
        yield emit;
        emit += 1;
    }
}
/**
 * Verifies a list of upgrades, making sure there are no repeat ids
 * @param upgrades the upgrades to check
 */
export function verifyUpgrades(upgrades: Upgrade[]) {
    upgrades.reduce((accum, next) => {
        if (accum.has(next.id)) {
            throw new Error(`Repeated id in upgrades: ${next.id}`);
        }
        accum.add(next.id);
        return accum;
    }, new Set());
}

/**
 * Sorts upgrades by id
 * @param upgrades
 */
export function sortUpgrades(upgrades: Upgrade[]): Upgrade[] {
    return upgrades.sort((a, b) => a.id - b.id);
}

export default function getUpgrades(game: Game): Upgrade[] {
    return [
        ...scalingBuildingUpgrades(0, game.Buildings["bender"], [
                {name: "Faster Bending", description: "Bends paperclip at a breakneck speed", cost: 100, buildingsReq: 1},
                {name: "Even Faster Bending", description: "Bends paperclip at a breakneck speed, possibly illegally", cost: 500, buildingsReq: 1}
            ]
        ),
        ...scalingBuildingUpgrades(20, game.Buildings["blender"], [
                {name: "More blades", description: "More blades means more materials being recycled", cost: 1000, buildingsReq: 1},
                {name: "Shaper blades", description: "The blades on the blenders are sharper now, allowing for safer recycling", cost: 5000, buildingsReq: 1}
            ]
        ),
        ...scalingBuildingUpgrades(40,  game.Buildings["fiverr-miner"], [
                {name: "More miners", description: "We could probably spare a few more miners for 5 more dollars", cost: 10000, buildingsReq: 1},
                {name: "Doordashers", description: "We can pay door dashers to also mine more iron for our paperclips", cost: 50000, buildingsReq: 1}
            ]
        )
    ];
}