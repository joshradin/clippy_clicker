import UnlockCriteria from "./UnlockCriteria.ts";
import Modifier from "./Modifier.ts";

/**
 * A badge works similarly to an upgrade, but is disable-able
 */
export default interface Badge {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly icon?: string;
    readonly cost: number;
    readonly criteria: UnlockCriteria;
    readonly modifiers: ReadonlyArray<Modifier>;
}

