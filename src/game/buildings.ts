import Building from "./Building.ts";

import benderSmallIcon from "/buildings/bender/benderSmall.png";
import benderBigIcon from "/buildings/bender/benderIcon.png";

import blenderBigIcon from "/buildings/blender/blenderIcon.png";


export const buildings: Building[] = [
    {
        "id": "bender",
        "description": "Bends a paperclip",
        "basePaperclipsPerSecond": 0.1,
        "baseCost": 5,
        "bigIcon": benderBigIcon,
        "smallIcon": benderSmallIcon
    },
    {
        "id": "blender",
        "description": "Recycles old paperclips to make them into new paperclips",
        "basePaperclipsPerSecond": 1,
        "baseCost": 55,
        "bigIcon": blenderBigIcon,
        "smallIcon": "?"
    },
    {
        "id": "fiverr-miner",
        "description": "You payed a guy on fiverr to mine for you",
        "basePaperclipsPerSecond": 10,
        "baseCost": 605,
        "bigIcon": "",
        "smallIcon": ""
    },
    {
        "id": "factory",
        "description": "Producing paperclips like nobody's business. Well, besides your own.",
        "basePaperclipsPerSecond": 70,
        "baseCost": 13310,
        "bigIcon": "?",
        "smallIcon": ""
    }
];
export default buildings;