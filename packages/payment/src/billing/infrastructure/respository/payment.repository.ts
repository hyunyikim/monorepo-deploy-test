import {Inject, Injectable} from '@nestjs/common';
import {PlanPaymentFactory, Payment, PaymentProps} from '../../domain';
import {PaymentRepository} from '../../domain/repository';
import {DynamoDB} from 'aws-sdk';
import {InjectionToken} from '../../../injection.token';
import {PAYMENT_STATUS} from '../api-client';

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
	 * @param status
	 * @param sort
	 * @param page
	 * @param pageSize
	 */
	async search(
		partnerIdx: number,
		status: PAYMENT_STATUS,
		sort: 'ASC' | 'DESC',
		page: number,
		pageSize: number
	): Promise<{
		total: number;
		data: Payment[];
	}> {
		let items: DynamoDB.DocumentClient.ItemList = [];
		let exclusiveStartKey: DynamoDB.Key | undefined;

		const params: DynamoDB.DocumentClient.QueryInput = {
			TableName: this.tableName,
			IndexName: 'partnerIdx-status-index',
			KeyConditionExpression: 'partnerIdx = :key',
			ExpressionAttributeValues: {
				':key': partnerIdx,
			},
		};

		if (status) {
			params.KeyConditionExpression += ' and #status = :status';
			params.ExpressionAttributeNames = {
				'#status': 'status',
			};
			params.ExpressionAttributeValues = {
				...params.ExpressionAttributeValues,
				':status': status,
			};
		}

		const {Count} = await this.query(params).promise();

		// 페이지 수 만큼 이동하며 조회
		for (let i = 0; i < page; i++) {
			params.Limit = pageSize;

			if (exclusiveStartKey) {
				params.ExclusiveStartKey = exclusiveStartKey;
			}
			const {Items, LastEvaluatedKey, ScannedCount} = await this.query(
				params
			).promise();

			exclusiveStartKey = LastEvaluatedKey;

			// 해당 페이지에 도달했지만 데이터가 없을 경우
			if (i < page - 1 && (!LastEvaluatedKey || !ScannedCount)) break;

			if (i === page - 1 && Items) {
				items = Items;
			}
		}

		return {
			total: Number(Count || 0),
			data:
				items?.length > 0
					? (items as PaymentEntity[]).map((entity) =>
							this.factory.create(entity)
					  )
					: [],
		};
	}

	private entityToModel(entity: PaymentEntity) {
		return this.factory.create({...entity});
	}

	private modelToEntity(model: Payment) {
		const props = model.properties();
		return props;
	}
}
