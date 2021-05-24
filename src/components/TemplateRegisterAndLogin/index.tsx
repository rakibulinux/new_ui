import * as React from 'react';
import { StyleLayoutRegisterAndLogin } from './StyleLayoutRegisterAndLogin';

import QRCode from './assets/qr.png';
import LockIcon from './assets/lock.png';
const Introduction = (
	<div className="introduction col-md-7 col-12">
		<div className="introduction-content">
			<h3>WELCOME TO CiRCLEEX</h3>
			<div className="forwarding"></div>
			<p>
				Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing
				layouts and visual mockups.
			</p>
		</div>
	</div>
);
const link = (
	<div className="link-web">
		<img src={LockIcon}></img>
		<p>
			<span>https://</span>
			accounts.binance.com
		</p>
	</div>
);
const TemplateTitleRegisterAndLogin = props => {
	return (
		<>
			<div className="qr">
				<img src={QRCode} />
			</div>
			<div className={props.className}>
				<h3 className={props.classNameTitle || ''}>{props.title}</h3>
				<p className={props.classNameContent || ''}>{props.content}</p>
				{props.informationDefault ? link : ''}
			</div>
		</>
	);
};
const LayoutRegisterAndLogin = props => {
	return (
		<StyleLayoutRegisterAndLogin className="col-lg-9 col-sm-11 m-auto">
			<div className={`row col-12 ${props.className} layout`}>
				{Introduction}
				{props.component}
			</div>
		</StyleLayoutRegisterAndLogin>
	);
};

export { LayoutRegisterAndLogin, TemplateTitleRegisterAndLogin };
