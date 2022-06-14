import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Admin, YN} from '@vircle/entity';
import {Repository} from 'typeorm';
import {FindAdminListDto} from './dto/find-admin.dto';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Admin)
		private adminRepo: Repository<Admin>
	) {}

	async create(dto: CreateAdminDto) {
		const newAdmin = plainToInstance(Admin, dto);
		return await this.adminRepo.save(newAdmin);
	}

	async findList(dto: FindAdminListDto) {
		const [skip, take] = dto.range;
		const [orderBy, direction] = dto.sort;
		const filter = dto.filter;

		return await this.adminRepo.findAndCount({
			skip,
			take,
			where: filter,
			order: {[orderBy]: direction},
		});
	}

	async findOne(idx: number) {
		const targetAdmin = await this.adminRepo.findOneBy({idx});
		if (!targetAdmin) throw new NotFoundException();
		return targetAdmin;
	}

	async update(idx: number, updateAdminDto: UpdateAdminDto) {
		const admin = await this.findOne(idx);
		const updated = plainToInstance(Admin, {...admin, ...updateAdminDto});
		return this.adminRepo.save(updated);
	}

	async remove(idx: number) {
		const admin = await this.findOne(idx);
		await this.adminRepo.remove([admin]);
	}

	async softRemove(idx: number) {
		const admin = await this.findOne(idx);
		admin.used = YN.NO;
		await this.adminRepo.save(admin);
	}
}
