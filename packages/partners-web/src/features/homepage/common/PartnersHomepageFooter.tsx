import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/react';

import {footerLogo, footerLogo2x} from '@/assets/images/homepage/index';

function PartnersHomepageFooter() {
	return (
		<footer className="homepage_footer_container">
			<div className="contents_container content">
				<div className="company_service_section">
					<img
						src={footerLogo}
						srcSet={`${footerLogo} 1x, ${footerLogo2x} 2x`}
						className="footer_logo"
						alt="mass-adoption-logo"
					/>

					<ul className="service_list_box">
						{/* <li className='list_category'>
                            <h2 className='footer_category_title'>소개</h2>

                            <h6 className='category_list'>VIRCLE 홈</h6>
                            <h6 className='category_list'>버클팀</h6>
                        </li>

                        <li className='list_category'>
                            <h2 className='footer_category_title'>기능소개</h2>

                            <h6 className='category_list'>개런티발급</h6>
                            <h6 className='category_list'>주문연동</h6>
                            <h6 className='category_list'>상품관리</h6>
                        </li>

                        <li className='list_category'>
                            <h2 className='footer_category_title'>버클채널</h2>

                            <h6 className='category_list'>공식 블로그</h6>
                            <h6 className='category_list'>인스타그램</h6>
                            <h6 className='category_list'>링크드인</h6>
                        </li> */}
					</ul>
				</div>

				<div className="company_service_section">
					<ul className="service_centre_box">
						<h2 className="footer_service_centre_title">
							고객센터
						</h2>

						<li className="list_category">
							<h6 className="service_text">전화 : </h6>
							<a
								href="tel:070-7589-7711"
								className="service_text">
								070-7589-7711
							</a>
						</li>
						<li className="list_category">
							<h6 className="service_text">이메일 : </h6>
							<a
								href="mailto:cs@mass-adoption.com"
								rel="noreferrer"
								target={'_blank'}
								className="service_text">
								cs@mass-adoption.com
							</a>
						</li>
					</ul>
				</div>

				<div className="company_information_section">
					<div className="company_information_text">
						C 2022 Mass Adoption Corp.
						<br />
						사업자등록번호 469-88-01884 | 통신판매업신고번호: 제
						2021-서울강남-06170 호 | 대표: 박찬우
						<br />
						서울특별시 성동구 아차산로9길 21, 이레타워 2층
						<br />
						<a
							href="https://guide.vircle.co.kr/policy/agreement_230213"
							target="_blank"
							rel="noreferrer">
							<h6 className="link_text">서비스이용약관</h6>
						</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a
							href="https://guide.vircle.co.kr/policy/terms_230213"
							target="_blank"
							rel="noreferrer">
							<h6 className="link_text">개인정보처리방침</h6>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default PartnersHomepageFooter;
