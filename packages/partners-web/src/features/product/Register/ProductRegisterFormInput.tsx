import {SetStateAction, Dispatch} from 'react';
import {
	Controller,
	UseFormSetValue,
	FieldErrors,
	Control,
	FieldError,
} from 'react-hook-form';

import {ProductRegisterFormData, InputType, InputTypeList} from '@/@types';
import {handleChangeDataFormat} from '@/utils';

import {InputLabelTag, InputWithLabel, LabeledSelect} from '@/components';
import {productCategoryOptions} from '@/data';
import {ImageState, Options} from '@/@types';

import ProductRegisterFormImage from '@/features/product/Register/ProductRegisterFormImage';

interface Props {
	inputList: InputTypeList;
	images: ImageState[];
	setImages: Dispatch<SetStateAction<ImageState[]>>;
	control:
		| Control<ProductRegisterFormData, any>
		| Control<Partial<ProductRegisterFormData>, any>;
	setValue:
		| UseFormSetValue<ProductRegisterFormData>
		| UseFormSetValue<Partial<ProductRegisterFormData>>;
	errors: Partial<FieldErrors<ProductRegisterFormData>>;
}

function ProductRegisterFormInput({
	inputList,
	images,
	setImages,
	control,
	setValue,
	errors,
}: Props) {
	return (
		<>
			{inputList &&
				inputList?.length > 0 &&
				inputList.map((input: InputType) => {
					const {name, type, ...restInput} = input;
					if (type === 'text') {
						return (
							<InputWithLabel
								key={name}
								name={name}
								control={control}
								labelTitle={input.label}
								placeholder={input.placeholder}
								inputType={input.type}
								required={input?.required || false}
								error={
									errors[
										name as keyof ProductRegisterFormData
									] as FieldError
								}
								{...restInput}
								onChange={(e) => {
									if (name === 'price') {
										let value = e?.target?.value
											? String(e?.target?.value)
											: null;
										if (value) {
											const pureNumber = value.replace(
												/\,/g,
												''
											);
											if (isNaN(Number(pureNumber))) {
												value = value.slice(0, -1);
												e.target.value = value;
											}
											const formattedValue =
												handleChangeDataFormat(
													'commaNum',
													e
												);
											e.target.value = formattedValue;
										}
									}
								}}
							/>
						);
					}
					// TODO: controlled vs uncontrolled component warning
					if (type === 'select') {
						return (
							<Controller
								key={name}
								name={name as keyof ProductRegisterFormData}
								control={
									control as Control<
										Partial<ProductRegisterFormData>
									>
								}
								render={({field}) => {
									const {onChange, ...restField} = field;
									return (
										<LabeledSelect
											key={name}
											{...input}
											{...restField}
											options={
												input.options as Options<any>
											}
											error={
												errors[
													name as keyof ProductRegisterFormData
												] as FieldError
											}
											onChange={(e) => {
												const value = e.target.value;
												if (name === 'categoryCode') {
													const label =
														productCategoryOptions.find(
															(item) =>
																item.value ===
																value
														)?.label || '';
													setValue(
														'categoryName',
														label
													);
												}
												if (name === 'brandIdx') {
													const selectedValue =
														e.target.value;
													const options =
														input.options as Options<number>;
													const label =
														options.find(
															(item) =>
																item.value ===
																selectedValue
														)?.label || '';
													const labels =
														label.split('/');
													if (labels?.length > 1) {
														setValue(
															'brandName',
															labels[0]
														);
														setValue(
															'brandNameEn',
															labels[1]
														);
														onChange(e);
														return;
													}
													setValue(
														'brandName',
														label
													);
													setValue(
														'brandNameEn',
														label
													);
												}
												onChange(e);
											}}
										/>
									);
								}}
							/>
						);
					}
				})}
			<InputLabelTag labelTitle="상품 이미지" />
			<ProductRegisterFormImage images={images} setImages={setImages} />
		</>
	);
}

export default ProductRegisterFormInput;
