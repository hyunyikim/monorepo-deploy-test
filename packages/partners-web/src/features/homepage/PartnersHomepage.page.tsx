import React, {useState, useEffect} from 'react';

import HomepageHeader from './common/Header';
import PartnersHomepageFooter from './common/PartnersHomepageFooter';
import StopPaperPromotionModal from './common/StopPaperPromotionModal';

import IntroSection from './main/IntroSection';
import GuaranteeIntroSection from './main/GuaranteeIntroSection';
import GuaranteeDescSection from './main/GuaranteeDescSection';
import BrandCardDesignSection from './main/BrandCardDesignSection';
import CategoryBrandSection from './main/CategoryBrandSection';
import FAQSection from './main/FAQSection';
import EndingSection from './main/EndingSection';

import {trackingToParent} from '@/utils';
import {useOpen} from '@/utils/hooks';
import IntroductionInquiryDialog from '../auth/signup/IntroductionInquiryDialog';

function PartnersHomepage() {
	const {open, onOpen, onClose} = useOpen({});
	const [promotionModal, setPromotionModal] = useState<boolean>(false);
	const doNotOpenPromotionPopupToday = localStorage.getItem(
		'doNotOpenPromotionPopupToday'
	);
	const isDoNotOpenPromotionPopup =
		doNotOpenPromotionPopupToday &&
		new Date(doNotOpenPromotionPopupToday) > new Date();

	const openEmailModal = () => {
		onOpen();
	};
	const closePromotionModal = () => {
		setPromotionModal(false);
	};

	useEffect(() => {
		trackingToParent('homepage_pv', {pv_title: '홈페이지 진입'});
		setTimeout(() => {
			if (!isDoNotOpenPromotionPopup) {
				setPromotionModal(true);
			}
		}, 500);
	}, []);

	return (
		<div className="homepage_container">
			<HomepageHeader openEmailModal={openEmailModal} />

			<IntroSection openEmailModal={openEmailModal} />
			<GuaranteeIntroSection />
			<GuaranteeDescSection />
			<BrandCardDesignSection />
			<CategoryBrandSection />
			<FAQSection />
			<EndingSection />
			<PartnersHomepageFooter />

			<StopPaperPromotionModal
				cookieKey="doNotOpenPromotionPopupToday"
				closeModal={closePromotionModal}
				isOpen={promotionModal}
			/>
			<IntroductionInquiryDialog
				open={open}
				onClose={onClose}
				target="new"
			/>
		</div>
	);
}

export default PartnersHomepage;
