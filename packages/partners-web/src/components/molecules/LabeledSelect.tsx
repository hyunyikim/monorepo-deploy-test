import {Ref, forwardRef} from 'react';

import {Stack} from '@mui/material';

import {Select, InputLabelTag} from '@/components';
import {Props as SelectProps} from '@/components/atoms/Select';

interface Props<T> extends SelectProps<T> {
	reqiured?: boolean;
	label?: string;
}

function LabeledSelect<T>(
	{required = false, label = '', ...props}: Props<T>,
	ref: Ref<unknown>
) {
	return (
		<Stack
			flexDirection="column"
			mb="24px"
			{...(ref && {
				ref,
			})}>
			<InputLabelTag required={required} labelTitle={label} />
			<Select {...props} />
		</Stack>
	);
}

export default forwardRef(LabeledSelect);
