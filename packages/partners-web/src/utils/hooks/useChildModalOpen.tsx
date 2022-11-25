import {useOpen} from '@/utils/hooks';
import {openChildModal, closeChildModal} from '@/utils/iframe.util';
import {useCallback} from 'react';

interface Props {
	initialOpen?: boolean;
	handleOpen?: () => void;
	handleClose?: () => void;
}

// 부모 창으로 모달 열림/닫힘 신호 보내는 hook
export const useChildModalOpen = ({
	initialOpen = false,
	handleOpen,
	handleClose,
}: Props) => {
	const onHandleOpen = useCallback(() => {
		openChildModal();
		handleOpen && handleOpen();
	}, [handleOpen]);

	const onHandleClose = useCallback(() => {
		closeChildModal();
		handleClose && handleClose();
	}, [handleClose]);

	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({
		initialOpen,
		handleOpen: onHandleOpen,
		handleClose: onHandleClose,
	});

	return {
		open,
		onOpen,
		modalData,
		onSetModalData,
		onClose,
	};
};

export default useChildModalOpen;
