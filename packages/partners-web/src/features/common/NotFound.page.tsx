import {useNavigate} from 'react-router-dom';
import {makeStyles} from '@mui/styles';
import {Card, CardContent, Grid, Typography} from '@mui/material';

import ImageBackground from '@/assets/images/img-error-bg.svg';
import ImageBlue from '@/assets/images/img-error-blue.svg';
import ImageText from '@/assets/images/img-error-text.svg';
import ImagePurple from '@/assets/images/img-error-purple.svg';
import {Button} from '@/components';

const useStyles = makeStyles((theme) => ({
	errorImg: {
		maxWidth: '720px',
		margin: '0 auto',
		position: 'relative',
	},
	errorContent: {
		maxWidth: '360px',
		margin: '0 auto',
		textAlign: 'center',
	},
	errorBlock: {
		minHeight: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	imgBlock: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		animation: '3s bounce ease-in-out infinite',
	},
	imgBackground: {
		animation: '10s blink ease-in-out infinite',
	},
	imgBlue: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		animation: '15s wings ease-in-out infinite',
	},
	imgPurple: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		animation: '12s wings ease-in-out infinite',
	},
	title: {
		fontSize: '30px',
		fontWeight: 'bold',
		[theme.breakpoints.down('md')]: {
			fontSize: '24px',
		},
	},
}));

export default function NotFound() {
	const classes = useStyles();
	const navigate = useNavigate();

	const handleMoveToHome = () => {
		navigate('/');
	};
	return (
		<Card className={classes.errorBlock}>
			<CardContent>
				<Grid container justifyContent="center" spacing={3}>
					<Grid item xs={12}>
						<div className={classes.errorImg}>
							<ImageBackground
								className={classes.imgBackground}
							/>
							<ImageText className={classes.imgBlock} />
							<ImageBlue className={classes.imgBlue} />
							<ImagePurple className={classes.imgPurple} />
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.errorContent}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Typography
										component="div"
										className={classes.title}>
										페이지를 찾을 수 없습니다
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography
										sx={{
											fontSize: 14,
											fontWeight: 400,
											color: 'rgb(34, 34, 39)',
										}}>
										페이지가 삭제되었거나 변경되었을 수
										있습니다.
										<br />
										메인 페이지로 이동해주세요.
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Button
										color={'primary'}
										variant="contained"
										onClick={handleMoveToHome}>
										메인 페이지로 돌아가기
									</Button>
								</Grid>
							</Grid>
						</div>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
