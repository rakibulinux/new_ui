import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Decimal } from '../../../../components/Decimal';
import { selectCurrentMarket, selectMarketTickers } from '../../../../modules';
import playSvg from '../../assets/play.svg';
import ratioSvg from '../../assets/ratio.svg';
import { HeaderToolbarStyle } from './styles';

const HeaderToolbarContainer: React.FC = () => {
  const intl = useIntl();

  const getTickerValue = (value: string) => {
    return currentMarket && (marketTickers[currentMarket.id] || defaultTicker)[value];
  };

  const translate = (id: string) => {
    return id ? intl.formatMessage({ id }) : '';
  };

  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const marketTickers = useSelector(selectMarketTickers, isEqual);

  const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

  const isPositive = currentMarket && /\+/.test(getTickerValue('price_change_percent'));
  const cls = isPositive ? 'positive' : 'negative';

  const bidUnit = currentMarket && currentMarket.quote_unit.toUpperCase();

  return (
    <HeaderToolbarStyle>
      <div className="td-header__toolbar--left">
        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-title">
            {(currentMarket && currentMarket.name) || 'NONE'} {'  '} <img src={ratioSvg} />
          </p>
          <p className={`td-header__toolbar-item-value td-header__toolbar-item-site`}>Circleex</p>
        </div>
        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-text">{translate('page.body.trade.toolBar.lastPrice')}</p>
          <p className={`td-header__toolbar-item-value td-header__toolbar-item-value-${cls}`}>
            {currentMarket && Decimal.format(Number(getTickerValue('last')), 6)}
          </p>
        </div>
        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-text">{translate('page.body.trade.toolBar.change')}</p>
          <p className={`td-header__toolbar-item-value td-header__toolbar-item-value-${cls}`}>
            {currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent}
          </p>
        </div>
        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-text">{translate('page.body.trade.toolBar.lowest')}</p>
          <p className="td-header__toolbar-item-value td-header__toolbar-item-value-data">
            {currentMarket && Decimal.format(Number(getTickerValue('low')), 6)}
          </p>
        </div>
        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-text">{translate('page.body.trade.toolBar.highest')}</p>
          <p className="td-header__toolbar-item-value td-header__toolbar-item-value-data">
            {currentMarket && Decimal.format(Number(getTickerValue('high')), 6)}
          </p>
        </div>

        <div className="td-header__toolbar-item">
          <p className="td-header__toolbar-item-text">
            {translate('page.body.trade.toolBar.volume')}({bidUnit})
          </p>
          <p className={`td-header__toolbar-item-value td-header__toolbar-item-value-${cls}`}>
            {currentMarket && Decimal.format(Number(getTickerValue('volume')), 4)}
          </p>
        </div>
      </div>
      <div className="td-header__toolbar--right">
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
