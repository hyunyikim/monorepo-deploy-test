import {Area} from 'react-easy-crop';

export const CARD_SIZE = {
	width: 329,
	height: 512,
};

export const CROP_AREA_ASPECT = CARD_SIZE.width / CARD_SIZE.height;

export const INITIAL_CROP_CONFIG = {
	crop: {
		x: 0,
		y: 0,
	},
	zoom: 1,
	croppedArea: null,
	croppedAreaPixels: null,
};

const createImage = (url: string) => {
	return new Promise((resolve, reject) => {
		const image: HTMLImageElement = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
		image.src = url;
	});
};

// width 208, borderRadius 16px 기준 ratio
const roundRatio = 0.076;

// canvas round rect로 잘라줌
function roundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number
) {
	const roundPixel = roundRatio * width;
	const radius = {
		tl: roundPixel,
		tr: roundPixel,
		br: roundPixel,
		bl: roundPixel,
	};
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(
		x + width,
		y + height,
		x + width - radius.br,
		y + height
	);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImgBlob(
	imageSrc: string,
	pixelCrop?: Area,
	rotation = 0,
	flip = {horizontal: false, vertical: false}
) {
	try {
		const image = (await createImage(imageSrc)) as HTMLImageElement;
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			return null;
		}

		// set canvas size to match the bounding box
		const width = image.width;
		const height = image.height;
		canvas.width = width;
		canvas.height = height;

		// translate canvas context to a central location to allow rotating and flipping around the center
		ctx.translate(width / 2, height / 2);
		ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
		ctx.translate(-image.width / 2, -image.height / 2);

		// draw rotated image
		ctx.drawImage(image, 0, 0);

		// croppedAreaPixels values are bounding box relative
		// extract the cropped image using these values
		const data = ctx.getImageData(
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height
		);

		// set canvas width to final desired crop size - this will clear existing context
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		// paste generated rotate image at the top left corner
		ctx.putImageData(data, 0, 0);

		// 새로운 canvas를 crop 결과물의 크기로 생성하고,
		// 기존 canvas를 그대로 새로운 canvas에 그린다.
		const croppedCanvas: HTMLCanvasElement =
			document.createElement('canvas');
		const croppedCtx = croppedCanvas.getContext('2d');
		croppedCanvas.width = pixelCrop.width;
		croppedCanvas.height = pixelCrop.height;

		roundRect(croppedCtx, 0, 0, pixelCrop.width, pixelCrop.height, 16);
		croppedCtx.clip();
		croppedCtx.drawImage(canvas, 0, 0);

		// As a blob
		return new Promise((resolve, reject) => {
			croppedCanvas.toBlob(
				(file) => {
					if (!file) return;
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onloadend = function () {
						const base64String = reader.result;
						resolve({file, base64String});
					};
				},
				'image/png',
				0.95
			);
		});
	} catch (e) {
		console.log('e :>> ', e);
	}
}
