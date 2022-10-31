import {Breadcrumbs, Link, Typography} from '@mui/material';

interface Props {
	before: {
		title: string;
		href: string;
	}[];
	current: string;
	onClick: () => void;
}

function BreadCrumb({before, current, onClick}: Props) {
	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			sx={{
				'.MuiBreadcrumbs-li': {
					'& .MuiLink-root': {
						color: 'grey.400',
					},
					'& .MuiTypography-root': {
						fontSize: '14px',
					},
				},
			}}>
			{before.map((item) => (
				<Link
					key={item.title}
					underline="hover"
					// href={item.href}
					className="cursor-pointer"
					onClick={onClick}>
					{item.title}
				</Link>
			))}
			<Typography className="bold">{current}</Typography>
		</Breadcrumbs>
	);
}

export default BreadCrumb;
