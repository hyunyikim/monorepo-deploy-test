import {Injectable} from '@nestjs/common';
import {Store} from 'src/cafe24Api';
import {Cafe24Interwork} from 'src/cafe24Interwork/interwork.entity';
import {
	Block,
	HeaderBlock,
	DividerBlock,
	WebClient,
	KnownBlock,
	SectionBlock,
} from '@slack/web-api';
import {EventBatchOrderShipping, WebHookBody} from 'src/cafe24Interwork';

@Injectable()
export class SlackReporter {
	private slackClient: WebClient;
	constructor(
		private token: string,
		private channel: string,
		private envDev: boolean = false
	) {
		this.slackClient = new WebClient(this.token);
	}

	async sendInterworkReport(interwork: Cafe24Interwork) {
		const blocks = this.createInterworkReportBlocks(interwork.store);
		const res = await this.slackClient.chat.postMessage({
			text: '새로운 연동 생성',
			channel: this.channel,
			blocks,
		});
		return res;
	}

	async sendLeaveReport(interwork: Cafe24Interwork) {
		const blocks = this.createLeaveReportBlocks(interwork);
		const res = await this.slackClient.chat.postMessage({
			text: '연동 헤제',
			channel: this.channel,
			blocks,
		});
		return res;
	}

	async sendThreadReply(thread_ts: string, message: string) {
		const res = await this.slackClient.chat.postMessage({
			channel: this.channel,
			thread_ts: thread_ts,
			text: message,
		});
		return res;
	}

	async sendWebhookFailed(
		traceId: string,
		webhook: WebHookBody<EventBatchOrderShipping>
	) {
		const res = await this.slackClient.chat.postMessage({
			text: `웹훅 재시도 실패, orderId:${webhook.resource.order_id} mallId: ${webhook.resource.mall_id}`,
			channel: this.channel,
		});
		return res;
	}

	async deleteReport(ts: string) {
		const res = await this.slackClient.chat.delete({
			ts,
			channel: this.channel,
		});
		return res;
	}

	private createInterworkReportBlocks(store: Store): (Block | KnownBlock)[] {
		const headerBlock = this.createHeaderBlock('Cafe24 연동 시작');
		const divider: DividerBlock = {type: 'divider'};
		const infoList = [
			{name: 'Mall ID', value: store.mall_id},
			{name: '회사이름', value: store.company_name},
			{name: '사업자 등록번호', value: store.company_registration_no},
			{name: '전화번호', value: store.phone},
			{
				name: '샵 이름(번호)',
				value: `${store.shop_name}(${store.shop_no})`,
			},
			{name: '도메인', value: store.base_domain},
			{name: '주소', value: `${store.address1} ${store.address2}`},
			{name: '이메일', value: store.email},
		];

		const infoSectionBlock = this.createInfoSection(infoList);
		const url =
			'https://developers.cafe24.com/admin/sales/install/front/list/apps';
		const linkBlock = this.createLinkSection('구매 내역 페이지', url);
		return [headerBlock, divider, infoSectionBlock, divider, linkBlock];
	}

	private createLeaveReportBlocks(interwork: Cafe24Interwork) {
		const header = this.createHeaderBlock('Cafe24 연동 해제');
		const divider: DividerBlock = {type: 'divider'};
		const infoList = [
			{name: 'Mall ID', value: interwork.store.mall_id},
			{name: '회사이름', value: interwork.store.company_name},
			{
				name: '사업자 등록번호',
				value: interwork.store.company_registration_no,
			},
			{name: '전화번호', value: interwork.store.phone},
			{name: '이메일', value: interwork.store.email},
			{name: '해제사유', value: interwork.reasonForLeave ?? ''},
		];
		const infoSectionBlock = this.createInfoSection(infoList);
		const url =
			'https://developers.cafe24.com/admin/sales/install/front/list/apps';

		const linkBlock = this.createLinkSection('구매 내역 페이지', url);

		return [header, divider, infoSectionBlock, divider, linkBlock];
	}

	private createHeaderBlock(title: string) {
		const headerBlock: HeaderBlock = {
			type: 'header',
			text: {
				type: 'plain_text',
				text: `${title}${this.envDev ? '(개발환경)' : ''}`,
			},
		};
		return headerBlock;
	}

	private createLinkSection(title: string, url: string) {
		const link: SectionBlock = {
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `<${url}|${title}>`,
			},
		};
		return link;
	}

	private createInfoSection(infoList: {value: string; name: string}[]) {
		const section: SectionBlock = {
			type: 'section',
			fields: infoList.map<{type: 'mrkdwn'; text: string}>((info) => ({
				type: 'mrkdwn',
				text: `*${info.name}*: \t ${info.value}`,
			})),
		};
		return section;
	}
}
