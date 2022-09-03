import {Menu} from "@mui/material";
import {ReactNode, UIEvent, useState} from "react";
import {MoreIconButton} from "../../Constant/Buttons";

type CommonMenuProps = {
  anchor: null | HTMLElement;
  onClose: () => void;
  children: ReactNode;
}

export const CommonMenu = ({anchor, onClose, children}: CommonMenuProps) => {
  return (
    <Menu
      anchorEl={anchor}
      open={anchor !== null}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      onClick={onClose}
    >{children}</Menu>
  );
}

export const useCommonMenuAnchor = (): [null | HTMLElement, (event: UIEvent<HTMLElement>) => void, () => void] => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const onMenuOpen = (event: UIEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorElement(event.currentTarget);
  }
  const onMenuClose = () => setAnchorElement(null);

  return [anchorElement, onMenuOpen, onMenuClose];
}

export const CommonMenuButton = ({children, onClose}: {children: ReactNode, onClose?: () => void}) => {
  const [anchorElement, onMenuOpen, onMenuClose] = useCommonMenuAnchor();
  const _onClose = () => {
    if (onClose) onClose();
    onMenuClose();
  }
  return (<>
      <CommonMenu anchor={anchorElement} onClose={_onClose}>{children}</CommonMenu>
      <MoreIconButton aria-controls={anchorElement !== null ? 'basic-menu' : undefined}
                      color="inherit"
                      sx={{ displayPrint: 'none' }}
                  aria-haspopup="true"
                  aria-expanded={anchorElement !== null ? 'true' : undefined}
                  onClick={onMenuOpen}/>
    </>);
}
