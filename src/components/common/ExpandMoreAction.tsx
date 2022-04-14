import {useEffect, useState} from "react";
import {ExpandMoreIconButton} from "../../Constant/Buttons";

export const ExpandMoreAction = ({expanded, onChange}: { expanded: boolean, onChange: (expanded: boolean) => void }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  useEffect(() => {
    if (expanded !== isExpanded) {
      onChange(isExpanded);
    }
  }, [expanded, isExpanded, onChange])

  return (<ExpandMoreIconButton
      expand={expanded}
      onClick={() => setIsExpanded(!expanded)}
      aria-expanded={expanded}
      aria-label="show more"
    />
  )
}
