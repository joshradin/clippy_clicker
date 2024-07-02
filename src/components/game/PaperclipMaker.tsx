import Bank from "./Bank.tsx";
import BigPaperclip from "./BigPaperclip.tsx";

export default function PaperclipMaker() {

    return (
        <div className={"container mx-auto min-w-60 static flex flex-col place-items-center"}>
            <div className={"h-40"}/>
            <Bank/>
            <div className={"absolute"} style={{
                top: "40%"
            }}>
                <BigPaperclip/>
            </div>
        </div>
    );
}