import humanizeDuration from "humanize-duration";

const durationHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
    delimiter: " ", round: true, spacer: "", maxDecimalPoints: 1
});

export default durationHumanizer;