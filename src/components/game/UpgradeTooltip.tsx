import Upgrade from "../../game/Upgrade.ts";
import Tooltip from "../common/Tooltip.tsx";
import PaperclipQuantity from "../common/PaperclipQuantity.tsx";
import {modifierToDescription} from "../../game/modifiers.ts";

export function UpgradeTooltip({upgrade}: { upgrade: Upgrade }) {
    return <Tooltip anchorSelect={`#upgrade-${upgrade.id}`}>
        <div className={"divide-y divide-slate-600"}>
            <div className={"text-white text-sm text-start pb-2"}>
                <h2 className={"font-bold"}>{upgrade.name}</h2>
                <PaperclipQuantity quantity={upgrade.cost}/>
                <ul
                    className={"pl-4"}
                    style={{
                        listStyle: 'inside "📎 "',
                    }}>
                    {
                        upgrade.modifiers
                            .flatMap(modifierToDescription)
                            .map((modifier, i) => {
                                return <li key={i}>{modifier}</li>;
                            })
                    }
                </ul>
            </div>
            <p className={"italic font-light text-gray-400"}>{upgrade.description}</p>
        </div>
    </Tooltip>;
}