export default function getEffectFilter(effect: "gold" | undefined): string {
    switch (effect) {
        case "gold":
            return "invert(76%) sepia(98%) saturate(1753%) hue-rotate(359deg) brightness(102%) contrast(104%)";
        default:
            return "none";
    }
}