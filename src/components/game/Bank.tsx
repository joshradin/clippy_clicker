import {GameContext} from "../../game/Game.ts";
import "./Bank.css";
import React from "react";
import {useUpdate} from "../../common/update.tsx";


/**
 * The bank shows current stored paperclips and how many paperclips are being produced per second
 */
export default function Bank() {
    const game = React.useContext(GameContext)!;
    const paperclips = game.paperclips;
    useUpdate();

    return (
        <div id={"bank"}>
            <h2>{ Math.floor(paperclips.current)} Paperclips</h2>
            <h3>
                {paperclips.perSecond * paperclips?.multiplier}{ paperclips.bonus > 0 ? ` + ${paperclips?.bonus}` : ""} paperclips/s
            </h3>
        </div>
    );
}