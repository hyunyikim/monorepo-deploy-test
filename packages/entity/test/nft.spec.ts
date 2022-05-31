/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import TestSource, {ColumnInfo, InfoMap} from './connection';
import {Nft} from '../src';

describe('Client Entity Test ', () => {
	let testSource: TestSource;
	beforeAll(async () => {
		testSource = new TestSource();
		await testSource.init();
	});

	it('Entity DB Hitting Test', async () => {
		const adminRepo = testSource.src.getRepository(Nft);

		const {tableName, columns} = adminRepo.metadata;

		const infos: ColumnInfo[] = await testSource.src.query(
			`DESCRIBE ${tableName}`
		);

		const entityMap = columns.reduce(
			(acc, {databaseName, type, isNullable, enum: enumType}) => {
				acc[databaseName] = {
					type: typeof type === 'function' ? 'enum' : type,
					null: isNullable ? 'NO' : 'YES',
				};
				return acc;
			},
			{} as InfoMap
		);

		const missingColumn: string[] = [];
		infos.forEach(({Field, Null, Type}) => {
			const field = entityMap[Field];
			if (!field) {
				missingColumn.push(Field);
			}

			// expect(Type).toContain(field.type);
			// expect(Null).toBe(field.null);
		});
		if (missingColumn.length) {
			console.log('Entity에 반연되지 않은 컬럼이 있음', missingColumn);
		}
		expect(missingColumn).toHaveLength(0);
	});

	afterAll(() => {
		testSource.destroy();
	});
});
