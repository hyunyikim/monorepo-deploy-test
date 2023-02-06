import {
	Inject,
	NotFoundException,
	BadRequestException,
	ConflictException,
} from '@nestjs/common';
import {CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PlanRepository} from '../../domain/repository';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {TossPaymentsAPI} from '../../infrastructure/api-client';
import {
	RegisterBillingCommand,
	RegisterFreeBillingCommand,
	UnregisterBillingCommand,
	DeleteBillingCommand,
	RegisterCardCommand,
	DeleteCardCommand,
} from './register-billing.command';
import {BillingProps, PlanBillingFactory, PricePlan} from '../../domain';
import {PricePlanRepository} from '../../infrastructure/respository';
import {DateTime} from 'luxon';
import {createHmac} from 'crypto';
import {RegularPaymentService} from '../service/payment.service';
import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';

/**
 * 빌링 등록 및 구독신청 커맨드 핸들러
 */
@CommandHandler(RegisterBillingCommand)
export class RegisterBillingHandler
	implements ICommandHandler<RegisterBillingCommand, void>
{
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(RegularPaymentService)
		private readonly paymentService: RegularPaymentService,
		@Inject(TossPaymentsAPI)
		private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepo: PlanRepository
	) {}

	async execute(command: RegisterBillingCommand): Promise<void> {
		const {token, planId, cardInfo} = command;

		// 유저가 보유한 카드당 1개만 빌링 생성 가능하도록 고정 해시값 생성
		const hmac = createHmac('sha256', token.token);
		hmac.update([token.partnerIdx, cardInfo.cardNumber].join('_'));
		const customerKey = hmac.digest('base64');

		// customerKey 중복검사
		const saved = await this.billingRepo.findByCustomerKey(customerKey);
		if (saved) {
			throw new BadRequestException('ALREADY_REGISTERED_BILLING');
		}

		// 구독플랜 조회
		const pricePlan = await this.planRepo.findByPlanId(planId);
		if (!pricePlan || !pricePlan.activated) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		try {
			// 빌링키 발급
			const tossBilling =
				await this.paymentsApi.billing.authorizations.customerKey({
					customerKey,
					...cardInfo,
				});

			// 빌링 생성
			const newBilling = this.factory.create({
				...tossBilling,
				partnerIdx: token.partnerIdx,
				pricePlan,
			});

			// 구독 신청
			newBilling.register();

			// 결제 요청
			const approveCommand = new ApproveBillingPaymentCommand(
				token.partnerIdx,
				newBilling,
				pricePlan,
				this.paymentService.generatePaymentPayload(
					token.partnerIdx,
					customerKey,
					pricePlan
				)
			);
			await this.commandBus.execute(approveCommand);

			// 기존 플랜이 남아 있는 경우 취소처리 (무료플랜 등)
			const prevBilling = await this.billingRepo.findByPartnerIdx(
				token.partnerIdx
			);
			if (prevBilling) {
				prevBilling.delete();
				await this.billingRepo.saveBilling(prevBilling);
				prevBilling.commit();
			}

			// DB 저장
			await this.billingRepo.saveBilling(newBilling);

			newBilling.commit();
		} catch (e) {
			throw e;
		}
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
		private readonly billingRepo: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepo: PlanRepository
	) {}

	async execute(command: RegisterFreeBillingCommand): Promise<void> {
		const {partnerIdx, planMonth, planLimit} = command;

		// 이미 이용중인 유료 플랜이 있을 경우
		const billing = await this.billingRepo.findByPartnerIdx(partnerIdx);
		if (billing) {
			const billingProps = billing.properties();

			// TODO: 해당 케이스도 무료 플랜을 부여할 수 있는 방안을 고민해야할 듯
			if (
				billingProps.pricePlan?.planLevel > 0 &&
				!billingProps.deletedAt
			) {
				throw new ConflictException('ALREADY_USE_PAID_PLAN');
			}

			// 무료 플랜을 이용중인 경우 현재 플랜을 연장
		}

		// 무료플랜 조회
		const freePlan = await this.planRepo.findFreePlan();
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
			planExpireDate: `${DateTime.now()
				.plus({
					month: planMonth || 1,
				})
				.toISODate()}T23:59:59+09:00`,
		} as BillingProps;

		const newBilling = this.factory.create(billingProps);

		// DB 저장
		await this.billingRepo.saveBilling(newBilling);

		newBilling.commit();
	}
}

/**
 * 카드 등록 커맨드 핸들러
 */
