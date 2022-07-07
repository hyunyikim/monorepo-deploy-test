import {dbMappingTest} from './mappingTestTemplate';
import {CreditHistory, CreditOrder, CreditPlan} from '../src/credit.entity';

dbMappingTest(CreditPlan);
dbMappingTest(CreditOrder);
dbMappingTest(CreditHistory);
