import * as React from 'react';
import { RouterProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
//import { LogoIcon } from '../../assets/images/LogoIcon';

const TelegramIcon = require('../../assets/images/landing/social/Telegram.svg');
//const LinkedInIcon = require('../../assets/images/landing/social/LinkedIn.svg');
const TwitterIcon = require('../../assets/images/landing/social/Twitter.svg');
//const YouTubeIcon = require('../../assets/images/landing/social/YouTube.svg');
//const RedditIcon = require('../../assets/images/landing/social/Reddit.svg');
/* const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg'); */
const MediumIcon = require('../../assets/images/landing/social/Medium.svg');
//const CoinMarketIcon = require('../../assets/images/landing/social/CoinMarket.svg');
const Logo = require('../../assets/images/logo.svg');
const email = require('./icon/email.svg');
/* const phone = require('./icon/phone.svg')
const office = require('./icon/office.svg') */

class FooterComponent extends React.Component<RouterProps> {
	public render() {
		if (this.props.history.location.pathname.startsWith('/confirm')) {
			return <React.Fragment />;
		}

		return <div className="display">{this.renderFooterDesktop()}</div>;
	}

	private renderFooterDesktop = () => {
		return (
			<footer className="page-footer font-small unique-color-dark">
				<div className="text-center text-md-left mt-5 hmax">
					<div className="row">
						<div className="col-md-3 col-lg-3 col-xl-3 mx-auto">
							<div className="pg-logo">
								<a href="/">
									<img src={Logo} alt="" className="pg-logo__img" />
								</a>
							</div>
						</div>

						<div className="col-md-2 col-lg-2 col-xl-2 mx-auto">
							<h5 className="text-uppercase font-weight-bold">Service Support</h5>
							<p>
								<Link className="footer-lable" to="/fee">
									Asset Fee
								</Link>
							</p>
							<p>
								<a href="#" className="footer-lable" target="blank">
									Listing Token
								</a>
							</p>
							<p>
								<a href="https://api.cx.finance" className="footer-lable" target="blank">
									API Documentation
								</a>
							</p>
						</div>

						<div className="col-md-2 col-lg-2 col-xl-2 mx-auto">
							<h5 className="text-uppercase font-weight-bold">Contact</h5>
							<p className="footer-about">
								<img src={email} alt="Email" />
								listing@cx.finance
							</p>
						</div>

						<div className="col-md-2 col-lg-2 col-xl-2 mx-auto">
							<div>
								<h5 className="text-uppercase font-weight-bold">Social</h5>
								<a href="https://circleex.medium.com/" className="gplus-ic" target="blank">
									<img src={MediumIcon} alt="Facebook" />
								</a>
								<a href="https://twitter.com/exchange_circle" className="gplus-ic" target="blank">
									<img src={TwitterIcon} alt="Twitter" />
								</a>
								<a href="https://t.me/circleex" className="gplus-ic" target="blank">
									<img src={TelegramIcon} alt="Telegram" />
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="footer-copyright text-center py-3">
					© 2020 Copyright:
					<a href="https://cx.finance/"> cx.finance </a>
				</div>
			</footer>
		);
	};
}

// tslint:disable-next-line:no-any
const Footer = withRouter(FooterComponent as any) as any;

export { Footer };
