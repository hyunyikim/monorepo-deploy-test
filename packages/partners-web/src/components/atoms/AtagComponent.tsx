import {ReactNode} from 'react';
import styled from '@emotion/styled';
import {SxProps} from '@mui/system';

interface AtagProps {
	children: ReactNode;
	url: string;
	target?: string;
	sx?: SxProps;
}
type AStyleProps = {
	customisedStyle: SxProps;
};
const LinkStyle = styled('a')<AStyleProps>`
	text-decoration: none;

	${({customisedStyle}) => ({
		...customisedStyle,
	})}
`;

function AtagComponent({children, url, target = '_blank', sx}: AtagProps) {
	return (
		<LinkStyle
			href={url}
			target={target}
			rel="noreferrer"
			customisedStyle={sx || {}}>
			{children}
		</LinkStyle>
	);
}

export default AtagComponent;
