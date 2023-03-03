import {Stack} from '@mui/material';
import React, {forwardRef, MutableRefObject, Ref, useCallback} from 'react';

interface Props {
	children: React.ReactNode;
}

/**
 * input file을 숨겨주고, drag, drop event 발생시 .dragover를 부여해주는 컴포넌트
 *
 * input file 태그는 children 내에서 정의해줌
 * 스타일은 외부에서 정의한 children으로부터 결정됨
 */
function DragDropBox({children}: Props, ref: Ref<HTMLElement>) {
	const onDragEnter = useCallback(() => {
		(ref as MutableRefObject<HTMLElement>)?.current?.classList.add(
			'dragover'
		);
	}, []);

	const onDragLeave = useCallback(() => {
		(ref as MutableRefObject<HTMLElement>)?.current?.classList.remove(
			'dragover'
		);
	}, []);

	return (
		<Stack
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDrop={onDragLeave}
			sx={{
				position: 'relative',
				'& input': {
					position: 'absolute',
					top: 0,
					width: '100%',
					height: '100%',
					opacity: 0,
					cursor: 'pointer',
				},
			}}>
			{children}
		</Stack>
	);
}

export default forwardRef(DragDropBox);
