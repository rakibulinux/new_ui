import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Decimal } from '../../../../components/Decimal';
import { selectCurrentMarket, selectMarkets, selectMarketTickers } from '../../../../modules';
import { HeaderToolbarStyle } from './styles';

import playSvg from '../../assets/play.svg';
import ratioSvg from '../../assets/ratio.svg';

const HeaderToolbarContainer: React.FC = () => {
  const intl = useIntl();

  const getTickerValue = (value: string) => {
    return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
  };

  const translate = (id: string) => {
    return id ? intl.formatMessage({ id }) : '';
  };

  const currentMarket = useSelector(selectCurrentMarket);
  const marketTickers = useSelector(selectMarketTickers);

  const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

  const isPositive = currentMarket && /\+/.test(getTickerValue('price_change_percent'));
  const cls = isPositive ? 'positive' : 'negative';

  const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();

  return (
    <HeaderToolbarStyle>
      <div className="pg-new-header__toolbar--left">
        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-title">
            {(currentMarket && currentMarket.name) || 'NONE'} {'  '} <img src={ratioSvg} />
          </p>
          <p className={`pg-new-header__toolbar-item-value pg-new-header__toolbar-item-site`}>Circleex</p>
        </div>
        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-text">{translate('page.body.trade.toolBar.lastPrice')}</p>
          <p className={`pg-new-header__toolbar-item-value pg-new-header__toolbar-item-value-${cls}`}>
            {currentMarket && Decimal.format(Number(getTickerValue('last')), 6)}
          </p>
        </div>
        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-text">{translate('page.body.trade.toolBar.change')}</p>
          <p className={`pg-new-header__toolbar-item-value pg-new-header__toolbar-item-value-${cls}`}>
            {currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent}
          </p>
        </div>
        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-text">{translate('page.body.trade.toolBar.lowest')}</p>
          <p className="pg-new-header__toolbar-item-value pg-new-header__toolbar-item-value-data">
            {currentMarket && Decimal.format(Number(getTickerValue('low')), 6)}
          </p>
        </div>
        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-text">{translate('page.body.trade.toolBar.highest')}</p>
          <p className="pg-new-header__toolbar-item-value pg-new-header__toolbar-item-value-data">
            {currentMarket && Decimal.format(Number(getTickerValue('high')), 6)}
          </p>
        </div>

        <div className="pg-new-header__toolbar-item">
          <p className="pg-new-header__toolbar-item-text">
            {translate('page.body.trade.toolBar.volume')}({bidUnit})
          </p>
          <p className={`pg-new-header__toolbar-item-value pg-new-header__toolbar-item-value-${cls}`}>
            {currentMarket && Decimal.format(Number(getTickerValue('volume')), 4)}
          </p>
        </div>
      </div>
      <div className="pg-new-header__toolbar--right">
        <img src={playSvg} />
        <a className="link-tutorial" href="/">
          Spot Tutorial
        </a>
      </div>
    </HeaderToolbarStyle>
  );
};

const HeaderToolbar = withRouter(HeaderToolbarContainer);

export { HeaderToolbar };
