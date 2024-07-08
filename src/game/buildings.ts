import Building from "./Building.ts";

import benderStoreIcon from "/buildings/bender/benderStore.png";
import benderUpgradeIcon from "/buildings/bender/benderSmall.png";

import blenderBigIcon from "/buildings/blender/blenderIcon.png";


export const buildings: Building[] = [
    {
        "id": "bender",
        "description": "Bends a paperclip",
        "basePaperclipsPerSecond": 0.1,
        "baseCost": 5,
        "storeIcon": benderStoreIcon,
        "upgradeIcon": benderUpgradeIcon,
        "flavorIcon": benderUpgradeIcon
    },
    {
        "id": "blender",
        "description": "Recycles old paperclips to make them into new paperclips",
        "basePaperclipsPerSecond": 1,
        "baseCost": 55,
        "storeIcon": blenderBigIcon,
        "upgradeIcon": "?",
        "flavorIcon": ""
    },
    {
        "id": "fiverr-miner",
        "description": "You payed a guy on fiverr to mine for you",
        "basePaperclipsPerSecond": 10,
        "baseCost": 605,
        "storeIcon": "",
        "upgradeIcon": "",
        "flavorIcon": ""
    },
    {
        "id": "factory",
        "description": "Producing paperclips like nobody's business. Well, besides your own.",
        "basePaperclipsPerSecond": 70,
        "baseCost": 13310,
        "storeIcon": "?",
        "upgradeIcon": "",
        "flavorIcon": ""
    }
];
export default buildings;