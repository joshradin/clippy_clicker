import React from "react";
import classnames from "classnames";
import getEffectFilter from "../../common/getEffectFilter.ts";
import IconEffect from "./IconEffect.ts";


export interface UpgradeIconProps {
    size: "small" | "medium" | "large";
    icon: string;
    effect?: IconEffect;
}

export default function UpgradeIcon(props: UpgradeIconProps) {
    const {effect, icon, size} = props;
    const classNames = React.useMemo(() => {
        return classnames("border-2",
            "border-indigo-500",
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
            });
    }, [size]);

    const filter: string = React.useMemo(() => {
        return getEffectFilter(effect);
    }, [effect]);


    return (
        <div className={classNames}>
            <img draggable={false} className={"h-4/5 mx-auto block w-fit"} src={icon} alt={""}  style={{filter: filter}}/>
        </div>
    );
}