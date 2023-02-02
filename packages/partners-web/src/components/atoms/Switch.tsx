import MuiSwitch, {SwitchProps} from '@mui/material/Switch';

export default function Switch({...props}: SwitchProps) {
	return (
		<>
			<MuiSwitch
				focusVisibleClassName=".Mui-focusVisible"
				disableRipple
				{...props}
				sx={(theme) => ({
					width: 40,
					height: 24,
					padding: 0,
					'& .MuiSwitch-switchBase': {
						padding: 0,
						margin: '3px',
						transitionDuration: '300ms',
						'&.Mui-checked': {
							transform: 'translateX(16px)',
							color: '#fff',
							'& + .MuiSwitch-track': {
								backgroundColor: 'green.main',
								opacity: 1,
								border: 0,
							},
							'&.Mui-disabled + .MuiSwitch-track': {
								opacity: 0.5,
							},
						},
						'&.Mui-focusVisible .MuiSwitch-thumb': {
							color: 'green.main',
							border: '6px solid #fff',
						},
						'&.Mui-disabled .MuiSwitch-thumb': {
							color: 'grey.100',
						},
						'&.Mui-disabled + .MuiSwitch-track': {
							opacity: 0.7,
						},
					},
					'& .MuiSwitch-thumb': {
						boxSizing: 'border-box',
						width: 18,
						height: 18,
						boxShadow: 'none',
					},
					'& .MuiSwitch-track': {
						borderRadius: '28px',
						backgroundColor: 'grey.100',
						opacity: 1,
						transition: theme.transitions.create(
							['background-color'],
							{
								duration: 500,
							}
						),
					},
				})}
			/>
		</>
	);
}
