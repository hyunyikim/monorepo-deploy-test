import {HttpStatus} from '@nestjs/common';

export class ResponseFormat {
	data: any | null;
	error: {
		name: string;
		code: number;
		message: string;
		description?: string;
		cause?: Error;
		extra?: Record<string, any>;
	} | null;
	statusCode: HttpStatus;
	timestamp: string;
	traceId: string;
}
