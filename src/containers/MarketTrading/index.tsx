import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
  Market,
  RootState,
  selectCurrentMarket,
  selectMarketSelectorState,
} from '../../modules';
import {
  MarketsListTrading,
} from './MarketsList';

import {
  MarketsTab1s,
} from './MarketsTab1s';

interface ReduxProps {
  currentMarket?: Market;
  isOpen: boolean;
}

interface State {
  searchFieldValue: string;
  marketsTabsSelectedValue: string;
}

class MarketTradingComponent extends React.Component<ReduxProps, State> {
  public readonly state = {
    searchFieldValue: '',
    marketsTabsSelectedValue: '',
  };

  public render() {
    const { searchFieldValue, marketsTabsSelectedValue } = this.state;

    return (
      <div>
        <div className="pg-markets">
          <div className="pg-trading-header-selector-search-trading">
            <div className="pg-trading-header-selector-search-trading-icon">
              <img alt="" src={require('./icon/search.svg')} />
            </div>
            <input
              className="pg-trading-header-selector-search-trading-field"
              onChange={this.searchFieldChangeHandler}
              value={searchFieldValue}
            />
          </div>

          <MarketsTab1s onSelect={this.marketsTabsSelectHandler} />
          <MarketsListTrading search={searchFieldValue} currencyQuote={marketsTabsSelectedValue} />
        </div>
      </div>
    );
  }

  private searchFieldChangeHandler = e => {
    this.setState({
      searchFieldValue: e.target.value,
    });
  };

  private marketsTabsSelectHandler = value => {
    this.setState({
      marketsTabsSelectedValue: value,
    });
  };
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
  currentMarket: selectCurrentMarket(state),
  isOpen: selectMarketSelectorState(state),
});

export const MarketTrading = connect<ReduxProps, {}, {}, RootState>(reduxProps)(MarketTradingComponent);
