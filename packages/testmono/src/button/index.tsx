import {forwardRef, PropsWithChildren} from 'react';
export interface PaperProps {
	className?: string;
	disablePadding?: boolean;
	square?: boolean;
	shadow?: boolean;
}

const Paper = forwardRef<HTMLDivElement, PropsWithChildren<PaperProps>>(
	(
		{
			className,
			disablePadding = false,
			square = false,
			shadow = false,
			children,
		},
		ref
	) => {
		return (
			<div ref={ref} className={className}>
				{children}
			</div>
		);
	}
);

export default Paper;
