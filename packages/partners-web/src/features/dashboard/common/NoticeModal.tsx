import React, {useState} from 'react';
import {Stack, Typography} from '@mui/material';
import AtagComponent from '@/components/atoms/AtagComponent';
import Button from '@/components/atoms/Button';

interface NoticeModalProps {
	closeModal: () => void;
}

function NoticeModal({closeModal}: NoticeModalProps) {
	return (
		<Stack
			sx={{
				zIndex: 5,
				width: '100%',
				height: '100%',
				justifyContent: 'space-between',
			}}>
			<Typography
				variant="body3"
				sx={{
					fontWeight: 500,
					fontSize: '16px',
					lineHeight: '24px',
					color: '#000000',
					margin: 0,
				}}>
				안녕하세요. 버클입니다.
				<br />
				버클의 서비스를 이용해주시는 회원분들께 감사드리며, 이용약관 및
				개인정보 처리방침의 개정을 안내드리오니 서비스 이용에 참고하시기
				바랍니다. 개정되는 약관은 2023년 2월 13일부터 적용될 예정입니다.
				<br />
				<br />
				변경된 이용약관 및 개인정보 처리방침의 전문은 아래 링크에서
				확인하실 수 있습니다.
				<br />
				<br />
				<AtagComponent url="https://guide.vircle.co.kr/policy/agreement_230213">
					<Typography
						variant="h4"
						sx={{
							fontWeight: 500,
							fontSize: '16px',
							lineHeight: '24px',
							color: 'grey.900',
							margin: 0,
							textDecoration: 'underline',
							display: 'inline-block',
						}}>
						이용약관 변경사항 확인
					</Typography>
				</AtagComponent>
				<br />
				<AtagComponent url="https://guide.vircle.co.kr/policy/terms_230213">
					<Typography
						variant="h4"
						sx={{
							fontWeight: 500,
							fontSize: '16px',
							lineHeight: '24px',
							color: 'grey.900',
							margin: 0,
							textDecoration: 'underline',
							display: 'inline-block',
						}}>
						개인정보 처리방침 변경사항 확인
					</Typography>
				</AtagComponent>
			</Typography>

			<Stack
				flexDirection={'row'}
				justifyContent="flex-end"
				alignItems="center"
				gap="8px"
				sx={{
					marginTop: 'auto',
				}}>
				<Button color="black" variant="outlined" onClick={closeModal}>
					닫기
				</Button>

				<AtagComponent url="https://guide.vircle.co.kr/policy-change_230213">
					<Button color="black" variant="contained">
						자세히보기
					</Button>
				</AtagComponent>
			</Stack>
		</Stack>
	);
}

export default NoticeModal;
