import {useGameContext} from "../../../game/Game.ts";
import React from "react";
import BuildingButton from "./BuildingButton.tsx";
import classnames from "classnames";
import {titleCase} from "title-case";
import PurchaseUpgrade from "./PurchaseUpgrade.tsx";
import {sortUpgrades} from "../../../game/upgrades.ts";

interface Buy {
    mode: "buy";
    quantity: 1 | 10 | 100;
}

interface Sell {
    mode: "sell";
    quantity: 1 | 10 | 100 | "all";
}

type BuyOrSell = Buy | Sell;
type GetMode<S extends BuyOrSell["mode"]> = S extends "buy" ? Buy : S extends "sell" ? Sell : never;

interface SetMode {
    action: "set-mode"
    mode: "buy" | "sell"
}

interface SetBuyQuantity {
    action: "set-quantity",
    mode: "buy"
    quantity: Buy["quantity"]
}

interface SetSellQuantity {
    action: "set-quantity",
    mode: "sell"
    quantity: Sell["quantity"]
}

type BuyOrSellReducerAction = SetMode | SetBuyQuantity | SetSellQuantity;

const buyOrSellReducer: React.Reducer<BuyOrSell, BuyOrSellReducerAction> = (state: BuyOrSell, action: BuyOrSellReducerAction): BuyOrSell => {
    switch (action.action) {
        case "set-mode": {
            if (state.mode != action.mode) {
                const next = {
                    mode: action.mode,
                    quantity: 1
                } as BuyOrSell;

                if (action.mode === "buy" && state.mode === "sell" && state.quantity === "all") {
                    next.quantity = 100;
                } else {
                    next.quantity = state.quantity;
                }

                return next;
            }
            break;
        }
        case "set-quantity": {
            if (state.quantity != action.quantity || state.mode != action.mode) {
                state.quantity = action.quantity;
                state.mode = action.mode;

                return {...state};
            }
            break;
        }
    }

    return state;
};

function QuantityButton<M extends "buy" | "sell">(props: {
    state: BuyOrSell;
    mode: M,
    quantity: GetMode<M>["quantity"]
    dispatch: React.Dispatch<BuyOrSellReducerAction>,
}) {
    const {state, mode, quantity, dispatch} = props;
    const getClassName = (mode: M, quantity: GetMode<M>["quantity"]) => {
        return classnames("basis-1/5", "text-gray-500", "hover:text-white", {
            "text-white": state.mode == mode && state.quantity == quantity,
        });
    };

    const onClick = () => {
        dispatch({
            action: "set-quantity",
            mode: mode,
            quantity: quantity
        } as SetBuyQuantity | SetSellQuantity);
    };

    return <a className={getClassName(mode, quantity)} onClick={onClick}>{titleCase(quantity.toString())}</a>;
}

/**
 * The store to buy buildings and upgrades
 */
export default function Store() {
    const game = useGameContext();
    const [buyOrSell, dispatch] = React.useReducer<React.Reducer<BuyOrSell, BuyOrSellReducerAction>>(buyOrSellReducer, {
        quantity: 1, mode: "buy"
    });

    const setBuy = () => {
        dispatch({action: "set-mode", mode: "buy"});
    };

    const setSell = () => {
        dispatch({action: "set-mode", mode: "sell"});
    };


    return (
        <>
            <div className={"bg-slate-700 h-full"}>
                <div className={"container flex flex-row flex-wrap gap-1"}>
                    {
                        sortUpgrades(Object.values(game.Upgrades))
                            .filter(upgrade => !upgrade.associatedBuilding)
                            .filter(upgrade => !game.activeUpgrades.has(upgrade.id))
                            .filter(upgrade => game.criteriaEvaluator.eval(upgrade.criteria))
                            .map(upgrade => {
                                return <PurchaseUpgrade key={upgrade.id} upgrade={upgrade}/>;
                            })
                    }
                </div>

                <div
                    className={`flex flex-col px-5 group ${buyOrSell.mode} ${buyOrSell.mode}-${buyOrSell.quantity} bg-gray-900`}>
                    <div className={`flex flex-row`}>
                        <a className={"basis-1/4 text-gray-500 hover:text-white group-[.sell]:text-gray-400 group-[.buy]:text-white"}
                           onClick={setBuy}>Buy</a>
                        <QuantityButton state={buyOrSell} mode={"buy"} quantity={1} dispatch={dispatch}/>
                        <QuantityButton state={buyOrSell} mode={"buy"} quantity={10} dispatch={dispatch}/>
                        <QuantityButton state={buyOrSell} mode={"buy"} quantity={100} dispatch={dispatch}/>
                        <div className={"basis-1/5"}></div>
                    </div>
                    <div className={`flex flex-row`}>
                        <a className={"basis-1/4 text-gray-500 hover:text-white group-[.biu]:text-gray-400 group-[.sell]:text-white"}
                           onClick={setSell}>Sell</a>
                        <QuantityButton state={buyOrSell} mode={"sell"} quantity={1} dispatch={dispatch}/>
                        <QuantityButton state={buyOrSell} mode={"sell"} quantity={10} dispatch={dispatch}/>
                        <QuantityButton state={buyOrSell} mode={"sell"} quantity={100} dispatch={dispatch}/>
                        <QuantityButton state={buyOrSell} mode={"sell"} quantity={"all"} dispatch={dispatch}/>
                    </div>
                </div>
                {

                    (Object.keys(game.Buildings)
                            // @ts-expect-error This is valid but intellij seems to think otherwise
                            .map(building => <BuildingButton key={building} mode={buyOrSell.mode}
                                                             quantity={buyOrSell.quantity} buildingId={building}/>)
                    )
                }
            </div>
        </>
    );
}