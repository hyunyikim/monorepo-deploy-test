import {Module} from '@nestjs/common';
import {GatewayCafe24Controller} from './gateway-cafe24.controller';
import {GatewayCafe24Service} from './gateway-cafe24.service';

@Module({
	imports: [],
	controllers: [GatewayCafe24Controller],
	providers: [GatewayCafe24Service],
})
export class GatewayCafe24Module {}
