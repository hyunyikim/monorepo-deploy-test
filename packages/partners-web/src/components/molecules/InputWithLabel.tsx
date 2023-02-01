import {Grid, InputProps} from '@mui/material';
import InputComponent from '../atoms/InputComponent';
import InputLabelTag from '../atoms/InputLabelTag';

import {FieldError, Control} from 'react-hook-form';
import ControlledInputComponent from './ControlledInputComponent';
interface Props extends Omit<InputProps, 'name' | 'error'> {
	name: string;
	labelTitle: string;
	isLast?: boolean;
	showRequiredChip?: boolean;
	control?: Control<any, any> | undefined;
	desc?: string;
	error?: FieldError;
	linkUrl?: string;
	linkTitle?: string;
}

function InputWithLabel({
	labelTitle,
	isLast = false,
	showRequiredChip = true,
	control,
	linkUrl,
	linkTitle,
	...props
}: Props) {
	return (
		<Grid container sx={{marginBottom: isLast ? 0 : '24px'}}>
			<InputLabelTag
				required={!!props.required}
				showRequiredChip={showRequiredChip}
				labelTitle={labelTitle}
				linkUrl={linkUrl}
				linkTitle={linkTitle}
			/>
			{control ? (
				<ControlledInputComponent control={control} {...props} />
			) : (
				<InputComponent {...props} />
			)}
		</Grid>
	);
}

export default InputWithLabel;
