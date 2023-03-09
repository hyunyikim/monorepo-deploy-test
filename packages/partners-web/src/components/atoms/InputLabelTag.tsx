import {useMemo} from 'react';
import {Box, InputLabel, Typography} from '@mui/material';

interface Props {
	required?: boolean;
	showRequiredChip?: boolean;
	sx?: object;
	labelTitle: string;
	linkUrl?: string;
	linkTitle?: string;
	onLinkClick?: () => void;
}

function InputLabelTag({
	required = false,
	showRequiredChip,
	sx,
	labelTitle,
	linkUrl,
	linkTitle,
	onLinkClick,
}: Props) {
	const requireSx = useMemo(() => {
		if (!showRequiredChip) {
			return {
				content: "''",
				padding: 0,
				display: 'none',
			};
		}
		switch (required) {
			case true:
				return {
					content: "'필수'",
				};
			default:
				return {
					content: "''",
					padding: 0,
					display: 'none',
				};
		}
	}, [required, showRequiredChip]);

	/**
	 * 링크 확인
	 */
	const linkGeneratorHelp = () => {
		if (onLinkClick && typeof onLinkClick === 'function') {
			onLinkClick();
		}
		if (linkUrl) {
			if (String(linkUrl).includes('http')) {
				window.open(linkUrl);
			} else {
				window.open(`https://${linkUrl}`);
			}
		}
		return;
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: ' row',
				alignContent: 'center',
				justifyContent: 'space-between',
				width: '100%',
			}}>
			<InputLabel
				required={required}
				sx={{
					display: 'flex',
					alignItems: 'center',
					color: 'grey.900',
					fontWeight: 700,
					fontSize: '14px',
					lineHeight: 1.45,
					marginBottom: '8px',

					'& .MuiFormLabel-asterisk': {
						fontSize: 0,
						color: 'red.main',
					},
					'&::after': {
						color: 'red.main',
						display: 'inline-block',
						backgroundColor: 'red.50',
						fontWeight: 700,
						fontSize: '11px',
						lineHeight: '16px',
						height: '16px',
						padding: '0 5px',
						borderRadius: '4px',
						marginLeft: '8px',
						...requireSx,
					},
					// '& .Mui-required' : {
					//     color : 'blue'
					// }
					...sx,
				}}>
				{labelTitle}
			</InputLabel>

			{linkUrl && (
				// <AtagComponent url={linkUrl}>
				<Typography
					onClick={linkGeneratorHelp}
					sx={{
						fontWeight: 700,
						fontSize: '14px',
						textDecoration: 'underline',
						color: '#526EFF',
						cursor: 'pointer',
					}}>
					{linkTitle || '링크 확인하기'}
				</Typography>
				// </AtagComponent>
			)}
		</Box>
	);
}

export default InputLabelTag;
