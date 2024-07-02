import {GameContext} from "../../game/Game.ts";
import "./Bank.css";
import React from "react";

import {useUpdate} from "../../common/useUpdate.ts";
import HumanReadableQuantity from "../common/HumanReadableQuantity.tsx";


/**
 * The bank shows current stored paperclips and how many paperclips are being produced per second
 */
export default function Bank() {
    const game = React.useContext(GameContext)!;
    const paperclips = game.paperclips;
    useUpdate();

    return (
        <div id={"bank"} className={"w-full text-center bg-black bg-opacity-10"}>
            <h2>
                <HumanReadableQuantity quantity={paperclips.current} /> Paperclips</h2>
            <h3>
                <HumanReadableQuantity quantity={paperclips.perSecond * paperclips?.multiplier} canBePartial={true}/>{ paperclips.bonus > 0 ? ` + ${paperclips?.bonus}` : ""} paperclips/s
            </h3>
        </div>
    );
}