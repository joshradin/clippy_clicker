import {PaperclipIcon} from "./icons.tsx";

export interface PaperclipCostProps {
    cost: number
}

/**
 * Displays paperclip cost
 */
export default function PaperclipCost({ cost }: PaperclipCostProps) {
    return (
        <span>
            { cost }<PaperclipIcon />
        </span>
    );
}