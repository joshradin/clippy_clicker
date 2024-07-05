import {useGameContext} from "../../game/Game.ts";
import HumanReadableQuantity from "../common/HumanReadableQuantity.tsx";

export default function Stats() {
    const game = useGameContext();

    return (
        <div className={"container flex flex-col place-items-center bg-gray-950 text-white h-full"}>
            <section className={"w-full px-5"}>
                <header className={"text-center text-xl"}>
                    <h2>Stats</h2>
                </header>
                <p>
                    <span className={"font-bold"}>Total Paperclips: </span>
                    <span><HumanReadableQuantity quantity={Math.floor(game.paperclips.thisAscension)}/></span>
                </p>
                <p>
                    <span className={"font-bold"}>Per Click: </span>
                    <span>{game.paperclips.perClick}</span>
                </p>
                <p>
                    <span className={"font-bold"}>Build Time: </span>
                    <span>{(game.buildTime / 1000).toPrecision(3)} sec.</span>
                </p>
                <p>
                    <span className={"font-bold"}>Total Buildings: </span>
                    <span>{game.totalBuildings}</span>
                </p>

            </section>
        </div>
    );
}