import {Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork.controller';
import {Cafe24InterworkService} from './cafe24Interwork.service';

@Module({
	imports: [],
	controllers: [Cafe24InterworkController],
	providers: [Cafe24InterworkService],
})
export class Cafe24InterworkModule {}
