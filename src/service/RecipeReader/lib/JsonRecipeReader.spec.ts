import {readJsonRecipe} from "./JsonRecipeReader";

describe("JsonRecipeType can be read", () => {
    it ("Simple recipe is OK", async () => {
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
        //console.log(result);
        //result.ingredients.forEach(console.log)
        expect(result.id).toBe("WyJUw6Rpc3RlcmFsZWliIiwxXQ==");
        expect(result.name).toBe("Täisteraleib");
        expect(result.bakingTime).toStrictEqual([
            { time: { from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: false },
            { time: {from: 40, until: 40}, temperature: {from: 240, until: 240}, steam: true }
        ]);
        expect(result.ingredients.length).toBe(1);
        expect(result.ingredients[0].ingredients.length).toBe(4);
        expect(result.ingredients[0].ingredients[0].id).toBe("whole_grain_rye_flour");
        expect(result.ingredients[0].ingredients[0].grams).toBe(405);

        expect(result.ingredients[0].ingredients[1].id).toBe("rye_malt_flour");
        expect(result.ingredients[0].ingredients[1].grams).toBe(20);

        expect(result.ingredients[0].ingredients[2].id).toBe("water");
        expect(result.ingredients[0].ingredients[2].grams).toBe(425);

        expect(result.ingredients[0].ingredients[3].id).toBe("salt");
        expect(result.ingredients[0].ingredients[3].grams).toBe(7.5);

    });

    it ("When amount is in percentage", async () => {
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
                            { type: "WHOLE_RYE_MALT_FLOUR", percent: 4.7 },
                            { type: "WATER", percent: 100 },
                            { type: "SALT", percent: 1.76 }
                        ]
                    }
                ],
            }
        );
        console.log(result);
        result.ingredients.forEach(console.log)
        expect(result.id).toBe("WyJUw6Rpc3RlcmFsZWliIiwxXQ==");
        expect(result.name).toBe("Täisteraleib");
        expect(result.bakingTime).toStrictEqual([
            { time: { from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: false },
            { time: {from: 40, until: 40}, temperature: {from: 240, until: 240}, steam: true }
        ]);
        expect(result.ingredients.length).toBe(1);
        expect(result.ingredients[0].ingredients.length).toBe(4);
        expect(result.ingredients[0].ingredients[0].id).toBe("whole_grain_rye_flour");
        expect(result.ingredients[0].ingredients[0].grams).toBe(405);

        expect(result.ingredients[0].ingredients[1].id).toBe("rye_malt_flour");
        expect(result.ingredients[0].ingredients[1].grams).toBe(20);

        expect(result.ingredients[0].ingredients[2].id).toBe("water");
        expect(result.ingredients[0].ingredients[2].grams).toBe(425);

        expect(result.ingredients[0].ingredients[3].id).toBe("salt");
        expect(result.ingredients[0].ingredients[3].grams).toBe(7.5);

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
        //console.log(result);
        //result.ingredients.forEach(console.log)
        expect(result.id).toBe("WyJTYWkgc2VlbW5ldGVnYSIsMV0=");
        expect(result.name).toBe("Sai seemnetega");
        expect(result.bakingTime).toStrictEqual([
            { time: { from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: true },
            { time: {from: 20, until: 20}, temperature: {from: 240, until: 240}, steam: false }
        ]);
    });
});
