import React from 'react';
import imgDetail from './assets/imgDetail.png';
export const InformationIEO = () => {
	const toUpperCaseFirstChar = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const information = {
		name: 'oni Exchange (ONI)',
		date: '2021-05-06 16:00 (GMT+7)',
		price: '1 ONI = 5 USDT',
		homepage: 'https://www.cx.finance/',
		bonus: '2% Bonus for PROB',
		bonusLookup: '2 Weeks',
		softcap: '100,000 USDT',
		hardcap: '5,000,000 USDT',
		usage: 'Intelligent AMM and yield farm on Binance Smart Chain',
		whitepaper: 'English',
		tech: 'BEP-20',
		sns: 'Twitter Telegram',
	};
	const showInformationComponent = () => {
		let content: Array<JSX.Element> = [];
		for (let key in information) {
			const jsx = (
				<div key={key} className="col-md-6 col-sm-12 d-flex detail" style={{ padding: '0px' }}>
					<div className="content-key col-md-5 col-xl-3">
						<p>{toUpperCaseFirstChar(key)}</p>
					</div>
					<div className="content-value col-md-7 co-xl-9">
						<p>{information[key]}</p>
					</div>
				</div>
			);
			content.push(jsx);
		}
		return content;
	};
	return (
		<div id="information-ieo">
			<div className="information-ieo-title">
				<h3>DETAIL</h3>
			</div>
			<div className="col-11 content row" style={{ padding: '0px' }}>
				{showInformationComponent()}
			</div>
			<div className="information-ieo-image col-11 d-flex justify-content-center" style={{ padding: '0px' }}>
				<img src={imgDetail}></img>
			</div>
		</div>
	);
};
