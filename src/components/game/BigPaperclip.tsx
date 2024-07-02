import React from "react";
import {GameContext} from "../../game/Game.ts";
import './BigPaperclip.css';

/**
 * Builds a paperclip
 */
export default function BigPaperclip() {
    const game = React.useContext(GameContext)!;
    const [clicked, setClicked] = React.useState(false);

    const onClick = () => {
        setClicked(true);
    };

    React.useEffect(() => {
        if (clicked) {
            const buildTime = game.clickPaperclip();
            const interval = setInterval(() => {
                setClicked(false);
            }, buildTime);

            return () => clearInterval(interval);
        }
    }, [game, clicked]);

    const className = React.useMemo(() => clicked ? "paperclip clicked" : "paperclip", [clicked]);

    return (
        <div style={{
            margin: '5dv',
            width: '150px',
            height: '150px',
            display: "flex",
            placeContent: "center",
            placeItems: "center"
        }}>
            <button id={"bigPaperclip"} className={className} onClick={onClick} disabled={clicked}>
                { clicked ? "Bending..." : "Paperclip"}
            </button>
        </div>

    );
}