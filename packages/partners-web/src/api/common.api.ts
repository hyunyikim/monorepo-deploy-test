import {nonAuthInstance} from '@/api';

export const sendSlack = async (data: Record<string, any>) => {
	return await nonAuthInstance.post('/v1/common/slack/send', data);
};
