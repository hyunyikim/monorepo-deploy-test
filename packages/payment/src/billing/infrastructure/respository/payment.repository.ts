import {Inject, Injectable} from '@nestjs/common';
import {PlanPaymentFactory, Payment, PaymentProps} from '../../domain';
import {PaymentRepository} from '../../domain/repository';
import {DynamoDB} from 'aws-sdk';
import {InjectionToken} from '../../../injection.token';
import {DateTime} from 'luxon';

type PaymentEntity = PaymentProps;

/**
 * 결제내역 데이터 저장소
 */
@Injectable()
export class PlanPaymentRepository
	extends DynamoDB.DocumentClient
	implements PaymentRepository
{
	constructor(
		@Inject(PlanPaymentFactory)
		private readonly factory: PlanPaymentFactory,
		@Inject(InjectionToken.PAYMENT_TABLE_NAME)
		private readonly tableName: string,
		@Inject(InjectionToken.AWS_REGION)
		private readonly region: string
	) {
		super({region});
	}

	/**
	 * 결제내역 저장
	 * @param payment
	 */
	async savePayment(payment: Payment): Promise<void> {
		const entity = this.modelToEntity(payment);
		try {
			await this.put({
				TableName: this.tableName,
				Item: entity,
				ReturnValues: 'ALL_OLD',
			}).promise();
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	/**
	 * 결제내역 조회
	 * @param paymentKey
	 */
	async findByKey(paymentKey: string): Promise<Payment | null> {
		const {Item} = await this.get({
			TableName: this.tableName,
			Key: {
				paymentKey,
			},
		}).promise();
		if (!Item) return null;

		const entity = Item as PaymentEntity;

		return this.entityToModel(entity);
	}

	/**
	 * 결제내역 목록 조회
	 * @param keys
	 */
	async findByKeys(keys: string[]): Promise<Payment[]> {
		const dbkeys = keys.map((key) => ({paymentKey: {N: key}}));

		const data = await this.batchGet({
			RequestItems: {
				[this.tableName]: {
					Keys: dbkeys,
				},
			},
		}).promise();

		if (!data.Responses) return [];
		return data.Responses[this.tableName].map((item) => {
			const entity = item as PaymentEntity;
			return this.factory.create(entity);
		});
	}

	/**
	 * 주문번호로 결제내역 조회
	 * @param orderId
	 */
	async findByOrderId(orderId: string): Promise<Payment | null> {
		const {Items} = await this.query({
			TableName: this.tableName,
			IndexName: 'orderId-index',
			KeyConditionExpression: 'orderId = :orderId',
			ExpressionAttributeValues: {
				':orderId': orderId,
			},
		}).promise();

		if (!Items || Items.length === 0) return null;
		const entities = Items as PaymentEntity[];

		return this.factory.create(entities[0]);
	}

	/**
	 * 결제내역 검색
	 * @param partnerIdx
	 * @param sort
	 * @param page
	 * @param pageSize
	 * @param range
	 */
	async search(
		partnerIdx: number,
		sort: 'ASC' | 'DESC',
		page: number,
		pageSize: number,
		range?: {startAt: Date; endAt: Date}
	) {
		let items: DynamoDB.DocumentClient.ItemList = [];
		let exclusiveStartKey: DynamoDB.Key | undefined;

		for (let i = 0; i < page; i++) {
			const params: DynamoDB.DocumentClient.QueryInput = {
				TableName: this.tableName,
				IndexName: 'partnerIdx-approvedAt-index',
				KeyConditionExpression: 'partnerIdx = :key',
				Limit: pageSize,
				ExpressionAttributeValues: {
					':key': partnerIdx,
				},
				ScanIndexForward: sort === 'ASC',
			};

			if (range) {
				const {startAt, endAt} = range;
				params.KeyConditionExpression +=
					' and approvedAt between :startAt and :endAt';
				params.ExpressionAttributeValues = {
					...params.ExpressionAttributeValues,
					':startAt': DateTime.fromJSDate(startAt).toISO(),
					':endAt': DateTime.fromJSDate(endAt).toISO(),
				};
			}

			if (exclusiveStartKey) {
				params.ExclusiveStartKey = exclusiveStartKey;
			}

			const {Items, LastEvaluatedKey, ScannedCount} = await this.query(
				params
			).promise();

			exclusiveStartKey = LastEvaluatedKey;

			if (!LastEvaluatedKey || !ScannedCount) break;

			if (i === page - 1 && Items) {
				items = Items;
			}
		}

		if (!items || items.length === 0) return [];
		const entities = items as PaymentEntity[];

		return entities.map((entity) => this.factory.create(entity));
	}

	private entityToModel(entity: PaymentEntity) {
		return this.factory.create({...entity});
	}

	private modelToEntity(model: Payment) {
		const props = model.properties();
		return props;
	}
}
