import {useGetPartnershipInfo} from '@/stores';

import {Button} from '@/components';
import {
	generateProductExcelUploadColumns,
	getProductExcelSampleData,
} from '@/data';
import {ExcelField, ProductExcelUploadInput} from '@/@types';
import {downloadExcel, generateExcelFile} from '@/utils';
import {format} from 'date-fns';

interface Props {
	fields: ExcelField<ProductExcelUploadInput>[] | undefined;
}

function ProductExcelFormatDownloadButton({fields}: Props) {
	const {data: partnershipData} = useGetPartnershipInfo();

	const handleDownloadExcelFormat = async () => {
		if (!partnershipData) return;
		const data = generateProductExcelUploadColumns(
			fields as ExcelField<ProductExcelUploadInput>[]
		);
		const workbook = await generateExcelFile({
			...data,
			sampleData: getProductExcelSampleData(partnershipData),
		});
		await downloadExcel(
			workbook,
			`[버클]상품대량등록_엑셀_${format(
				new Date(),
				`yyyyMMddHHmmss`
			)}.xlsx`
		);
	};

	return (
		<Button
			variant="outlined"
			color="grey-100"
			height={32}
			onClick={handleDownloadExcelFormat}
			data-tracking={`itemadmin_excelpublish_download_click,{'button_title': '엑셀 양식 다운로드'}`}>
			엑셀양식 다운로드
		</Button>
	);
}

export default ProductExcelFormatDownloadButton;
