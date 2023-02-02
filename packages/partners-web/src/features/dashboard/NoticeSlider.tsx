import {useState, useEffect, useCallback} from 'react';

import {nonAuthInstance} from '@/api';
import useDashboardStyles from './useDashboardStyles';

import {IcMegaphone, IcChevronRight} from '@/assets/icon';

const NOTICE_TABLE_API_URL =
	'https://notion-api.splitbee.io/v1/table/55a4847010be4506aa3772ba2790941b';
const NOTICE_URL = 'https://guide.vircle.co.kr/notice';

const settings = {
	infinite: true,
	speed: 500,
	vertical: true,
	autoplay: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
};

interface NoticeResponse {
	Date: string;
	Name: string;
	id: string;
}

function NoticeSlider() {
	const classes = useDashboardStyles();
	const [notionTableList, setNotionTableList] = useState<
		NoticeResponse[] | null
	>(null);

	useEffect(() => {
		(async () => {
			const res = await nonAuthInstance.get(NOTICE_TABLE_API_URL);
			setNotionTableList(res.data as NoticeResponse[]);
		})();
	}, []);

	const getNotionDate = useCallback((li: NoticeResponse) => {
		const key = Object.keys(li).find((item) => item.includes('Date')) as
			| 'Date'
			| null;
		const value = key ? li[key] : '';
		return <span className={classes.dateText}>{value}</span>;
	}, []);

	const openNotice = useCallback((_idx?: number) => {
		let urlIdx;
		if (_idx) {
			if (_idx < 10) {
				urlIdx = `0${_idx}`;
			} else {
				urlIdx = _idx;
			}
			return window.open(`${NOTICE_URL}/${urlIdx}`);
		}
		return window.open(NOTICE_URL);
	}, []);

	return (
		<div>
			{notionTableList &&
				notionTableList?.map((li, idx: number) => (
					<div
						className={classes.slideFlexContainer}
						key={`${li.id}`}>
						<div className={classes.slideFlexItem}>
							<div className={classes.greyCircle}>
								<IcMegaphone
									style={{
										height: '24px',
									}}
								/>
							</div>
							<h6
								className={classes.noticeTitle}
								onClick={() => openNotice(idx + 1)}>
								{li?.Name}
							</h6>
							{getNotionDate(li)}
						</div>
						<IcChevronRight
							cursor="pointer"
							style={{
								height: '24px',
							}}
							onClick={() => openNotice()}
						/>
					</div>
				))}
		</div>
	);
}

export default NoticeSlider;
