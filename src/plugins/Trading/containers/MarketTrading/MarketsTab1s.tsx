import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../modules';
import { Market, selectMarkets } from '../../../../modules/public/markets';

interface MarketsTabsComponentProps {
  onSelect?: (value: string) => void;
}

const quoteCurrencies = (pV: string[], cV: Market) => {
  const [, quote] = cV.name.split('/');
  if (pV.indexOf(quote) === -1) {
    pV.push(quote);
  }

  return pV;
};

const MarketsTabsComponent: React.FC<MarketsTabsComponentProps> = (props) => {
  const markets = useSelector(selectMarkets);

  const [selectedItemState, setSelectedItemState] = React.useState<number>(0);
  const [scrollLeftState, setScrollLeftState] = React.useState<number>(0);

  const tabsRef = React.useRef<HTMLDivElement | null>(null);

  let listOfQuote: string[] = ['All'];
  if (markets.length > 0) {
    listOfQuote = markets.reduce(quoteCurrencies, listOfQuote);
  }

  const handleSelectButton = (index: number) => {
    setSelectedItemState(index);
    if (props.onSelect) {
      props.onSelect(listOfQuote[selectedItemState]);
    }
  };

  const renderFastSearchButton = (item: string, index: number) => {
    const classname = classnames('pg-trading-header-fast-search-button', {
      'pg-trading-header-fast-search-button-active': selectedItemState === index,
    });

    return (
      //tslint:disable-next-line
      <div className={classname} key={index} onClick={() => handleSelectButton(index)}>
        {item}
      </div>
    );
  };

  const handleOnMouseWheel = (event: React.WheelEvent) => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += event.deltaX;
    }
  };

  return (
    <div className="pg-trading-header-fast-search-container" onWheel={handleOnMouseWheel} ref={(ref) => (tabsRef.current = ref)}>
      {listOfQuote.map(renderFastSearchButton)}
    </div>
  );
};

//tslint:disable-next-line:no-any
export const MarketsTab1s = MarketsTabsComponent;
