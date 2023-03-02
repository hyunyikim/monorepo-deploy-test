import {useEffect} from 'react';

// TODO: 타입 에러 수정
function ChannelTalk() {
	useEffect(() => {
		window.ChannelIO('boot', {
			pluginKey: 'bcc797ee-e039-4bda-ab7d-4c5f5dc4cefb',
			// "hideChannelButtonOnBoot": true
		});
	}, []);
	return <></>;
}

export default ChannelTalk;
