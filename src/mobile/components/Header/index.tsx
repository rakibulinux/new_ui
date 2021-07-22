import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserLoggedIn } from '../../../modules';
import { Avatar } from '../../assets/icons';

const HeaderComponent: React.FC = () => {
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const intl = useIntl();
	const Logo = require('../../assets/images/logo.svg');

	return (
		<div className="pg-mobile-cpn-header">
			<div className="pg-mobile-cpn-header__inner">
				<Link to="/" className="pg-mobile-cpn-header__logo">
					<img src={Logo} alt="" className="pg-logo__img" />
				</Link>
				<div className="pg-mobile-cpn-header__account">
					{userLoggedIn ? (
						<Link to="/profile" className="pg-mobile-cpn-header__account__profile">
							<Avatar className="pg-mobile-cpn-header__account__profile__icon" />
						</Link>
					) : (
						<Link to="/signin" className="pg-mobile-cpn-header__account__log-in">
							<Button block={true} type="button" size="lg" variant="primary">
								{intl.formatMessage({ id: 'page.mobile.header.signIn' })}
							</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export const Header = React.memo(HeaderComponent);
