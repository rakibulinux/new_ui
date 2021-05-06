import classnames from 'classnames';
import find from 'lodash/find';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { incrementalOrderBook } from '../../../../api';
import { SortAsc, SortDefault, SortDesc } from '../../../../assets/images/SortIcons';
import { Decimal } from '../../../../components';
import {
  depthFetch,
  Market,
  selectCurrentMarket,
  selectMarketTickers,
  setCurrentMarket,
  setCurrentPrice,
} from '../../../../modules';
import { Table } from '../../components/Table';
import { MarketsListTradingStyle } from './styles';

interface MarketsListTradingComponentProps {
  data: Market[];
  // search: string;
  // currencyQuote: string;
}

const handleChangeSortIcon = (sortBy: string, id: string, reverseOrder: boolean) => {
  if (sortBy !== 'none' && id === sortBy && !reverseOrder) {
    return <SortDesc />;
  }

  if (sortBy !== 'none' && id === sortBy && reverseOrder) {
    return <SortAsc />;
  }

  return <SortDefault />;
};

const MarketsListTradingComponent: React.FC<MarketsListTradingComponentProps> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const intl = useIntl();

  const [sortByState, setSortByState] = React.useState<string>('none');
  const [reverseOrderState, setReverseOrderState] = React.useState<boolean>(false);

  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const marketTickers = useSelector(selectMarketTickers, isEqual);

  const currencyPairSelectHandler = (key: string) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { data } = props;

    const marketToSet = data.find((market) => market.name === key);

    dispatch(setCurrentPrice(0));
    if (marketToSet) {
      dispatch(setCurrentMarket(marketToSet));
      if (!incrementalOrderBook()) {
        dispatch(depthFetch(marketToSet));
      }
      history.push(`/trading/${marketToSet.id}`);
    }
  };

  const getHeaders = () =>
    [
      { id: 'id', translationKey: 'market' },
      { id: 'last', translationKey: 'last_price' },
      { id: 'price_change_percent_num', translationKey: 'change' },
    ]
      .map((obj) => {
        return {
          ...obj,
          selected: sortByState === obj.id,
          reversed: sortByState === obj.id && reverseOrderState,
        };
      })
      .map((obj) => {
        const classname = classnames({
          'td-markets-list-container__header-selected': obj.selected,
        });

        return (
          <span className={classname} key={obj.id} onClick={() => handleHeaderClick(obj.id)}>
            {intl.formatMessage({ id: `page.body.trade.header.markets.content.${obj.translationKey}` })}
            <span className="sort-icon">{handleChangeSortIcon(sortByState, obj.id, reverseOrderState)}</span>
          </span>
        );
      });

  const mapMarkets = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { data } = props;
    const defaultTicker = {
      last: 0,
      price_change_percent: '+0.00%',
    };

    const marketsMapped = data.map((market: Market) => {
      return {
        ...market,
        last: (marketTickers[market.id] || defaultTicker).last,
        price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
        price_change_percent_num: Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
      };
    });

    if (sortByState !== 'none') {
      marketsMapped.sort((a, b) => (a[sortByState] > b[sortByState] ? 1 : b[sortByState] > a[sortByState] ? -1 : 0));
    }

    reverseOrderState && marketsMapped.reverse();

    return marketsMapped.map((market: any) => {
      const isPositive = /\+/.test((marketTickers[market.id] || defaultTicker).price_change_percent);
      const classname = classnames({
        'td-markets-list-container__positive': isPositive,
        'td-markets-list-container__negative': !isPositive,
      });

      return [
        market.name,
        <span className={classname}>{Decimal.format(Number(market.last), market.price_precision)}</span>,
        <span className={classname}>{market.price_change_percent}</span>,
      ];
    });
  };

  const handleHeaderClick = (key: string) => {
    if (key !== sortByState) {
      setSortByState(key);
      setReverseOrderState(false);
    } else if (key === sortByState && !reverseOrderState) {
      setReverseOrderState(true);
    } else {
      setSortByState('none');
      setReverseOrderState(false);
    }
  };

  const dataTable = mapMarkets();
  const selectedObject = find(props.data, (market) => (currentMarket && currentMarket.name === market.name ? true : false));

  return (
    <MarketsListTradingStyle>
      <div className="td-markets-list-container">
        <Table
          isMarketList
          data={dataTable.length > 0 ? dataTable : [[]]}
          header={getHeaders()}
          onSelect={currencyPairSelectHandler}
          selectedKey={selectedObject === undefined ? undefined : selectedObject.name}
          rowKeyIndex={0}
        />
      </div>
    </MarketsListTradingStyle>
  );
};

export const MarketsListTrading = MarketsListTradingComponent;
