import {useEffect} from "react";
import {useGameContext} from "../../game/Game";
import {useUpdate} from "../../common/useUpdate";
import PaperclipMaker from "./PaperclipMaker";
import Store from "./Store";
import FlavorWindow from "./FlavorWindow";

export function GameBoard() {
    const update = useUpdate();
    const game = useGameContext();

    useEffect(() => {
        game?.update();
    }, [game, update]);



    return (
        <section>
            <div className={"w-screen mx-auto flex flex-row h-screen"}>
                <div className={"border-r-8 border-indigo-600"}>
                    <PaperclipMaker />
                </div>
                <div className={"grow"}>
                    <FlavorWindow />
                </div>
                <div className={"border-l-8 border-indigo-600"}>
                    <Store />
                </div>

            </div>
        </section>

    );
}