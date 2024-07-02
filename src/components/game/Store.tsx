import {BuyOrder, useGameContext} from "../../game/Game.ts";
import React from "react";
import BuildingEditor from "./BuildingEditor.tsx";

interface Buy {
    mode: "buy";
    quantity: 1 | 10 | 100;
}

interface Sell {
    mode: "sell";
    quantity: 1 | 10 | 100 | "all";
}

type BuyOrSell = Buy | Sell;

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
    return state;
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
        dispatch({ action: "set-mode", mode: "buy" });
    }

    const setSell = () => {
        dispatch({ action: "set-mode", mode: "sell" });
    }

    return (
        <>
            <div>
            <div className={`flex flex-col px-5 group ${buyOrSell.mode} ${buyOrSell.mode}-${buyOrSell.quantity}`}>
                <div className={`flex flex-row`}>
                    <a className={"basis-1/4 text-gray-500 hover:text-white group-[.sell]:text-gray-400 group-[.buy]:text-white"} onClick={setBuy}>Buy</a>
                    <a className={"basis-1/5 text-gray-500 group-[.buy .buy-1]:text-white"}>1</a>
                </div>
            </div>
            {
                (Object.keys(game.Buildings)
                        .map(building => <BuildingEditor key={building} mode={"buy"} quantity={1}
                                                         buildingId={building}/>)
                )
            }
            </div>
        </>
    );
}