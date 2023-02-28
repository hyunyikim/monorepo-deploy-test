import {useNavigate} from 'react-router-dom';
import {Breadcrumbs as MuiBreadcrumbs, Link, Typography} from '@mui/material';

interface Props {
	before: {
		title: string;
		href: string;
	}[];
	current: string;
}

function Breadcrumbs({before, current}: Props) {
	const navigate = useNavigate();
	return (
		<MuiBreadcrumbs
			aria-label="breadcrumb"
			sx={{
				'.MuiBreadcrumbs-li': {
					'& .MuiLink-root': {
						color: 'grey.400',
					},
					'& .MuiTypography-root': {
						fontSize: '14px',
					},
					'&:nth-last-of-type(1)': {
						width: {
							md: '90%',
						},
					},
				},
			}}>
			{before.map((item) => (
				<Link
					key={item.title}
					underline="hover"
					// href={item.href}
					className="cursor-pointer"
					onClick={() => {
						navigate(item.href);
					}}>
					{item.title}
				</Link>
			))}
			<Typography className="bold text-ellipsis">{current}</Typography>
		</MuiBreadcrumbs>
	);
}

export default Breadcrumbs;
