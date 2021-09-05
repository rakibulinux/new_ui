import { Col, Row, Statistic } from 'antd';
import * as React from 'react';
export const UDONInfo = () => {
	const statistics = [
		{
			title: 'Ticker',
			subTitle: 'UDON',
		},
		{
			title: 'STARTING PRICE',
			subTitle: '$0.0005 USD',
		},
		{
			title: 'TOTAL SUPPLY',
			subTitle: '1,000,000,000 UDON',
		},
		{
			title: 'KYC',
			subTitle: 'NO',
		},
		{
			title: 'CURRENCIES',
			subTitle: 'BTC, ETH, USDT, BUSD, CX',
		},
		{
			title: 'AVAILABLE FOR IEO',
			subTitle: '150,000,000 UDON',
		},
		{
			title: 'RESTRICTED COUNTRIES',
			subTitle: 'NO',
		},
		{
			title: 'TOKEN TYPE',
			subTitle: 'BEP-20',
		},
		{
			title: 'SOFT CAP',
			subTitle: '$ 75,000 USD',
		},
	];

	let statisticsContent;
	statisticsContent = statistics.map(statistic => {
		return (
			<Col span={8} className="text-center">
				<Statistic title={statistic.title} value={statistic.subTitle} />
			</Col>
		);
	});

	return (
		<React.Fragment>
			<div className="row justify-content-center">
				<div className="col-12">
					<h2 className="mb-4" style={{ fontWeight: 'bold', fontSize: '2rem' }}>
						Tokensale Information:
					</h2>
					<p style={{ fontSize: '1.6rem' }}>
						Udonex Token<strong style={{ color: '#fff' }}> (UDON)</strong> IEO sale starts on 18th of June!
					</p>
					<p style={{ fontSize: '1.6rem' }}>
						Pre-Launch: 18/06/2021, 9:00am, UTC - 04/07/2021, 9:00am, UTC | $0.0005 USD |{' '}
						<strong style={{ color: '#fff' }}> Pre-Launch!</strong>
					</p>
				</div>
			</div>
			<Row gutter={[32, 32]}>{statisticsContent}</Row>
		</React.Fragment>
	);
};
