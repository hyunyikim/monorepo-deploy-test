import {Module} from '@nestjs/common';
import {AdminService} from './admin.service';
import {AdminController} from './admin.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Admin} from '@vircle/entity';
import {ConfigModule} from '@nestjs/config';
import dbConfig from '../config/database.config';
@Module({
	imports: [
		ConfigModule.forFeature(dbConfig),
		TypeOrmModule.forFeature([Admin]),
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
