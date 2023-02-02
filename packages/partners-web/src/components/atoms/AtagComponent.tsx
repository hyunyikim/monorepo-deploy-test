import {ReactNode} from 'react';
import styled from '@emotion/styled';

interface AtagProps {
	children: ReactNode;
	url: string;
	target?: string;
}
const LinkStyle = styled('a')`
	text-decoration: none;
`;

function AtagComponent({children, url, target = '_blank'}: AtagProps) {
	return (
		<LinkStyle href={url} target={target} rel="noreferrer">
			{children}
		</LinkStyle>
	);
}

export default AtagComponent;
