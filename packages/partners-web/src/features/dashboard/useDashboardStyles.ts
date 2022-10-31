import {Theme} from '@mui/material';
import {makeStyles} from '@mui/styles';

const useDashboardStyles = makeStyles((theme: Theme) => ({
	chartCard: {
		height: '400px',
		borderRadius: '16px',
		'& .data-dl': {
			margin: 0,
			'& .value': {
				margin: '0 0 12px',
				fontSize: '24px',
				fontWeight: '700',
				lineHeight: '30px',
				'& strong': {
					fontSize: '40px',
					lineHeight: '50px',
				},
			},
			'& .title': {
				margin: 0,
				fontSize: '14px',
				lineHeight: '18px',
				color: theme.palette.grey[400],
			},
		},
		'& .chart-wrap': {
			width: '100%',
			'& svg': {
				height: 290,
			},
			'& .apexcharts-graphical': {
				transform: 'translate(6px, 5px)',
			},
			'& .apexcharts-grid': {
				borderBottom: `solid 1px ${theme.palette.grey[100]}`,
			},
			'& .apexcharts-yaxis': {
				transform: 'translate(-5px, 9px)',
				'& tspan': {
					fontWeight: 500,
					fontSize: '14px',
				},
			},
			'& .apexcharts-xaxis': {
				'& tspan': {
					fontWeight: 500,
					fontSize: '14px',
				},
			},
		},
	},
	totalMonthlyCard: {
		position: 'relative',
		height: '400px',
		background:
			'linear-gradient(98.38deg, #5D9BF9 43.58%, #5C3EF6 104.42%)',
		color: '#fff',
		borderRadius: '16px',
		'& .data-dl': {
			margin: 0,
			'& .title': {
				margin: '0 0 24px',
				fontSize: '20px',
				lineHeight: '25px',
			},
			'& .value': {
				margin: 0,
				fontWeight: '700',
				'& strong': {
					fontSize: '60px',
					lineHeight: '75px',
				},
			},
		},
	},
	cardsImg: {
		position: 'absolute',
		right: '30px',
		bottom: '30px',
	},
	statusWeeklyCard: {
		height: '200px',
		borderRadius: '16px',
		'& .data-dl': {
			margin: 0,
			'& .title': {
				margin: '0 0 4px',
				fontSize: '20px',
				lineHeight: '25px',
				fontWeight: '700',
			},
			'& .desc': {
				margin: '0 0 58px',
				fontSize: '14px',
				lineHeight: '18px',
				color: theme.palette.grey[300],
			},
			'& .value': {
				margin: 0,
				fontWeight: '700',
				fontSize: '24px',
				lineHeight: '32px',
				'& strong': {
					fontSize: '40px',
					lineHeight: '40px',
				},
			},
		},
	},
	feedbackCard: {
		height: '200px',
		borderRadius: '16px',
		'& .data-dl': {
			margin: 0,
			'& .title': {
				margin: '0 0 16px',
				fontSize: '20px',
				lineHeight: '25px',
				fontWeight: '700',
				'&.connect': {
					fontWeight: 700,
					fontSize: '21px',
					lineHeight: '27px',
					color: '#222227',
				},
			},
			'& .desc': {
				margin: '0 0 24px',
				fontSize: '14px',
				lineHeight: '18px',
				'&.connect': {
					fontWeight: 700,
					fontSize: '13px',
					lineHeight: '16px',
					color: '#526EFF',
					marginBottom: '7px',
				},
			},
		},
	},
	connectServiceCard: {
		height: '200px',
		borderRadius: '16px',
		position: 'relative',
		padding: '12px',
		paddingRight: 0,
	},
	connectServiceButton: {
		maxWidth: '365px',
		maxHeight: '200px',
		width: '100%',
		height: '100%',
		backgroundSize: 'contain !important',
		backgroundRepeat: 'no-repeat !important',
		backgroundPosition: 'center !important',
	},
	noticeCarouselContainer: {
		width: '100%',
		height: '66px',
		backgroundColor: 'white',
		marginBottom: '36px',
		borderRadius: '16px',
		padding: '12px 19px',

		'& .slick-list': {
			height: '42px',
			'& .slick-track': {
				height: '42px',
				'& .slick-slide': {
					height: '42px',
				},
			},
		},
	},
	btnConnect: {
		height: '34px',
		width: '138px',
		position: 'absolute',
		bottom: '20px',
		left: '12px',
	},
	slideFlexContainer: {
		display: 'flex !important',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: '42px',
		'& *': {
			height: '42px',
		},
	},
	slideFlexItem: {
		display: 'flex !important',
		alignItems: 'center',
		gap: '18px',
	},
	greyCircle: {
		borderRadius: '50%',
		minWidth: '42px',
		minHeight: '42px',
		backgroundColor: '#F3F3F5',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	noticeIcon: {
		height: '24px',
		width: '24px',
		margin: '9px auto',
	},
	noticeTitle: {
		fontSize: '18px',
		color: 'black',
		fontWeight: 500,
		lineHeight: '42px',
		cursor: 'pointer',

		display: '-webkit-box',
		WebkitLineClamp: 1,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordWrap: 'break-word',

		'&:hover': {
			textDecoration: 'underline',
		},
	},
	dateText: {
		fontSize: '16px',
		color: '#8E8E98',
		fontWeight: 500,
		lineHeight: '40px',
		marginLeft: '5px',

		display: '-webkit-box',
		WebkitLineClamp: 1,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordWrap: 'break-word',
	},
}));

export default useDashboardStyles;
