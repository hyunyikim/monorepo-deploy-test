type RequestType =
	| 'link'
	| 'link_state'
	| 'link_replace'
	| 'go_back'
	| 'guarantee_excel_download'
	| 'guarantee_excel_upload'
	| 'document_height'
	| 'scroll_up'
	| 'open_modal'
	| 'open_child_modal'
	| 'update_partnership_data'
	| 'price_plan_data'
	| 'login'
	| 'close_child_modal'
	| 'open_channel_talk';

export const sendMessageToParent = (data: {type: RequestType; data: any}) => {
	window.parent.postMessage(data, '*');
};

// 부모창에서 페이지 이동
export const goToParentUrl = (url: string) => {
	sendMessageToParent({
		type: 'link',
		data: url,
	});
};

// history state와 함께 이동할 경우
export const goToParentUrlWithState = (url: string, state: any) => {
	sendMessageToParent({
		type: 'link_state',
		data: {
			url,
			state,
		},
	});
};

export const replaceToParentUrl = (url: string) => {
	sendMessageToParent({
		type: 'link_replace',
		data: url,
	});
};

export const goBack = () => {
	sendMessageToParent({
		type: 'go_back',
		data: null,
	});
};

// 개런티 엑셀 다운로드 요청
export const downloadGuaranteeExcel = () => {
	sendMessageToParent({
		type: 'guarantee_excel_download',
		data: null,
	});
};

// 개런티 엑셀 업로드 페이지 이동
export const goToGuaranteeExcelUploadPage = () => {
	sendMessageToParent({
		type: 'guarantee_excel_upload',
		data: null,
	});
};

// iframe 자식창 높이값 전달
export const sendResizedIframeChildHeight = (height: number) => {
	sendMessageToParent({
		type: 'document_height',
		data: height,
	});
};

export const scrollUpParent = () => {
	sendMessageToParent({
		type: 'scroll_up',
		data: null,
	});
};

export const openParantModal = (data: {title: string; content: string}) => {
	sendMessageToParent({
		type: 'open_modal',
		data: data,
	});
};

export const openChildModal = () => {
	sendMessageToParent({
		type: 'open_child_modal',
		data: null,
	});
};

export const closeChildModal = () => {
	sendMessageToParent({
		type: 'close_child_modal',
		data: null,
	});
};

export const updateParentPartnershipData = () => {
	sendMessageToParent({
		type: 'update_partnership_data',
		data: null,
	});
};

export const loginToParent = (
	token: string,
	{
		isDuringInstallCafe24,
		isTempPasswordLogin,
	}: {
		isDuringInstallCafe24?: boolean;
		isTempPasswordLogin?: boolean;
	}
) => {
	sendMessageToParent({
		type: 'login',
		data: {
			token,
			isDuringInstallCafe24,
			isTempPasswordLogin,
		},
	});
};

export const updateUserPricePlanData = () => {
	sendMessageToParent({
		type: 'price_plan_data',
		data: null,
	});
};

export const openChannelTalk = () => {
	sendMessageToParent({
		type: 'open_channel_talk',
		data: null,
	});
};
