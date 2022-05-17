import {
	FontWeight,
	LineHeight,
	LetterSpacing,
	FontFamily,
	FontSize,
	fontFamily,
	lineHeight,
	letterSpacing,
	fontSize,
	fontWeight,
} from './typography';

import {Radius, radius} from './radius';
import {
	Color,
	ColorGrade,
	Gradient,
	SimpleColorGrade,
	gradient,
	gray,
	green,
	red,
	blue,
	black,
	blackAlpha,
	white,
	whiteAlpha,
} from './palette';
import {Blur, blur} from './blur';
import {ZIndex, zIndex} from './z-index';
import {Shadow, shadow} from './shadows';
import {ContainerSize, containerSize} from './size';

export interface Theme {
	typo: {
		fontWeight: FontWeight;
		fontFamily: FontFamily;
		lineHeight: LineHeight;
		letterSpacing: LetterSpacing;
		fontSize: FontSize;
	};
	radius: Radius;
	color: {
		black: Color;
		blackAlpha: ColorGrade;
		white: Color;
		whiteAlpha: ColorGrade;
		gradient: Gradient;
		gray: ColorGrade;
		red: SimpleColorGrade;
		blue: SimpleColorGrade;
		green: SimpleColorGrade;
	};
	blur: Blur;
	zIndex: ZIndex;
	shadow: Shadow;
	containerSize: ContainerSize;
}

export const defaultTheme: Theme = {
	typo: {
		fontWeight,
		fontFamily,
		lineHeight,
		letterSpacing,
		fontSize,
	},
	radius,
	color: {
		black,
		blackAlpha,
		white,
		whiteAlpha,
		gradient,
		gray,
		red,
		blue,
		green,
	},
	blur,
	zIndex,
	shadow,
	containerSize,
};
