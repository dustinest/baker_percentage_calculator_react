import {RecipeType} from "../../../types";
import {useEffect, useState} from "react";
import {recipeType2RecipeJson} from "../../../service/RecipeReader";
import './RecipeJson.css';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary, CircularProgress,
    Typography
} from "@mui/material";
import {TranslatedLabel} from "../../../Translations";
import { ExpandMoreIcon } from "../../common/Icons";

export const RecipeJson = ({recipe}: {recipe: RecipeType}) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [recipeJson, setRecipeJson] = useState<string | undefined>();

    useEffect(() => {
        if (isExpanded) {
            recipeType2RecipeJson(recipe)
                .then((result) => JSON.stringify(result, null, 2))
                .then(setRecipeJson).catch(console.error);
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
                {isExpanded && recipeJson ? <pre>{recipeJson}</pre> : <CircularProgress />}
            </AccordionDetails>
        </Accordion>
    )
}
