import * as React from 'react';
import { useSelector } from 'react-redux';
import {
    selectMarkets,
    selectMarketTickers,
} from '../../../modules/public/markets';
import {MarketsTopItem} from './MarketsTopItem';

const MarketsTopComponent: React.FC = () => {
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);

    const renderElms = markets.map((market,i) => {
        return (
            <MarketsTopItem key={i} market={market} ticker={tickers[market.id]}/>
        );
    });

    return (
        <div className="cr-mobile-market-top">
            <div className="cr-mobile-market-top__inner squares">
                <div className="horizontal-scroll squares">
                    {renderElms}
                </div>
            </div>
        </div>
    );
};

export const MarketsTop = React.memo(MarketsTopComponent);
