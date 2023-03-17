import {useNavigate} from 'react-router-dom';
import {
	endingBg,
	endingBg2x,
	endingTitle,
	endingTitle2x,
	endingTitleMobile,
	endingTitleMobile2x,
} from '@/assets/images/homepage/index';
import {sendAmplitudeLog} from '@/utils';

function EndingSection() {
	const screenWidth = window.innerWidth;
	const navigate = useNavigate();
	const goToSignup = () => {
		sendAmplitudeLog(`homepage_signupbottom_click`, {
			button_title: `무료로 시작하기`,
		});

		navigate(`/auth/signup`);
	};

	return (
		<section className="section ending">
			<img
				src={endingBg}
				srcSet={`${endingBg} 1x, ${endingBg2x} 2x`}
				alt="ending-bg"
				className={'ending_bg'}
			/>

			<div className="contents_container content">
				{screenWidth > 825 ? (
					<img
						src={endingTitle}
						srcSet={`${endingTitle} 1x, ${endingTitle2x} 2x`}
						alt="ending-bg"
						className={'ending_title'}
					/>
				) : (
					<img
						src={endingTitleMobile}
						srcSet={`${endingTitleMobile} 1x, ${endingTitleMobile2x} 2x`}
						alt="ending-bg"
						className={'ending_title'}
					/>
				)}
				<button className="ending_btn" onClick={goToSignup}>
					무료로 시작하기
				</button>
			</div>
		</section>
	);
}

export default EndingSection;
