/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import {addons, Config} from '@storybook/addons';
import theme from './vircleTheme';

const config: Config = {
	theme,
};

addons.setConfig(config);
