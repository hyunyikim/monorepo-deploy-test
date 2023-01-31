import {
	Inject,
	NotFoundException,
	BadRequestException,
	ConflictException,
} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PlanRepository} from '../../domain/repository';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {TossPaymentsAPI} from '../../infrastructure/api-client';
import {
	RegisterBillingCommand,
	RegisterFreeBillingCommand,
	UnregisterBillingCommand,
} from './register-billing.command';
import {BillingProps, PlanBillingFactory} from '../../domain';
import {PricePlanRepository} from '../../infrastructure/respository';
import {DateTime} from 'luxon';
import {createHmac} from 'crypto';

/**
 * 빌링 등록 및 구독신청 커맨드 핸들러
 */
@CommandHandler(RegisterBillingCommand)
export class RegisterBillingHandler
	implements ICommandHandler<RegisterBillingCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepository: PlanRepository
	) {}

	async execute(command: RegisterBillingCommand): Promise<void> {
		const {partnerIdx, planId, customerKey, cardInfo} = command;

		// customerKey 중복검사
		const saved = await this.billingRepository.findByCustomerKey(
			customerKey
		);
		if (saved && saved.isRegistered) {
			throw new BadRequestException('ALREADY_REGISTERED_BILLING');
		}

		// 구독플랜 조회
		const pricePlan = await this.planRepository.findByPlanId(planId);
		if (!pricePlan || !pricePlan.activated) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		// 빌링키 발급
		const tossBilling =
			await this.paymentsApi.billing.authorizations.customerKey({
				customerKey,
				...cardInfo,
			});

		// 빌링 생성
		const registered = this.factory.create({
			...tossBilling,
			partnerIdx,
			pricePlan,
		});

		// 구독 신청
		registered.register();

		// DB 저장
		await this.billingRepository.saveBilling(registered);

		registered.commit();
	}
}

/**
 * 무료플랜 신청 커맨드 핸들러
 */
@CommandHandler(RegisterFreeBillingCommand)
export class RegisterFreeBillingHandler
	implements ICommandHandler<RegisterFreeBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepository: PlanRepository
	) {}

	async execute(command: RegisterFreeBillingCommand): Promise<void> {
		const {partnerIdx, planMonth, planLimit} = command;

		// 이미 이용중인 유료 플랜이 있을 경우
		const billing = await this.billingRepository.findByPartnerIdx(
			partnerIdx
		);
		if (billing) {
			const billingProps = billing.properties();

			// TODO: 해당 케이스도 무료 플랜을 부여할 수 있는 방안을 고민해야할 듯
			if (
				billingProps.pricePlan?.planLevel > 0 &&
				!billingProps.unregisteredAt
			) {
				throw new ConflictException('ALREADY_USE_PAID_PLAN');
			}

			// 무료 플랜을 이용중인 경우 현재 플랜을 연장
		}

		// 무료플랜 조회
		const freePlan = await this.planRepository.findFreePlan();
		if (!freePlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		if (planLimit) {
			freePlan.planLimit = planLimit;
		}

		// 키 생성
		const billingKey = [
			'FREE_BILLING_KEY',
			partnerIdx.toString(),
			DateTime.now().valueOf(),
		].join('_');

		// 빌링 생성
		const billingProps = {
			billingKey,
			partnerIdx,
			pricePlan: freePlan,
			authenticatedAt: DateTime.now().toISO(),
			planExpireDate: DateTime.now()
				.plus({month: planMonth || 1})
				.toISO(),
		} as BillingProps;

		const registered = this.factory.create(billingProps);

		// DB 저장
		await this.billingRepository.saveBilling(registered);

		registered.commit();
	}
}

/**
 * 구독 취소 커맨드 핸들러
 */
@CommandHandler(UnregisterBillingCommand)
export class UnregisterBillingHandler
	implements ICommandHandler<UnregisterBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository
	) {}

	async execute(command: UnregisterBillingCommand): Promise<void> {
		const {customerKey} = command;

		// 빌링 조회
		const billing = await this.billingRepository.findByCustomerKey(
			customerKey
		);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		// 구독 취소
		billing.unregister();

		// DB 저장
		await this.billingRepository.saveBilling(billing);

		billing.commit();
	}
}
