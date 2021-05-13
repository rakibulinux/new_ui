import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import CoinBubblesSvg from './assets/Coin_Bubbles.svg';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../hooks';
import { currenciesFetch, Currency, selectCurrencies, selectMarkets, selectMarketTickers } from '../../modules';

import LayersPNG from './assets/layers.png';
import CommunityPNG from './assets/people.png';
import RevenuePNG from './assets/revenue.png';

import AndroidAPK from './assets/android_apk_download.png';
import AppStore from './assets/app_store_download.png';
import GooglePlay from './assets/google_play_download.png';
import Scan from './assets/scan_download.png';

import Exchange from './assets/mobile.png';

import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { TeamSection } from '../../containers';

const Title = styled.h1`
  color: #fff;
  font-size: 3em;
  font-weight: bold;
  padding-bottom: 20px;
  text-align: center;
`;

const SubTitle = styled.h3`
  color: #989aa2;
  font-size: 20px;
  text-align: center;
`;

const Button = styled.button`
  color: #fff;
  font-size: 20px;
  background-color: #259da8;
  border: none;
  border-radius: 1rem;
  padding: 10px 20px;
  margin-top: 48px;
  outline: none;
`;

const Section = styled.div`
  padding: 50px 0;
`;

const MarketChartItem = styled.div`
  cursor: pointer;
  padding: 1rem;
  border-radius: 5px;
  transition: ease-in-out 0.3s;
  :hover {
    background-color: #4c4f62;
  }
`;

const defaultTicker = {
  amount: '0.0',
  last: '0.0',
  high: '0.0',
  open: '0.0',
  low: '0.0',
  price_change_percent: '+0.00%',
  volume: '0.0',
};

const BASE_MARKET_URL = 'https://www.cx.finance/api/v2/peatio/public/markets';

