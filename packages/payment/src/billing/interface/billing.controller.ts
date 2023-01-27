import {
	Body,
	Query,
	Controller,
	Delete,
	Get,
	Post,
	Patch,
	UseGuards,
	UnauthorizedException,
	Param,
	UseFilters,
} from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {
	FindBillingDTO,
	RegisterBillingBodyDTO,
	UnregisterBillingDTO,
	ChangeBillingPlanBodyDTO,
} from './dto';
import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
	ChangeBillingPlanCommand,
} from '../application/command';
import {
	FindBillingByPartnerIdxQuery,
	FindPaymentsQuery,
	FindPlanQuery,
	FindPaymentByOrderIdQuery,
} from '../application/query';
import {BillingProps, PaymentProps, PricePlanProps} from '../domain';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {GetToken, TokenInfo} from './getToken.decorator';
import {createHmac} from 'crypto';
import {DateTime} from 'luxon';
import {FindPaymentsQueryDto} from './dto/find-payments.query.dto';
import {HttpExceptionFilter} from './httpException.filter';

class BillingInterface {
	readonly customerKey: string;
	readonly pricePlan: PricePlanProps;
	readonly card: {
		cardType: string;
		ownerType: string;
		number: string;
		company: string;
		companyCode: string;
	};
	readonly authenticatedAt: string;

	constructor(billing: BillingProps) {
		this.customerKey = billing.customerKey;
		this.pricePlan = billing.pricePlan;
		this.card = {
			...billing.card,
			companyCode: billing.card.issuerCode,
		};
		this.authenticatedAt = DateTime.fromISO(
			billing.authenticatedAt
		).toFormat('yyyy-MM-dd HH:mm:ss');
	}
}

class PaymentSummaryInterface {
	readonly displayOrderId: string;
	readonly orderId: string;
	readonly planName: string;
	readonly startDate: string;
	readonly expireDate: string;

	constructor(payment: PaymentProps) {
		const tempOrderId = payment.orderId.split('_');
		this.displayOrderId = tempOrderId[tempOrderId.length - 1];
		this.orderId = payment.orderId;
		this.planName = payment.pricePlan.planName;
		this.startDate = DateTime.fromISO(payment.approvedAt).toFormat(
			'yyyy-MM-dd'
		);
		this.expireDate = payment.expiredAt
			? DateTime.fromISO(payment.expiredAt).toFormat('yyyy-MM-dd')
			: DateTime.fromISO(payment.approvedAt)
					.plus({
						year: payment.pricePlan.planType === 'YEAR' ? 1 : 0,
						month: payment.pricePlan.planType === 'YEAR' ? 0 : 1,
					})
					.toFormat('yyyy-MM-dd');
	}
}

class PaymentDetailInterface extends PaymentSummaryInterface {
	readonly pricePlan: PricePlanProps;
	readonly payApprovedAt: string;
	readonly canceledPricePlan?: PricePlanProps;

	constructor(payment: PaymentProps) {
		super(payment);

		this.pricePlan = payment.pricePlan;
		this.canceledPricePlan = undefined; //payment.canceledPricePlan;
		this.payApprovedAt = DateTime.fromISO(payment.approvedAt).toFormat(
			'yyyy-MM-dd HH:mm:ss'
		);
	}
}

/**
 * 정기결제 API 컨트롤러
 */
@Controller({version: '1', path: 'billing'})
@UseFilters(HttpExceptionFilter)
export class BillingController {
	constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

	/**
	 * 구독 플랜 목록 조회 API
	 * @param planType
	 */
	@Get('/plans')
	async getPlans(@Query('planType') planType?: 'YEAR' | 'MONTH') {
		const query = new FindPlanQuery(planType);
		return await this.queryBus.execute<FindPlanQuery, PricePlanProps[]>(
			query
		);
	}

