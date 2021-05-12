import classnames from 'classnames';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal } from '../../../components';
import { Market, setCurrentMarket, Ticker } from '../../../modules/public/markets';

interface MarketsTopItemProps {
	market: Market;
	ticker: Ticker;
}

const MarketsTopItemComponent: React.FC<MarketsTopItemProps> = ({ market, ticker }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const redirectToTrading = (paramMarket: Market) => {
		dispatch(setCurrentMarket(paramMarket));
		history.push(`/trading/${paramMarket.id}`);
	};

	const marketTickerChange = +(+ticker.last - +ticker.open).toFixed(market.price_precision);
	const marketChangeClass = classnames('', {
		'change-positive': (+marketTickerChange || 0) >= 0,
		'change-negative': (+marketTickerChange || 0) < 0,
	});

	return (
		<div className="cr-mobile-market-top-info" onClick={() => redirectToTrading(market)}>
			<div className="cr-mobile-market-top-info-head">
				<div className="cr-mobile-market-top-info-head__title">
					<h6>{market.name.split('/')[0]}</h6> <span>/ {market.name.split('/')[1]}</span>
				</div>
				<div className="cr-mobile-market-top-info-head__change">
					<span className={marketChangeClass}>{ticker.price_change_percent}</span>
				</div>
			</div>
			<div className="cr-mobile-market-top-info-content">
				<div className="cr-mobile-market-top-info-content__price">
					<h6 className={marketChangeClass}>{Decimal.format(ticker.last, market.price_precision, ',')}</h6>
				</div>
			</div>
			<div className="cr-mobile-market-top-info-foot">
				<div className="cr-mobile-market-top-info-foot__about-eq-price">
					<span>&asymp;{Decimal.format(ticker.last, 4, ',')}</span>
				</div>
			</div>
		</div>
	);
};

MarketsTopItemComponent.defaultProps = {
	ticker: {
		amount: '0.0',
		last: '0.0',
		high: '0.0',
		open: '0.0',
		low: '0.0',
		price_change_percent: '+0.00%',
		volume: '0.0',
		avg_price: '0',
	},
};

export const MarketsTopItem = React.memo(MarketsTopItemComponent);
