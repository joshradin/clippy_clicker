import React from "react";
import {GameContext} from "../../game/Game.ts";
import classnames from "classnames";
import getEffectFilter from "../../common/getEffectFilter.ts";

import {IconEffect} from "../common/IconEffect.ts";
import {useUpdate} from "../../common/useUpdate.ts";

const CONSTANT_BUILD_TIME = 500;
/**
 * Builds a paperclip
 */
export default function BigPaperclip() {
    useUpdate();
    const game = React.useContext(GameContext)!;
    const [clicked, setClicked] = React.useState(false);
    const [effect, setEffect] = React.useState<IconEffect | undefined>(undefined);
    const filter = React.useMemo(() => getEffectFilter(effect), [effect]);

    const onClick = () => {
        setClicked(true);
    };

    React.useEffect(() => {
        const modifierCount = game.modifiers.perClickModifiers.modifiers.length;
        if (modifierCount < 2) {
            setEffect(undefined);
        } else if (modifierCount >= 2) {
            setEffect("gold");
        }
    }, [game, JSON.stringify(game.activeUpgrades)]);

    React.useEffect(() => {
        if (clicked) {
            const buildTime = game.clickPaperclip();
            if (buildTime > 0) {
                const interval = setInterval(() => {
                    setClicked(false);
                }, buildTime);

                return () => clearInterval(interval);
            } else {
                const interval = setInterval(() => {
                    setClicked(false);
                }, CONSTANT_BUILD_TIME);
                return () => clearInterval(interval);
            }
        }
    }, [game, clicked]);


    return (
        <button id={"bigPaperclip"}
                className={classnames("h-48 w-48 bg-indigo-100 dark:bg-gray-800 ring-8 [&.building]:ring-4 ring-blue-400 [&.building]:disabled:ring-gray-600 rounded-full hover:scale-110 transition-transform group", {
                    building: game.buildTime > CONSTANT_BUILD_TIME && clicked
                })}
                style={{
                    transform: clicked && game.buildTime > 0 ? "scale(0.8)" : undefined,
                    transitionTimingFunction: "cubic-bezier(.25,-0.5,.43,1.68)",
                    transitionDuration: "250ms",
                }}
                onClick={onClick}
                disabled={clicked && game.buildTime > 0}>
            <h1 className={`text-[6rem] text-black dark:text-white group-[.building]:motion-safe:animate-spin`}
                style={{
                    textShadow: "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073",
                    animationDuration: (game.buildTime > 0 ? game.buildTime : CONSTANT_BUILD_TIME) + "ms",
                    filter,
                }}>
                📎
            </h1>
            <span
                className={"text-xl group-[.building]"}>{clicked && game.buildTime > 0 ? "Bending..." : "Paperclip"}</span>
        </button>

    );
}

