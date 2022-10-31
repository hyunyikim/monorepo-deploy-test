import {useState, useCallback} from 'react';

interface Props {
	initialOpen?: boolean;
	handleOpen?: () => void;
	handleClose?: () => void;
}

/**
 * 컴포넌트를 열고 닫는 hook
 *
 * Dialog, Tooltip 등에 함께 사용한다.
 * @param initialOpen 처음 지정할 값
 * @param handleOpen 열릴 때, 수행되어야 하는 함수
 * @param handleClose 닫힐 때, 수행되어야 하는 함수
 * @returns
 */
const useOpen = ({initialOpen = false, handleOpen, handleClose}: Props) => {
	const [open, setOpen] = useState(initialOpen);
	const [data, setData] = useState<any>();

	const onOpen = useCallback(() => {
		if (handleOpen) {
			handleOpen();
		}
		setOpen(true);
	}, [handleOpen]);

	const onClose = useCallback(() => {
		if (handleClose) {
			handleClose();
		}
		setOpen(false);
	}, [handleClose]);

	return {
		open,
		onOpen,
		modalData: data,
		onSetModalData: setData,
		onClose,
	};
};

export default useOpen;
