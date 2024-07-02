import {useEffect} from "react";
import {useGameContext} from "../../game/Game.ts";
import {useUpdate} from "../../common/useUpdate.ts";
import PaperclipMaker from "./PaperclipMaker.tsx";
import Store from "./Store.tsx";
import HumanReadableQuantity from "../common/HumanReadableQuantity.tsx";

export function GameBoard() {
    const update = useUpdate();
    const game = useGameContext();

    useEffect(() => {
        game?.update();
    }, [game, update]);



    return (
        <section>
            <div className={"w-screen mx-auto flex flex-row h-screen"}>
                <div className={"border-r"}>
                    <PaperclipMaker />
                </div>
                <div className={"grow w-12"}>
                    <p>
                        <span className={"font-bold"}>Total Paperclips: </span>
                        <span><HumanReadableQuantity quantity={Math.floor(game.paperclips.thisAscension)} /></span>
                    </p>
                </div>
                <div className={"border-l"}>
                    <Store />
                </div>

            </div>
        </section>

    );
}