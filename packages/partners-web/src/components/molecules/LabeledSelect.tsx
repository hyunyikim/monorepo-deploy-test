import {Ref, forwardRef} from 'react';
import {FieldError} from 'react-hook-form';

import {Stack} from '@mui/material';

import {Select, InputLabelTag} from '@/components';
import {Props as SelectProps} from '@/components/atoms/Select';

interface Props<T> extends Omit<SelectProps<T>, 'error'> {
	reqiured?: boolean;
	label?: string;
	error?: FieldError;
}

function LabeledSelect<T>(
	{required = false, label = '', error, ...props}: Props<T>,
	ref: Ref<unknown>
) {
	return (
		<Stack
			flexDirection="column"
			mb="24px"
			{...(ref && {
				ref,
			})}>
			<InputLabelTag
				required={required}
				labelTitle={label}
				showRequiredChip={true}
			/>
			<Select error={error} {...props} />
		</Stack>
	);
}

export default forwardRef(LabeledSelect);