@CommandHandler(RegisterCardCommand)
export class RegisterCardHandler
	implements ICommandHandler<RegisterCardCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI)
		private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepo: PlanRepository
	) {}

	async execute(command: RegisterCardCommand): Promise<void> {
		const {token, cardInfo} = command;

		// 유저가 보유한 카드당 1개만 빌링 생성 가능하도록 고정 해시값 생성
		const hmac = createHmac('sha256', token.token);
		hmac.update([token.partnerIdx, cardInfo.cardNumber].join('_'));
		const customerKey = hmac.digest('base64');

		// customerKey 중복검사
		const saved = await this.billingRepo.findByCustomerKey(customerKey);
		if (saved) {
			throw new BadRequestException('ALREADY_REGISTERED_BILLING');
		}

		// 기존 플랜이 남아 있는 경우 가져오기
		const prevBilling = await this.billingRepo.findByPartnerIdx(
			token.partnerIdx
		);

		const prevBillingProps = !prevBilling?.isDeleted
			? prevBilling?.properties()
			: undefined;

		// 빌링키 발급
		const tossBilling =
			await this.paymentsApi.billing.authorizations.customerKey({
				customerKey,
				...cardInfo,
			});

		// 빌링 생성 (기존 구독 정보는 유지)
		const newBillingProps = {
			...tossBilling,
			...(prevBillingProps && {
				orderId: prevBillingProps.orderId,
				lastPaymentAt: prevBillingProps.lastPaymentAt,
				lastPaymentKey: prevBillingProps.lastPaymentKey,
				planExpireDate: prevBillingProps.planExpireDate,
				nextPaymentDate: prevBillingProps.nextPaymentDate,
				nextPricePlan: prevBillingProps.nextPricePlan,
				pausedAt: prevBillingProps.pausedAt,
			}),
			partnerIdx: token.partnerIdx,
			pricePlan: prevBillingProps?.pricePlan || new PricePlan(),
		};

		const newBilling = this.factory.create(newBillingProps);

		// 카드 등록
		newBilling.registerCard();

		// DB 저장
		await this.billingRepo.saveBilling(newBilling);

		newBilling.commit();

		// 기존 빌링 삭제처리
		if (prevBilling) {
			prevBilling.delete();
			await this.billingRepo.saveBilling(prevBilling);
			prevBilling.commit();
		}
	}
}

/**
 * 카드 삭제 커맨드 핸들러
 */
@CommandHandler(DeleteCardCommand)
export class DeleteCardHandler
	implements ICommandHandler<DeleteCardCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory
	) {}

	async execute(command: DeleteCardCommand): Promise<void> {
		const {token} = command;

		// 빌링 조회
		const prevBilling = await this.billingRepo.findByPartnerIdx(
			token.partnerIdx
		);
		if (!prevBilling) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		const prevBillingProps = prevBilling.properties();
		if (!prevBillingProps.card) {
			throw new NotFoundException('NOT_FOUND_CARD');
		}

		// 키 생성
		const billingKey = [
			'FREE_BILLING_KEY',
			token.partnerIdx.toString(),
			DateTime.now().valueOf(),
		].join('_');

		// 빌링 생성 (기존 구독 정보는 유지)
		const newBillingProps = {
			billingKey,
			partnerIdx: token.partnerIdx,
			pricePlan: prevBillingProps.pricePlan,
			authenticatedAt: DateTime.now().toISO(),
			orderId: prevBillingProps.orderId,
			lastPaymentAt: prevBillingProps.lastPaymentAt,
			lastPaymentKey: prevBillingProps.lastPaymentKey,
			planExpireDate: prevBillingProps.planExpireDate,
			nextPaymentDate: prevBillingProps.nextPaymentDate,
			nextPricePlan: prevBillingProps.nextPricePlan,
			pausedAt: prevBillingProps.pausedAt,
		} as BillingProps;

		const newBilling = this.factory.create(newBillingProps);

		newBilling.deleteCard();

		// DB 저장
		await this.billingRepo.saveBilling(newBilling);

		newBilling.commit();

		// 기존 빌링 삭제처리
		if (prevBilling) {
			prevBilling.delete();
			await this.billingRepo.saveBilling(prevBilling);
			prevBilling.commit();
		}
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
		private readonly billingRepo: BillingRepository,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(command: UnregisterBillingCommand): Promise<void> {
		const {customerKey, partnerIdx} = command;

		// 빌링 조회
		const billing = await this.billingRepo.findByCustomerKey(customerKey);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		const billingProps = billing.properties();
		if (!billingProps.nextPricePlan && !billingProps.nextPaymentDate) {
			throw new BadRequestException('ALREADY_PLAN_CANCELED');
		}

		// 구독 취소
		billing.unregister();

		// DB 저장
		await this.billingRepo.saveBilling(billing);

		// 이메일 발송
		await this.vircleCoreApi.sendPaymentEmail({
			partnerIdx,
			template: 'CANCEL_PAYMENT',
			params: {
				planName: billingProps.pricePlan.planName,
			},
		});

		billing.commit();
	}
}

/**
 * 구독 삭제 커맨드 핸들러
 */
@CommandHandler(DeleteBillingCommand)
export class DeleteBillingHandler
	implements ICommandHandler<DeleteBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async execute(command: DeleteBillingCommand): Promise<void> {
		const {partnerIdx} = command;

		// 빌링 조회
		const billing = await this.billingRepo.findByPartnerIdx(partnerIdx);
		if (billing) {
			// 구독 삭제
			billing.delete();

			// DB 저장
			await this.billingRepo.saveBilling(billing);

			billing.commit();
		}
	}
}
