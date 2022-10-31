type RequestType =
	| 'link'
	| 'tracking'
	| 'guarantee_excel_download'
	| 'guarantee_excel_upload'
	| 'document_height'
	| 'open_modal';

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

export const openParantModal = (data: {title: string; content: string}) => {
	sendMessageToParent({
		type: 'open_modal',
		data: data,
	});
};
