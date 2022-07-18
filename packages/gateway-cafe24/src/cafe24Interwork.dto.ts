import {} from 'class-transformer';
import {IsString} from 'class-validator';

export class CreateNewInterwork {
	@IsString()
	authCode: string;

	@IsString()
	mallId: string;
}

export class UpdateInterwork {}
