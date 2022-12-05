import {useState} from 'react';
import {InputFormSection} from '@/features/setup/SetupGuarantee.page';

function SetupGuarantee() {
	const [boxIndexState, setBoxIndexState] = useState<number>(0);
	/**
	 * 폼 인풋 박스 오픈 핸들러
	 *
	 * @param _index
	 */
	const boxOpenHandler = (_index: number) => {
		if (boxIndexState === _index) {
			setBoxIndexState(_index);
		} else {
			setBoxIndexState(_index);
		}
	};

	const justOpenBox = (_idx: number) => {
		setBoxIndexState(_idx);
	};

	return (
		<InputFormSection
			boxIndexState={boxIndexState}
			boxOpenHandler={boxOpenHandler}
			justOpenBox={justOpenBox}
		/>
	);
}

export default SetupGuarantee;
