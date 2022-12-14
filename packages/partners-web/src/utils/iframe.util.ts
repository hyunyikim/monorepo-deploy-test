type RequestType =
	| 'link'
	| 'link_replace'
	| 'go_back'
	| 'tracking'
	| 'guarantee_excel_download'
	| 'guarantee_excel_upload'
	| 'document_height'
	| 'scroll_up'
	| 'open_modal'
	| 'open_child_modal'
	| 'update_partnership_data'
	| 'close_child_modal';

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

// 부모창에서 트래킹
export const trackingToParent = (event: string, props: any, callback?: any) => {
	sendMessageToParent({
		type: 'tracking',
		data: {
			event,
			props,
			callback,
		},
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
