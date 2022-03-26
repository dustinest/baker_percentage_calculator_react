import {readJsonRecipe} from "./JsonRecipeReader";

describe("JsonRecipeType can bea read", () => {
    it ("Simple recepy is OK", async () => {
        const result = await readJsonRecipe(    {
                name: "Täisteraleib",
                bakingTime: [
                    { time: 20, temperature: 240 },
                    { time: 40, temperature: 240, steam: true }
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
            }
        );
        console.log(result);
        result.ingredients.forEach(console.log)
        expect(result.id).toBe("VMOkaXN0ZXJhbGVpYg==");
        expect(result.name).toBe("Täisteraleib");
        expect(result.bakingTime).toStrictEqual([
            { time: { from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: false },
            { time: {from: 40, until: 40}, temperature: {from: 240, until: 240}, steam: true }
        ]);
    });

    it ("Test with dry", async () => {
        const result = await readJsonRecipe(    {
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
            }
        );
        console.log(result);
        result.ingredients.forEach(console.log)
        expect(result.id).toBe("U2FpIHNlZW1uZXRlZ2E=");
        expect(result.name).toBe("Sai seemnetega");
        expect(result.bakingTime).toStrictEqual([
            { time: { from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: true },
            { time: {from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: false }
        ]);
    });
});
