import {useUpdate} from "../../common/update.tsx";
import {useEffect} from "react";
import {useGameContext} from "../../game/Game.ts";
import Bank from "./Bank.tsx";
import BigPaperclip from "./BigPaperclip.tsx";
import BuildingEditor from "./BuildingEditor.tsx";

export function GameView() {
    const update = useUpdate();
    const game = useGameContext();

    useEffect(() => {
        game?.update();
    }, [game, update]);

    return (
        <>
            <Bank/>
            <BigPaperclip/>
            {
                (Object.keys(game.Buildings)
                        .map(building => <BuildingEditor key={building} mode={"buy"} quantity={1}
                                                         buildingId={building}/>)
                )
            }
        </>
    );
}