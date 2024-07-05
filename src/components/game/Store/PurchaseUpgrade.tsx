import Tooltip from "../../common/Tooltip.tsx";
import Upgrade from "../../../game/Upgrade.ts";
import UpgradeIcon from "../../common/UpgradeIcon.tsx";
import React from "react";
import {useGameContext} from "../../../game/Game.ts";
import classnames from "classnames";
import PaperclipQuantity from "../../common/PaperclipQuantity.tsx";

export interface PurchaseUpgradeProps {
    upgrade: Upgrade
}

export default function PurchaseUpgrade(props: PurchaseUpgradeProps) {
    const {upgrade} = props;
    const game = useGameContext();
    const canPurchase = React.useMemo(() => upgrade.cost <= game.paperclips.current, [game.paperclips.current, upgrade.cost]);

    const classNames = React.useMemo(() => {
        return classnames("cursor-pointer", {
            "grayscale": !canPurchase
        })
    }, [canPurchase])

    const onClick = () => {
        game.buy({
            kind: "upgrade",
            id: upgrade.id
        });
    };

    return (
        <div>
            <Tooltip anchorSelect={`#upgrade-${upgrade.id}`}>
                <div className={"divide-y divide-slate-600"}>
                    <div className={"text-white text-sm text-start pb-2"}>
                        <h2 className={"font-bold"}>{upgrade.name}</h2>
                        <PaperclipQuantity quantity={upgrade.cost} />
                        <ul
                            className={"pl-4"}
                            style={{
                                listStyle: 'inside "📎 "',
                            }}>
                            {
                                upgrade.modifiers.map((modifier, i) => {
                                    return <li key={i}>{modifier.classification}</li>
                                })
                            }
                        </ul>
                    </div>
                    <p className={"italic font-light text-gray-400"}>{upgrade.description}</p>
                </div>
            </Tooltip>
            <div id={`upgrade-${upgrade.id}`} className={classNames} onClick={onClick}>
                <UpgradeIcon size={"medium"} icon={upgrade.icon!} effect={upgrade.effect}/>
            </div>
        </div>
    );
}