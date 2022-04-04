import {JsonRecipeType} from "../service/RecipeReader/types";

export const PREDEFINED_RECIPES = [
    {
        name: "Täisteraleib",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 40, temperature: 240 },
        ],
        innerTemperature: {from: 88, until: 99},
        ingredients: [
            {
                ingredients: [
                    { type: "WHOLE_RYE_FLOUR", grams: 405 },
                    { type: "WHOLE_RYE_MALT_FLOUR", grams: 20 },
                    { type: "WATER", percent: 100 },
                    { type: "SALT", percent: 1.76 }
                ]

            }
        ],
    },
    {
        name: "Suurem leib",
        bakingTime: [
            { time: 25, temperature: 240, steam: true },
            { time: 50, temperature: 240 }
        ],
        innerTemperature: {from: 88, until: 99},
        ingredients: [
            {
                ingredients: [
                    { type: "WHOLE_RYE_FLOUR", grams: 505 },
                    { type: "WHOLE_RYE_MALT_FLOUR", grams: 40 },
                    { type: "WATER", percent: 100 },
                    { type: "SALT", percent: 1.76 }
                ]

            }
        ],
    },
    {
        name: "Sai",
        description: "Kukkel küpseta 25 minutit 180℃",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 20, temperature: 240 }
        ],
        innerTemperature: {from: 88, until: 99},
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 463 },
                    { type: "WATER", percent: 82 },
                    { type: "SALT", percent: 1.76 }
                ]

            }
        ],
    },
    {
        name: "Sai seemnetega",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 20, temperature: 240 }
        ],
        innerTemperature: {from: 88, until: 99},
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 463 },
                    { type: "DRY", name: "Kaerahelbed", grams: 10 },
                    { type: "DRY", name: "Seemned", grams: 12 },
                    { type: "WATER", grams: 463 },
                    { type: "SALT", percent: 1.76 }
                ]

            }
        ],
    },
    {
        name: "Croissant",
        bakingTime: [
            { time: { from: 20, until: 30 }, temperature: 210 },
        ],
        innerTemperature: {from: 82, until: 88},
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_550_FLOUR", grams: 500 },
                    { type: "WATER", grams: 140 },
                    { type: "MILK", grams: 140 },
                    { type: "SUGAR", grams: 55 },
                    { type: "BUTTER", grams: 40 },
                    { type: "SALT", grams: 12 }
                ]

            },
            {
                name: "Kihistamiseks",
                ingredients: [
                    { type: "BUTTER", grams: 280 }
                ]
            }
        ],
    },
    {
        name: "Pannkook",
        ingredients: [
            {
                name: "Esimene päev",
                starter: true,
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 362 },
                    { type: "WATER", grams: 129.5 },
                    { type: "MILK", grams: 454 },
                ]

            },
            {
                name: "Teine päev",
                ingredients: [
                    { type: "BUTTER", grams: 50 },
                    { type: "SALT", grams: 7.5 },
                    { type: "SUGAR", grams: 14 },
                    { type: "EGG", grams: 256 }
                ]
            }
        ],
    },
    {
        name: "Pizza",
        amount: 3,
        ingredients: [
            {
                ingredients: [
                    { type: "DURUM_WHEAT", grams: 515 },
                    { type: "WATER", grams: 340 },
                    { type: "OLIVE_OIL", grams: 27.44 },
                    { type: "SALT", grams: 7.5 },
                ]

            }
        ],
        bakingTime: [
            { time: { from: 18, until: 30 }, temperature: 210 },
        ],
    },
    {
        name: "Vastlakuklid",
        amount: 18,
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_550_FLOUR", grams: 483 },
                    { type: "WATER", grams: 83 },
                    { type: "MILK", grams: 210 },
                    { type: "BUTTER", grams: 75 },
                    { type: "SALT", grams: 5 },
                    { type: "SUGAR_BROWN", grams: 50 },
                    { type: "CARDAMOM", grams: 1 },
                ]

            }
        ],
        innerTemperature: {from: 82, until: 88},
        bakingTime: [
            { time: { from: 20, until: 25 }, temperature: 180 },
        ],
    },
    {
        name: "Kaneelirullid",
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_550_FLOUR", grams: 483 },
                    { type: "WATER", grams: 83 },
                    { type: "MILK", grams: 210 },
                    { type: "BUTTER", grams: 75 },
                    { type: "SALT", grams: 5 },
                    { type: "SUGAR_BROWN", grams: 50 },
                    { type: "CARDAMOM", grams: 1 },
                ]

            },
            {
                name: "Kaanelikiht",
                ingredients: [
                    { type: "CINNAMON", grams: 15.86 },
                    { type: "BUTTER", grams: 112 },
                    { type: "SALT", grams: 1 },
                    { type: "SUGAR", grams: 95 }
                ]
            }
        ],
        bakingTime: [
            { time: { from: 20, until: 25 }, temperature: 210 },
        ],
        innerTemperature: {from: 82, until: 88},
    },
    {
        name: "Plaadikook",
        description: "Pirukad küpseta umbes 30 - 40 minutit 180℃",
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 808 },
                    { type: "WATER", grams: 123 },
                    { type: "MILK", grams: 385 },
                    { type: "BUTTER", grams: 200 },
                    { type: "SALT", grams: 7.5 },
                ]

            }
        ],
        bakingTime: [
            { time: { from: 20, until: 30 }, temperature: 210 },
        ],
        innerTemperature: {from: 82, until: 88},
    },
    {
        name: "Pikk sai",
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 340 },
                    { type: "WATER", grams: 142 },
                    { type: "MILK", grams: 85 },
                    { type: "SALT", grams: 6 },
                ]

            }
        ],
        bakingTime: [
            { time: 10, temperature: 180, steam: true },
            { time: { from: 15, until: 20 }, temperature: 180 },
        ],
        innerTemperature: {from: 82, until: 88},
    },
    {
        name: "Moskva saiakesed",
        bakingTime: [
            { time: { from: 20, until: 25 }, temperature: 180 },
        ],
        innerTemperature: {from: 82, until: 88},
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 408 },
                    { type: "WATER", grams: 130 },
                    { type: "MILK", grams: 140 },
                    { type: "SUGAR_BROWN", grams: 16 },
                    { type: "BUTTER", grams: 50 },
                    { type: "SALT", grams: 2 }
                ]

            },
            {
                name: "Kihistamiseks",
                ingredients: [
                    { type: "BUTTER", grams: 100 }
                ]
            }
        ],
    }
] as JsonRecipeType[];

