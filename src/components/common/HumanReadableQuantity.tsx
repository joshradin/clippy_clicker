import humanNumber from 'human-number';
import React from "react";

export default function HumanReadableQuantity({ quantity, canBePartial=false} : {quantity: number, canBePartial?: boolean }) {
    const mapped = React.useMemo(() => {
        const checked = canBePartial?
            parseFloat(quantity.toFixed(1)) :
            Math.floor(quantity);

        return humanNumber(parseFloat(checked.toPrecision(4)));
    }, [quantity, canBePartial]);

    return (
        <span>{mapped}</span>
    )
}