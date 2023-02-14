import React, {useEffect} from 'react';
import HomepageHeader from '@/features/homepage/common/Header';
import InquiryIntro from '@/features/homepage/inquiry/InquiryIntro';
import BenefitOfNFT from '@/features/homepage/inquiry/BenefitOfNFT';
import InquiryForm from '@/features/homepage/inquiry/InquiryForm';
import {sendAmplitudeLog} from '@/utils';

function Inquiry() {
	useEffect(() => {
		sendAmplitudeLog('inquiry_pv', {
			pv_title: '도입문의 페이지 노출',
		});
	}, []);
	return (
		<div className="homepage_container">
			<HomepageHeader bgColor={'black'} />

			<InquiryIntro />
			{/* <BenefitOfNFT /> */}
			<InquiryForm />
		</div>
	);
}

export default Inquiry;
