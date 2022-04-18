import { Translation as L18Translation } from 'react-i18next';

type TranslateProps = {
    label: string;
    args?: {[key: string]: string | number},
    count?: number;
};

export const Translation = ({label, count, args}: TranslateProps) => {
    return (<L18Translation>
        {
            (t) => <>{
                args === undefined && count === undefined ? t(label):
                    args !== undefined && count !== undefined ? t(label, {...args, ...{count}}):
                        args !== undefined ? t(label, args):
                            count !== undefined ? t(label, {count})
                                : `Undefined arguments for ${label}!`
            }</>
        }
    </L18Translation>);
}

export const TranslatedLabel = (props: TranslateProps) => {
    return (<label><Translation {...props}/></label>)
}
