import {useEffect} from "react";
import {useGameContext} from "../../game/Game";
import {useUpdate} from "../../common/useUpdate";
import PaperclipMaker from "./PaperclipMaker";
import Store from "./Store";
import Stats from "./Stats.tsx";

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
                    <Stats />
                </div>
                <div className={"border-l"}>
                    <Store />
                </div>

            </div>
        </section>

    );
}