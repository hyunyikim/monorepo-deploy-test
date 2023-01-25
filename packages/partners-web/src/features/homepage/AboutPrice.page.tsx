import React from 'react';
import {useOpen} from '@/utils/hooks';
import HomepageHeader from './common/Header';
import PriceIntroSection from './price/PriceIntroSection';

import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
import MainServiceSection from './price/MainServiceSection';
import PartnersHomepageFooter from './common/PartnersHomepageFooter';
import AdditionalServiceSection from './price/AdditionalServiceSection';
import PriceFAQSection from './price/PriceFAQSection';
import {IntroductionInquiryDialog} from '@/components';

function AboutPrice() {
	const {open, onOpen, onClose} = useOpen({});
	const openEmailModal = () => {
		onOpen();
	};

	return (
		<div className="homepage_container white">
			<HomepageHeader openEmailModal={openEmailModal} bgColor={'white'} />

			<PriceIntroSection openEmailModal={openEmailModal} />
			<MainServiceSection />
			<AdditionalServiceSection />
			<PriceFAQSection />

			<PartnersHomepageFooter />

			<IntroductionInquiryDialog
				open={open}
				onClose={onClose}
				target="new"
			/>
		</div>
	);
}

export default AboutPrice;
