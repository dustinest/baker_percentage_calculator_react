import {JsonRecipeType} from "../service/RecipeReader/types";

export const PREDEFINED_RECIPES = [
    {
        name: "Täisteraleib",
        description: "Sisetemperatuur 88℃ - 99℃",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 40, temperature: 240 }
        ],
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
        description: "Sisetemperatuur 88℃ - 99℃",
        bakingTime: [
            { time: 25, temperature: 240, steam: true },
            { time: 50, temperature: 240 }
        ],
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
        description: "Sisetemperatuur 88℃ - 99℃i. 30g kukkel küpseta 180℃ 25min",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 20, temperature: 240 }
        ],
        ingredients: [
            {
                ingredients: [
                    { type: "WHEAT_405_FLOUR", grams: 463 },
                    { type: "WATER", grams: 378 },
                    { type: "SALT", percent: 1.76 }
                ]

            }
        ],
    },
    {
        name: "Sai seemnetega",
        description: "Sisetemperatuur 88℃ - 99℃",
        bakingTime: [
            { time: 20, temperature: 240, steam: true },
            { time: 20, temperature: 240 }
        ],
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
        description: "Sisetemperatuur 82℃ - 88℃",
        bakingTime: [
            { time: { from: 20, until: 30 }, temperature: 210 },
        ],
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
        description: "Sisetemperatuur 82℃ - 88℃",
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
        bakingTime: [
            { time: { from: 20, until: 25 }, temperature: 180 },
        ],
    },
    {
        name: "Kaneelirullid",
        description: "Sisetemperatuur 82℃ - 88℃",
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
    },
    {
        name: "Plaadikook",
        description: "Sisetemperatuur 82℃ - 88℃, pirukad umbes 180℃ 30 - 40 min",
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
    },
    {
        name: "Pikk sai",
        description: "Sisetemperatuur 82℃ - 88℃",
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
            { time: { from: 10 }, temperature: 180, steam: true },
            { time: { from: 15, until: 20 }, temperature: 180 },
        ],
    },
    {
        name: "Moskva saiakesed",
        description: "Sisetemperatuur 82℃ - 88℃",
        bakingTime: [
            { time: { from: 20, until: 25 }, temperature: 180 },
        ],
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
