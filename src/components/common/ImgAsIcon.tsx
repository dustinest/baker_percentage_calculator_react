import {Button, ButtonProps} from "@mui/material";

export const ImageIconButton = (props: ButtonProps & {src: string, alt: string}) => {
  const {src, alt, ...ownProps} = props;
  return <Button {...ownProps}
                 endIcon={
    <img src={src} width={20} alt={alt}/>
  }
  />
}
