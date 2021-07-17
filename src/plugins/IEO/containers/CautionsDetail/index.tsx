import React from 'react';

export const CautionsDetail = () => {
	return (
		<div id="cautions-detail">
			<div className="cautions-detail-title">
				<h3>CAUTIONS</h3>
			</div>
			<div className="container-fluid">
				<div className="describe">
					<ul>
						<li>
							Sale and purchase of Oni Exchange take place between you and Oni Exchange (the “Issuer”) and ProBit is
							neither a seller nor a party as any capacity in the sale of Oni Exchange
						</li>
						<li>Purchase of Oni Exchange is final and there will be no refunds or cancellations</li>
						<li>Please contact the Issuer for any inquiries regarding Oni Exchange</li>

						<li>Distribution schedule of Oni Exchange is to be determined by the Issuer.</li>
					</ul>
				</div>
				<div className="noticeForRate">
					<h3> Notice For Rates</h3>
					<ul>
						<li>
							TC,ETH,XRP: US$ price as published by CoinMarketCap on https://coinmarketcap.com at 8:00 am each day
							(KST)
						</li>
						<li>1 USDT = 1 US$</li>
						<li>
							PROB: the previous 10 minute volume weighted average price of PROB at ProBit Korea Exchange
							(www.probit.kr) updated every minute and converted into US$ price based on the most recent basic rate
							of exchange of US$ as adopted by ProBit Exchange between 4 pm and 8 pm each business day (KST)
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
