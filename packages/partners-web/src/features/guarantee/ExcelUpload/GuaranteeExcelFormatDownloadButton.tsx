import {useGetPartnershipInfo} from '@/stores';

import {Button} from '@/components';
import {
	generateGuaranteeExcelUploadColumns,
	getGuaranteeExcelSampleData,
} from '@/data';
import {ExcelField, GuaranteeExcelUploadFormData} from '@/@types';
import {downloadExcel, generateExcelFile} from '@/utils';
import {format} from 'date-fns';

interface Props {
	fields: ExcelField<GuaranteeExcelUploadFormData>[] | undefined;
}

function GuaranteeExcelFormatDownloadButton({fields}: Props) {
	const {data: partnershipData} = useGetPartnershipInfo();

	const handleDownloadExcelFormat = async () => {
		if (!partnershipData) return;
		const data = generateGuaranteeExcelUploadColumns(
			fields as ExcelField<GuaranteeExcelUploadFormData>[]
		);
		const workbook = await generateExcelFile({
			...data,
			sampleData: getGuaranteeExcelSampleData(partnershipData),
		});
		await downloadExcel(
			workbook,
			`[버클]개런티발급_엑셀_${format(new Date(), `yyyyMMddHHmmss`)}.xlsx`
		);
	};

	return (
		<Button
			variant="outlined"
			color="grey-100"
			height={32}
			onClick={handleDownloadExcelFormat}
			data-tracking={`guarantee_excelpublish_download_click,{'button_title': '엑셀 양식 다운로드'}`}>
			엑셀양식 다운로드
		</Button>
	);
}

export default GuaranteeExcelFormatDownloadButton;
