import {dbMappingTest} from './mappingTestTemplate';
import {
	Inspection,
	InspectionComment,
	InspectionHistory,
	InspectionImage,
} from '../src';

dbMappingTest(Inspection);
dbMappingTest(InspectionHistory);
dbMappingTest(InspectionComment);
dbMappingTest(InspectionImage);
