import {Link} from 'react-router-dom';
import {ButtonBase} from '@mui/material';

import LogoImage from '@/assets/images/logo_vircle_partners_inline_150.png';
import LogoImage2x from '@/assets/images/logo_vircle_partners_inline_150@2x.png';

function Logo() {
	return (
		<ButtonBase disableRipple component={Link} to="/">
			<img src={LogoImage} srcSet={`${LogoImage2x} 2x`} alt="logo" />
		</ButtonBase>
	);
}

export default Logo;
