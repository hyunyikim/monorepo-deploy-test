import {Link} from 'react-router-dom';
import {ButtonBase} from '@mui/material';

import {ImgLogoVirclePartners, ImgLogoVirclePartners2x} from '@/assets/images';

function Logo() {
	return (
		<ButtonBase disableRipple component={Link} to="/">
			<img
				src={ImgLogoVirclePartners}
				srcSet={`${ImgLogoVirclePartners2x} 2x`}
				alt="logo"
			/>
		</ButtonBase>
	);
}

export default Logo;
