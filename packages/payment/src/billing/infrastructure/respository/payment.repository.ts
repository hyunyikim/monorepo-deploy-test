import {Inject, Injectable} from '@nestjs/common';
import {PlanPaymentFactory} from 'src/billing/domain/factory';
import {PaymentRepository} from 'src/billing/domain/repository';
import {Payment} from 'src/billing/domain/payment';
import {DynamoDB} from 'aws-sdk';
import {PaymentProps} from 'src/billing/domain/payment';
import {InjectionToken} from 'src/injection.token';

type PaymentEntity = PaymentProps;

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

	async savePayment(payment: Payment): Promise<void> {
		const entity = this.modelToEntity(payment);
		await this.put({
			TableName: this.tableName,
			Item: entity,
			ReturnValues: 'ALL_OLD',
		}).promise();
	}

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
	async findByOrderId(id: string): Promise<Payment | null> {
		return await Promise.resolve<null>(null);
	}

	private entityToModel(entity: PaymentEntity) {
		return this.factory.create({...entity});
	}

	private modelToEntity(model: Payment) {
		const props = model.properties();
		return props;
	}
}
