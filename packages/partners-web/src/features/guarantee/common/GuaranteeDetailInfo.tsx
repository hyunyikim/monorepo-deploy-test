import {Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';
import {Button} from '@/components';
import {IcPaperPlane, IcLinkWhite20} from '@/assets/icon';
import {sendAmplitudeLog} from '@/utils';

import DetailInfoColumn from '@/features/common/DetailInfoColumn';

function GuaranteeDetailInfo({data}: {data: GuaranteeDetail}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography variant="subtitle2" mb="12px">
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
				<DetailInfoColumn
					title="발급일"
					value={data?.appliedAt ? data?.appliedAt.slice(0, 10) : '-'}
				/>
				<DetailInfoColumn
					title="개런티 번호"
					value={data?.nftNumber || ''}
				/>
				<DetailInfoColumn
					title="NFT ID"
					value={data?.tokenId || '-'}
					{...(data?.tokenId && {
						isLink: true,
						onClick: () => {
							sendAmplitudeLog('guarantee_detail_nftid_click', {
								button_title: 'nft id 클릭',
							});
							const klaytnUrl = `${KLAYTN_SCOPE_URL}/nft/${
								data.blockchainPlatform === 'klaytn-kas'
									? KLAYTN_CONTRACT_ADDRESS
									: KLIP_CONTRACT_ADDRESS
							}/${parseInt(data?.tokenId, 16)}`;
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
				{data?.externalLink && (
					<Button
						variant="contained"
						startIcon={<IcLinkWhite20 />}
						data-tracking={`guarantee_detail_url_click,{'button_title': '개런티 url 클릭'}`}
						onClick={() => {
							data?.externalLink &&
								window.open(data?.externalLink);
						}}>
						개런티 URL
					</Button>
				)}
				{data?.transactionHash && (
					<Button
						variant="contained"
						color="primary-50"
						startIcon={<IcPaperPlane />}
						onClick={() => {
							const transactionHash = data?.transactionHash;
							if (!transactionHash) return;
							const url = `${KLAYTN_SCOPE_URL}/tx/${transactionHash}`;
							window.open(url);
						}}
						data-tracking={`guarantee_detail_itemimage_click,{'button_title': '트랜잭션 해시값 클릭'}`}>
						트랜잭션 해시
					</Button>
				)}
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailInfo;
