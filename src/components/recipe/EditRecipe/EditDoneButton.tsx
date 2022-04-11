import {DoneIcon} from "../../common/Icons";
import {RIconButton} from "../../common/RButton";

export const EditDoneButton = ({enabled, onChange}: {enabled: boolean; onChange: () => void}) => {
  return (<RIconButton disabled={!enabled} onClick={onChange} icon={<DoneIcon/>}/>);
}
