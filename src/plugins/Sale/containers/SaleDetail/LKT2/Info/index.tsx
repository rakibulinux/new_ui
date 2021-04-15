import { Col, Row, Statistic } from 'antd';
import * as React from 'react'
export const LKT2Info = () => {
    const statistics = [
        {
            title: 'Ticker',
            subTitle: 'CX'
        },
        {
            title: 'STARTING PRICE',
            subTitle: '$0.05 USD'
        },
        {
            title: 'TOTAL SUPPLY',
            subTitle: '100,000,000 CX'
        },
        {
            title: 'KYC',
            subTitle: 'NO'
        },
        {
            title: 'CURRENCIES',
            subTitle: 'BTC, ETH, USDT, ESC, KOBE'
        },
        {
            title: 'AVAILABLE FOR IEO',
            subTitle: '30,000,000 CX'
        },
        {
            title: 'RESTRICTED COUNTRIES',
            subTitle: 'NO'
        },
        {
            title: 'TOKEN TYPE',
            subTitle: 'ERC-20'
        },
        {
            title: 'SOFT CAP',
            subTitle: '$ 200,000 USD'
        }
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
                    <h2 className="mb-4" style={{ fontWeight: 'bold', fontSize: '2rem' }}>Tokensale Information:</h2>
                    <p style={{ fontSize: '1.6rem' }}>CircleEx Token<strong style={{ color: '#fff' }}> (CX)</strong> IEO Round 2 starts on 30th of January!</p>
                    <p style={{ fontSize: '1.6rem' }}>
                        Pre-Launch: 30/01/2021, 13:00 pm, UTC - 10/02/2021, 13:00 pm, UTC | $0.05 USD | <strong style={{ color: '#fff' }}> Pre-Launch!</strong>
                    </p>
                </div>
            </div>
            <Row gutter={[32, 32]}>
                {statisticsContent}
            </Row>
        </React.Fragment>
    )
}
