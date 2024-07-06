import Upgrade from "../../../game/Upgrade.ts";
import UpgradeIcon from "../../common/UpgradeIcon.tsx";
import React from "react";
import {useGameContext} from "../../../game/Game.ts";
import classnames from "classnames";
import {UpgradeTooltip} from "../UpgradeTooltip.tsx";

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
        });
    }, [canPurchase]);

    const onClick = () => {
        game.buy({
            kind: "upgrade",
            id: upgrade.id
        });
    };

    return (
        <div>
            <UpgradeTooltip upgrade={upgrade}/>
            <div id={`upgrade-${upgrade.id}`} className={classNames} onClick={onClick}>
                <UpgradeIcon size={"medium"} icon={upgrade.icon!} effect={upgrade.effect}/>
            </div>
        </div>
    );
}