	/**
	 * 빌링등록 및 구독신청 API
	 *
	 * @param planId
	 * @param cardNumber
	 * @param cardExpirationYear
	 * @param cardExpirationMonth
	 * @param cardPassword
	 * @param customerIdentityNumber
	 * @param customerEmail
	 * @param token
	 */
	@Post('/')
	@UseGuards(JwtAuthGuard)
	async registerBilling(
		@Body()
		{
			planId,
			cardNumber,
			cardExpirationYear,
			cardExpirationMonth,
			cardPassword,
			customerIdentityNumber,
			customerEmail,
		}: RegisterBillingBodyDTO,
		@GetToken() token: TokenInfo
	) {
		// 유저가 보유한 카드당 1개만 빌링 생성 가능하도록 고정 해시값 생성
		const hmac = createHmac('sha256', token.token);
		hmac.update([token.partnerIdx, cardNumber].join('_'));
		const customerKey = hmac.digest('base64');

		// 구독 신청 커맨드 실행
		const registerCommand = new RegisterBillingCommand(
			token.partnerIdx,
			planId,
			customerKey,
			{
				cardNumber,
				cardExpirationYear,
				cardExpirationMonth,
				cardPassword,
				customerIdentityNumber,
				customerEmail,
			}
		);
		await this.commandBus.execute(registerCommand);

		return this.getBilling(token);
	}

	/**
	 * 구독 취소 API
	 * @param token
	 */
	@Delete('/')
	@UseGuards(JwtAuthGuard)
	async unregisterBilling(@GetToken() token: TokenInfo) {
		const {partnerIdx} = token;

		// 구독 조회
		const query = new FindBillingByPartnerIdxQuery(partnerIdx);
		const billingProps = await this.queryBus.execute<
			FindBillingByPartnerIdxQuery,
			BillingProps
		>(query);

		// 회원 검증
		if (billingProps.partnerIdx !== partnerIdx) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}

		// TODO: 구독 상태 체크

		// 구독 취소 커맨드 실행
		const command = new UnregisterBillingCommand(billingProps.customerKey);
		await this.commandBus.execute(command);
	}

	/**
	 * 결제 상세 조회 API
	 * @param orderId
	 * @param token
	 */
	@Get('/receipt/:orderId')
	@UseGuards(JwtAuthGuard)
	async getPayment(
		@Param('orderId') orderId: string,
		@GetToken() token: TokenInfo
	) {
		const {partnerIdx} = token;

		// 결제 조회
		const query = new FindPaymentByOrderIdQuery(orderId);
		const paymentProps = await this.queryBus.execute<
			FindPaymentByOrderIdQuery,
			PaymentProps
		>(query);

		return new PaymentDetailInterface(paymentProps);
	}

	/**
	 * 결제 이력 조회 API
	 *
	 * @param params
	 * @param token
	 */
	@Get('/receipt')
	@UseGuards(JwtAuthGuard)
	async getPaymentHistory(
		@Query() params: FindPaymentsQueryDto,
		@GetToken() token: TokenInfo
	) {
		const {partnerIdx} = token;

		// 구독 조회
		const query = new FindPaymentsQuery(partnerIdx, params);
		const paymentProps = await this.queryBus.execute<
			FindPaymentsQuery,
			PaymentProps[]
		>(query);

		return paymentProps.map(
			(payment) => new PaymentSummaryInterface(payment)
		);
	}

	/**
	 * 현재 구독 조회 API
	 * @param token
	 */
	@Get('/')
	@UseGuards(JwtAuthGuard)
	async getBilling(@GetToken() token: TokenInfo) {
		const {partnerIdx} = token;

		// 구독 조회
		const query = new FindBillingByPartnerIdxQuery(partnerIdx);
		const billingProps = await this.queryBus.execute<
			FindBillingByPartnerIdxQuery,
			BillingProps
		>(query);

		// 회원 검증
		if (billingProps.partnerIdx !== partnerIdx) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}

		return new BillingInterface(billingProps);
	}

	/**
	 * 구독 변경 API
	 *
	 * @param token
	 * @param body
	 */
	@Patch('/')
	@UseGuards(JwtAuthGuard)
	async changeBillingPlan(
		@GetToken() token: TokenInfo,
		@Body() body: ChangeBillingPlanBodyDTO
	) {
		const {partnerIdx} = token;

		// 구독 조회
		const query = new FindBillingByPartnerIdxQuery(partnerIdx);
		const billingProps = await this.queryBus.execute<
			FindBillingByPartnerIdxQuery,
			BillingProps
		>(query);

		// 회원 검증
		if (billingProps.partnerIdx !== partnerIdx) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}

		// 구독 변경 커맨드 실행
		const command = new ChangeBillingPlanCommand(
			billingProps.customerKey,
			body.planId,
			billingProps
		);
		await this.commandBus.execute(command);

		return this.getBilling(token);
	}
}
