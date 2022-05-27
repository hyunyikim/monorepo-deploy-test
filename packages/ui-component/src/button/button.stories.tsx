import {css} from '@emotion/react';
import {Story, Meta} from '@storybook/react';
import {Button, ButtonProps} from './button';

export default {
	title: 'Components/Button',
	component: Button,
	decorators: [
		(Str) => (
			<div
				css={css`
					padding: 20px;
					button + button {
						margin-left: 10px;
					}
				`}>
				<Str />
			</div>
		),
	],
} as Meta;

export const Basic: Story<ButtonProps> = (args) => <Button {...args} />;
Basic.args = {
	text: '버튼',
	color: 'error',
};

export const Variant = () => (
	<>
		<Button text="꽉찬" />
		<Button variant="outlined" text="테두리" />
		<Button variant="text" text="글씨만" />
		<Button variant="outlined" disabled text="비활성 outline" />
		<Button variant="contained" disabled text="비활성 contain" />
	</>
);

export const Colors = () => (
	<>
		<Button variant="contained" color="primary" text="우선" />
		<Button variant="outlined" color="error" text="우선" />
		<Button variant="text" color="dark" text="우선" />
	</>
);
