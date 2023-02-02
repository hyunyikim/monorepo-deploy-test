import {
	Breadcrumbs as MuiBreadcrumbs,
	BreadcrumbsProps,
	Typography,
} from '@mui/material';

import {IcChevronRight} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';

interface Props extends BreadcrumbsProps {
	beforeList: {name: string; onClick: () => void}[];
	now: string;
}

function Breadcrumbs({beforeList, now, ...props}: Props) {
	return (
		<MuiBreadcrumbs
			separator={
				<IcChevronRight
					color={style.virclePrimary500}
					width={14}
					height={14}
				/>
			}
			aria-label="breadcrumb"
			sx={{
				'& .MuiBreadcrumbs-separator': {
					color: 'primary.main',
				},
			}}
			{...props}>
			{[
				...beforeList.map((before, idx) => (
					<Typography
						key={idx + 1}
						variant="body3"
						fontWeight="bold"
						color="primary.main"
						className="cursor-pointer"
						onClick={before.onClick}>
						{before.name}
					</Typography>
				)),
				<Typography
					key={beforeList.length + 1}
					variant="body3"
					fontWeight="bold"
					color="grey.900">
					{now}
				</Typography>,
			]}
		</MuiBreadcrumbs>
	);
}

export default Breadcrumbs;
