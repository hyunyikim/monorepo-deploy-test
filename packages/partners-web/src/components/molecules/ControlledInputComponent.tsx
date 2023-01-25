import {InputProps} from '@mui/material';
import {Controller, FieldValues, FieldError, Control} from 'react-hook-form';

import InputComponent from '../atoms/InputComponent';

type Height = '60px' | '48px' | '40px' | '32px' | 'auto';
interface Props extends Omit<InputProps, 'error'> {
	name: string;
	control: Control<FieldValues, any>;
	height?: Height;
	maxHeight?: Height;
	desc?: string;
	error?: FieldError;
}

function ControlledInputComponent({
	name,
	control,
	defaultValue = '',
	height = '48px',
	maxHeight = 'auto',
	onChange,
	error,
	...props
}: Props) {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({
				field: {onChange: hookFormOnChange, onBlur, value, ref},
			}) => (
				<InputComponent
					height={height}
					maxHeight={maxHeight}
					value={value}
					error={error}
					onChange={(e) => {
						onChange && onChange(e); // 직접 넘겨받은 onChange 함수
						hookFormOnChange(e);
					}}
					onBlur={onBlur}
					inputRef={ref}
					{...props}
				/>
			)}
		/>
	);
}

export default ControlledInputComponent;
