import {RecipeType} from "../../models/types";
import {useEffect, useState} from "react";
import {recipeType2RecipeJson} from "../../service/RecipeReader";
import './RecipeJson.css';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary, CircularProgress,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {TranslatedLabel} from "../common/TranslatedLabel";

const resolveRecipeJson = async (recipe: RecipeType): Promise<string> => {
    const result = await recipeType2RecipeJson(recipe);
    return JSON.stringify(result, null, 2)
};

export const RecipeJson = ({recipe}: {recipe: RecipeType}) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [recipeJson, setRecipeJson] = useState<string | undefined>();

    useEffect(() => {
        if (isExpanded) {
            resolveRecipeJson(recipe).then(setRecipeJson).catch(console.error);
        } else {
            setRecipeJson(undefined);
        }
    }, [recipe, isExpanded])

    return (
        <Accordion expanded={isExpanded} onChange={(_, i) => {setExpanded(i)}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography><TranslatedLabel label="JSON"/></Typography>
            </AccordionSummary>
            <AccordionDetails>
                {recipeJson ? <pre>{recipeJson}</pre> : <CircularProgress />}
            </AccordionDetails>
        </Accordion>
    )
}
