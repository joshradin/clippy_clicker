import {PaperclipIcon} from "./icons.tsx";
import HumanReadableQuantity from "./HumanReadableQuantity.tsx";

export interface PaperclipCostProps {
    quantity: number
}

/**
 * Displays paperclip cost
 */
export default function PaperclipQuantity({ quantity }: PaperclipCostProps) {
    return (
        <span>
            <HumanReadableQuantity canBePartial={true} quantity={quantity} /><PaperclipIcon />
        </span>
    );
}