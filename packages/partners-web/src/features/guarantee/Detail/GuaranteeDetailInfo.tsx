import {format} from 'date-fns';

import {Stack, Typography} from '@mui/material';

import {Guarantee} from '@/@types';
import {Button} from '@/components';
import {IcPaperPlane, IcLinkWhite20} from '@/assets/icon';
import {sendAmplitudeLog} from '@/utils';

import GuaranteeDetailInfoColumn from '@/features/guarantee/Detail/GuaranteeDetailInfoColumn';

function GuaranteeDetailInfo({data}: {data: Guarantee}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography fontSize={18} fontWeight="bold" mb="24px">
				디지털 개런티 정보
			</Typography>
			<Stack
				flexDirection={{
					xs: 'column',
					md: 'row',
				}}
				justifyContent={{
					xs: 'flex-start',
					md: 'space-between',
				}}
				rowGap="20px"
				sx={{
					'& > *': {
						flex: 1,
					},
				}}>
				<GuaranteeDetailInfoColumn
					title="발급일"
					value={
						data?.nft_issue_dt || format(new Date(), 'yyyy-MM-dd')
					}
				/>
				<GuaranteeDetailInfoColumn
					title="개런티 번호"
					value={data?.nft_req_num || ''}
				/>
				<GuaranteeDetailInfoColumn
					title="NFT ID"
					value={data?.token_id || '-'}
					{...(data?.token_id && {
						isLink: true,
						onClick: () => {
							sendAmplitudeLog('guarantee_detail_nftid_click', {
								button_title: 'nft id 클릭',
							});
							const klaytnUrl = `${KLAYTN_SCOPE_URL}/nft/${
								data.blockchain_platform === 'klaytn-kas'
									? KLAYTN_CONTRACT_ADDRESS
									: KLIP_CONTRACT_ADDRESS
							}/${parseInt(data?.token_id as string, 16)}`;
							window.open(klaytnUrl);
						},
					})}
				/>
			</Stack>
			<Stack
				flexDirection={{
					xs: 'column',
					sm: 'row',
				}}
				columnGap="16px"
				rowGap="16px"
				mt="24px">
				<Button
					variant="contained"
					startIcon={<IcLinkWhite20 />}
					onClick={() => {
						sendAmplitudeLog('guarantee_detail_url_click', {
							button_title: '개런티 url 클릭',
						});
						const externalLink = data?.external_link;
						if (!externalLink) return;
						window.open(externalLink as string);
					}}>
					개런티 URL
				</Button>
				<Button
					variant="contained"
					color="blue-50"
					startIcon={<IcPaperPlane />}
					onClick={() => {
						const transactionHash = data?.transaction_hash;
						if (!transactionHash) return;
						const url = `${KLAYTN_SCOPE_URL}/tx/${
							transactionHash as string
						}`;
						window.open(url);
					}}
					data-tracking={`guarantee_detail_itemimage_click,{'button_title': '트랜잭션 해시값 클릭'}`}>
					트랜잭션 해시
				</Button>
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailInfo;
