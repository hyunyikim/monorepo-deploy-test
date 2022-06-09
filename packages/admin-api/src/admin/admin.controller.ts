import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import {AdminService} from './admin.service';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {FindAdminDto, FindAdminListDto} from './dto/find-admin.dto';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post()
	create(@Body() createAdminDto: CreateAdminDto) {
		return this.adminService.create(createAdminDto);
	}

	@Get()
	findList(@Query() dto: FindAdminListDto) {
		return this.adminService.findList(dto);
	}

	@Get(':idx')
	findOne(@Param('idx') idx: number) {
		return this.adminService.findOne(idx);
	}

	@Patch(':idx')
	update(@Param('idx') idx: number, @Body() updateAdminDto: UpdateAdminDto) {
		return this.adminService.update(idx, updateAdminDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.adminService.remove(+id);
	}
}
