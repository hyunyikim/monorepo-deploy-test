import {registerAs} from '@nestjs/config';

export default registerAs('db', () => ({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	pw: process.env.DB_PW,
	port: process.env.DB_PORT,
	name: process.env.DB_NAME,
}));
