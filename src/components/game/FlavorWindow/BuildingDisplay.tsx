import Game, {useGameContext} from "../../../game/Game.ts";
import React from "react";



export default function BuildingDisplay() {
    const game = useGameContext();
    const buildings = React.useMemo(() => {
        return buildingsIds(game)
            .map(buildingId => (
                {
                    buildingId,
                    leftOffset: (15 + Math.random() * 70).toString() + "%",
                    topOffset: (15 + Math.random() * 70).toString() + "%"
                }
            ))
            ;
    }, [JSON.stringify(game.buildingsOwned)]);

    return (
        <div className={"container relative grow "}>
            {
                buildings
                    .map((buildingBody, idx) => {
                        const building = game.Buildings[buildingBody.buildingId];
                        return (
                            <img key={idx}
                                 src={building.bigIcon}
                                 alt={building.id}
                                 className={"absolute max-h-[64px] max-w-[64px]"}
                                 style={{
                                     left: buildingBody.leftOffset,
                                     top: buildingBody.topOffset,
                                     transform: "translate(-50%, -50%)",
                                 }}
                            />
                        );
                    })
            }
        </div>
    );
}

/**
 * Creates a generator of string ids for buildings
 * @param game
 */
function buildingsIds(game: Game): string[] {
    return Object.entries(game.buildingsOwned)
        .flatMap(([key, value]) => {
            return new Array<string>(value)
                .fill(key);
        });
}