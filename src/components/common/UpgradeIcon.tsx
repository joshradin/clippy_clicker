import React from "react";
import classnames from "classnames";
import {colors} from "../../common/tailwind.ts";

export type UpgradeIconEffect =
    | "gold";


export interface UpgradeIconProps {
    size: "small" | "medium" | "large";
    icon: string;
    effect?: UpgradeIconEffect;
}

export default function UpgradeIcon(props: UpgradeIconProps) {
    let {effect, icon, size} = props;
    const classNames = React.useMemo(() => {
        return classnames("border-2",
            "border-" + colors.highlight,
            "rounded",
            "bg-black",
            "flex",
            "place-items-center",
            {
                "w-8": size === "small",
                "h-8": size === "small",
                "w-16": size === "medium",
                "h-16": size === "medium",
                "w-24": size === "large",
                "h-24": size === "large",
            })
    }, [size]);

    const filter: string = React.useMemo(() => {
        switch (effect) {
            case "gold":
                return "invert(76%) sepia(98%) saturate(1753%) hue-rotate(359deg) brightness(102%) contrast(104%)";
            default:
                return "none"
        }
    }, [effect]);


    return (
        <div className={classNames}>
            <img draggable={false} className={"h-4/5 mx-auto block w-fit"} src={icon} alt={""}  style={{filter: filter}}/>
        </div>
    );
}