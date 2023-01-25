import React from 'react';
import {greyArrow2x, greyArrow} from '@/assets/images/index';

import {sendAmplitudeLog} from '@/utils';
function FAQSection() {
	const screenWidth = window.innerWidth;

	const faqList = [
		{
			title: '디지털 개런티가 왜 필요한가요?',
			content:
				'상품을 판매하는 브랜드는 의무적으로 상품정보, 보증기간, 고객센터 운영 방안이 담긴 종이 보증서를 발급합니다. 수기로 관리하는 종이 보증서가 아닌 디지털 개런티를 통하여 손쉽게 발급할 수 있습니다.',
			key: 'whyNft',
		},
		{
			title: '디지털 개런티는 어떻게 발급하나요?',
			content: (
				<>
					회원가입 후, 브랜드 정체성이 담긴 디지털 개런티의 이미지를
					최초 1회 설정 합니다. 버클이 제공하는 단일 발급, 대량 발급,
					자동 발급 등의 다양한 기능을 활용하시면 됩니다.
					<br />
					<br />
					<a
						href="https://guide.vircle.co.kr/guarantee-create"
						target="_blank"
						rel="noreferrer"
						className="faq_link">
						이용가이드 보기
					</a>
				</>
			),
			key: 'howToIssue',
		},
		{
			title: '디지털 개런티는 고객에게 어떻게 발급되나요?',
			content: (
				<>
					카카오 알림톡을 통하여 개런티 발급 안내 메세지가 자동으로
					전송됩니다. 해당 메세지를 통하여 고객은 카카오톡 내 [Klip
					지갑]에 본인 소유의 개런티를 보관하게 됩니다.
					<br />
					<br />
					<a
						href="https://guide.vircle.co.kr/about-vircle"
						target="_blank"
						rel="noreferrer"
						className="faq_link">
						이용가이드 보기
					</a>
				</>
			),
			key: 'howUserGet',
		},
		// {
		//     title : '서비스 이용요금은 얼마인가요?',
		//     content: (
		//         <>
		//             Free요금제 사용 시 월 100개까지 개런티는 무료로 발급이 가능하며, 추가발급이나 부가기능 사용을 원하시면 요금제 업그레이드를 진행해주세요.
		//             <br/>
		//             <br/>
		//             <a href='/' target='_blank' className='faq_link'>
		//                 요금제 자세히보기
		//             </a>
		//         </>
		//     ),
		//     key : 'howMuch',
		// },
	];

	const openContent = (e) => {
		const targetIdx: string | number = e.target.dataset.idx;

		sendAmplitudeLog(`homepage_questions${targetIdx}_click`, {
			button_title: `자주 묻는 질문${targetIdx}`,
		});

		const popContainer = document.querySelector(
			'.faq_contents_container.pop'
		);
		const popContainerKey = popContainer ? popContainer.dataset.list : null;
		if (popContainer) {
			popContainer.classList.remove('pop');
		}

		const targetKey: string = e.target.dataset.list;
		const targetContainer = document.querySelector(
			`.faq_contents_container.${targetKey}`
		);

		if (targetKey === popContainerKey) {
			targetContainer.classList.remove('pop');
		} else {
			targetContainer.classList.add('pop');
		}
	};

	return (
		<section className="section faq">
			<div className="contents_container content">
				<div className="section_title_box faq">
					<span className="section_category">FAQ</span>
					<h6 className="section_title black">자주 묻는 질문</h6>
				</div>

				<div className="faq_box">
					{faqList.map(({title, content, key}, idx) => (
						<div
							key={`faq-${idx}`}
							className={`faq_contents_container ${key}`}
							data-list={key}>
							<div
								className="faq_contents_box"
								data-list={key}
								data-idx={idx + 1}
								onClick={openContent}>
								<div className="faq_title">{title}</div>
								<img
									src={greyArrow}
									srcSet={`${greyArrow} 1x, ${greyArrow2x} 2x`}
									className="list_arrow"
									alt="arrow"
								/>
							</div>

							<div className="content">{content}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default FAQSection;
