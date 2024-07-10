export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                "spin-pulsate": "spin-pulsate infinite 2s linear"
            },
            keyframes: {
                "spin-pulsate": {
                    "0%": {
                        transform: "scale(1) rotate(0deg))"
                    },
                    "25%": {
                        transform: "scale(1.2) rotate(-3deg)"
                    },
                    "50%": {
                        transform: "scale(1) rotate(0deg)"
                    },
                    "75%": {
                        transform: "scale(1.2) rotate(3deg)"
                    },
                    "100%": {
                        transform: "scale(1) rotate(0deg)"
                    }
                }
            }
        },
    },
    plugins: []
}