export const HomePageScreen = () => {
  const history = useHistory();

  const market_ids = ['cx/usdt', 'cx/eth', 'eth/usdt'];

  const [KlineState1, setKline1State] = React.useState<{ pv: string }>();
  const [KlineState2, setKline2State] = React.useState<{ pv: string }>();
  const [KlineState3, setKline3State] = React.useState<{ pv: string }>();
  /*     const [KlineState4, setKline4State] = React.useState<{ pv: string }>();
        const [KlineState5, setKline5State] = React.useState<{ pv: string }>();
        const [KlineState6, setKline6State] = React.useState<{ pv: string }>();
        const [KlineState7, setKline7State] = React.useState<{ pv: string }>(); */

  useMarketsFetch();
  useMarketsTickersFetch();
  useRangerConnectFetch();

  // selector
  const markets = useSelector(selectMarkets);
  const marketTickers = useSelector(selectMarketTickers);
  const currencies = useSelector(selectCurrencies);

  // dispatch
  const dispatch = useDispatch();
  const dispatchFetchCurrencies = () => dispatch(currenciesFetch());

  React.useEffect(() => {
    dispatchFetchCurrencies();
  }, []);

  const fetchMarketsKlines = async (marketId: string, from: number, to: number) => {
    try {
      const klines = await axios.get(
        `${BASE_MARKET_URL}/${marketId.split('/').join('')}/k-line?period=30&time_from=${from}&time_to=${to}`,
      );

      return klines.data.map((kline, index) => {
        return { pv: kline[3] };
      });
    } catch (error) {
      return [];
    }
  };

  React.useEffect(() => {
    const from = Math.floor(Date.now() / 1000) - 30 * 60 * 1000;
    const to = Math.floor(Date.now() / 1000);
    const drawMarketLines = async () => {
      try {
        const klines1 = await fetchMarketsKlines(market_ids[0], from, to);
        const klines2 = await fetchMarketsKlines(market_ids[1], from, to);
        const klines3 = await fetchMarketsKlines(market_ids[2], from, to);
        /*                 const klines4 = await fetchMarketsKlines(market_ids[3], from, to);
                                const klines5 = await fetchMarketsKlines(market_ids[4], from, to);
                                const klines6 = await fetchMarketsKlines(market_ids[5], from, to);
                                const klines7 = await fetchMarketsKlines(market_ids[6], from, to); */
        setKline1State(klines1);
        setKline2State(klines2);
        setKline3State(klines3);
        /*                 setKline4State(klines4);
                                setKline5State(klines5);
                                setKline6State(klines6);
                                setKline7State(klines7); */
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    };
    drawMarketLines();
    return () => {};
  }, []);

  const renderTitle = () => (
    <Section>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Title>CircleEX Exchange</Title>
            <SubTitle>First Governance Community Exchange For the community By the Community</SubTitle>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <Button style={{ color: '#3D8189ff', backgroundColor: '#2E4152ff', padding: '0.5rem 1rem' }}>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );

  const findIcon = (currency_id: string): string => {
    const currency = currencies.find((currency: Currency) => String(currency.id).toLowerCase() === currency_id.toLowerCase());
    try {
      return require(`../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`);
    } catch (err) {
      if (currency) return currency.icon_url;
      return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
    }
  };

  const renderMarket = () => {
    const MarketChart = (data: any, marketID: string) => {
      const market = markets.find((market) => market.id.toLowerCase() === marketID.split('/').join('').toLowerCase());

      if (market) {
        const marketID = market.name.toUpperCase();
        const baseCurrency = marketID.split('/')[0];
        const quoteCurrency = marketID.split('/')[1];
        const last = Number((marketTickers[market.id] || defaultTicker).last);
        const open = Number((marketTickers[market.id] || defaultTicker).open);
        const price_change_percent = (marketTickers[market.id] || defaultTicker).price_change_percent;
        const change = +last - +open;
        // color
        const marketChangeColor = +(change || 0) < 0 ? '#91121D' : '#88A190ff';
        return (
          <MarketChartItem>
            <div
              className="container"
              onClick={() => history.push(`/trading/${baseCurrency.toLowerCase() + quoteCurrency.toLowerCase()}`)}
            >
              <div className="row">
                <div className="col-12 d-flex justify-content-between">
                  <div>
                    <img width="30px" height="30px" src={findIcon(baseCurrency)} alt={baseCurrency} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px' }} className="text-white">
                      {marketID.toUpperCase()}
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#414455ff',
                      borderRadius: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    24H
                  </span>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <span style={{ marginLeft: '5px', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
                    {last.toFixed(6)} <br /> {quoteCurrency}
                  </span>
                </div>
                <div className="col-6 d-flex justify-content-end align-items-center">
                  <span style={{ marginRight: '5px', color: marketChangeColor, fontWeight: 'bold' }}>{price_change_percent}</span>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-12">
                  <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                    <AreaChart data={data}>
                      <Area type="monotone" dataKey="pv" stroke="#fff" fill="transparent" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </MarketChartItem>
        );
      }
      return '';
    };

    return (
      <Section>
        <div className="container" style={{ backgroundColor: '#313445ff', padding: '3rem 1.5rem', borderRadius: '1rem' }}>
          <div className="row">
            <div className="col-3">{MarketChart(KlineState1, market_ids[0])}</div>

            <div className="col-3">{MarketChart(KlineState2, market_ids[1])}</div>
            <div className="col-3">{MarketChart(KlineState3, market_ids[2])}</div>

            {/* <div className="col-3">
                            {MarketChart(KlineState4, market_ids[3])}
                        </div> */}
            <div className="col-3 d-flex justify-content-center align-items-center">
              <button className="btn" style={{ color: '#3D8189ff', backgroundColor: '#2E4152ff', padding: '0.5rem 1rem' }}>
                <Link to="/signup">View all</Link>
              </button>
            </div>
          </div>
          {/* <div className="row mt-5">
                        <div className="col-3">
                            {MarketChart(KlineState5, marketIds[4])}
                        </div>

                        <div className="col-3">
                            {MarketChart(KlineState6, marketIds[5])}
                        </div>
                        <div className="col-3">
                            {MarketChart(KlineState7, marketIds[6])}
                        </div>
                        <div className="col-3 d-flex justify-content-center align-items-center">
                            <button className="btn" style={{ color: '#3D8189ff', backgroundColor: '#2E4152ff', padding: '0.5rem 1rem' }}><Link to="/signup">View all</Link></button>
                        </div>
                    </div> */}
        </div>
      </Section>
    );
  };

  const renderSupport = () => (
    <Section>
      <div className="row">
        <div className="col-12">
          <Title>Features</Title>
        </div>
      </div>
      <div className="container text-white">
        <div className="row">
          <div className="col-4 text-center">
            <img className="img-fluid w-50" src={RevenuePNG} alt="support" />
            <h3 className="mt-4">Revenue Sharing</h3>
          </div>
          <div className="col-4 text-center">
            <img className="img-fluid w-50" src={LayersPNG} alt="support" />
            <h3 className="mt-4">Multi Layer Protection</h3>
          </div>
          <div className="col-4 text-center">
            <img className="img-fluid w-50" src={CommunityPNG} alt="support" />
            <h3 className="mt-4">Community-Driven</h3>
          </div>
        </div>
      </div>
    </Section>
  );

  const renderPoster = () => {
    return (
      <Section>
        <div style={{ padding: '50px 0', backgroundColor: '#292D3F' }}>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div className="row">
                  <div className="col-12">
                    <h1>Trade anytime and anywhere</h1>
                    <h4 className="mt-5">
                      Download CircleEx APP, you will be able to easily at any time, anywhere trading global mainstream, popular
                      digital assets.
                    </h4>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-6">
                    <img className="img-fluid" src={AppStore} alt="apple+store" />
                  </div>
                  <div className="col-6">
                    <img width="255px" src={Scan} alt="scan+qrcode" />
                  </div>
                  <div className="col-6 mt-3">
                    <img className="img-fluid" src={AndroidAPK} alt="android+apk" />
                  </div>
                  <div className="col-6 mt-3">
                    <img className="img-fluid" src={GooglePlay} alt="google+play" />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <img className="img-fluid" src={Exchange} alt="exchange" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  };

  const renderTeam = () => {
    return <TeamSection />;
  };

  return (
    <div>
      {renderTitle()}
      {renderMarket()}
      {/* {renderInverstIn()} */}
      {renderSupport()}
      {renderPoster()}
      {renderTeam()}
    </div>
  );
};
