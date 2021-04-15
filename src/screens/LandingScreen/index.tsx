import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, RouteProps } from 'react-router-dom';

import { MarketsTable } from '../../containers';
import { IntlProps } from '../../index';
import { compose } from 'redux';
import {
  RootState,
  selectUserLoggedIn,
} from '../../modules';


const FeaturesExchangeIcon = require('../../assets/images/landing/features/Exchange.svg');
const FeaturesCustomizeIcon = require('../../assets/images/landing/features/Customize.svg');
const FeaturesCommunityIcon = require('../../assets/images/landing/features/Community.svg');
const FeaturesAPIIcon = require('../../assets/images/landing/features/API.svg');



interface ReduxProps {
  isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & IntlProps;

class Landing extends React.Component<Props> {

  public renderMarketInfoBlock() {
    const TelegramIcon = require('../../assets/images/landing/social/Telegram.svg');
    const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg');
    const TwitterIcon = require('../../assets/images/landing/social/Twitter.svg');
    return (
      <div className="pg-landing-screen__market-info">
        <div className="pg-landing-screen__market-info__wrap">
          <div className="pg-landing-screen__market-info__wrap__title">
            <div className="pg-landing-screen__market-info__wrap__title__head">
              Welcome New Trader
            </div>
            <div className="pg-landing-screen__market-info__wrap__title__headx">
              Join CircleEx Exchange
            </div>
            <div className="pg-landing-screen__market-info__wrap__title__sub">
              Bonus 100 CX to 1000 Trader First
            </div>
            <div className="pg-landing-screen__market-info__wrap__title__subx">
              Event Start In 15th November 2020
            </div>
          </div>
          <div className="pg-landing-screen__market-info__wrap__box">
            <div className="pg-landing-screen__market-info__wrap__box__content">
              <div className="pg-landing-screen__market-info__wrap__box__content__head">
                SIGN UP FOR 100 CX (= 5 USDT):
              </div>
              <div className="pg-landing-screen__market-info__wrap__box__content__sub">
                Step 1: Create new CircleEx Account
              </div>
              <div className="pg-landing-screen__market-info__wrap__box__content__sub">
                Step 2: Come Airdrop Hub
              </div>
              <div className="pg-landing-screen__market-info__wrap__box__content__sub">
                Step 3: Do and Claim Token
              </div>
              <div className="pg-landing-screen__market-info__wrap__box__content__subx">
                <span>Follow CircleEx Media:</span>
                <a href="https://www.facebook.com/CircleEx" target="blank"><img src={FacebookIcon} alt="facebook" /></a>
                <a href="https://twitter.com/CircleEx" target="blank"><img src={TwitterIcon} alt="twitter" /></a>
                <a href="https://t.me/CircleEx_office" target="blank"><img src={TelegramIcon} alt="telegram" /></a>
              </div>
              <div className="pg-landing-screen__market-info__wrap__box__content__button">
                {this.airdropButton()}
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }

  public renderMarketTable() {
    return (
      <div className="pg-landing-screen__market-table">
        <MarketsTable />
      </div>
    );
  }

  // Hiển thị khung market hot
  public renderParterList() {

    const Lmy = require("./Landing/Partner/lmy.png");
    const Cmc = require("./Landing/Partner/cmc.jpg");
    return (
      <div className="pg-landing-screen__partner-list">
        <div className="pg-landing-screen__partner-list__wrap">
          <div className="pg-landing-screen__partner-list__wrap__title">
            PARTNER
          </div>
          <div className="pg-landing-screen__partner-list__wrap__item-list">
            <img src={Lmy} alt="" className="partner-item" />
            <img src={Cmc} alt="" className="partner-item" />
            <img src={Lmy} alt="" className="partner-item" />
            <img src={Cmc} alt="" className="partner-item" />
            <img src={Cmc} alt="" className="partner-item" />
          </div>
        </div>
      </div>
    );
  }

  public renderRoadmap() {
    const Done = require('./Landing/Roadmap/done.png');
    const Process = require('./Landing/Roadmap/process.svg');
    const Waitting = require('./Landing/Roadmap/waitting.png');
    return (
      <div className="pg-landing-screen__roadmap-list">
        <div className="pg-landing-screen__roadmap-list__wrap">
          <div className="pg-landing-screen__roadmap-list__wrap__title">
            Roadmap's CircleEx Exchange
          </div>
          <div className="pg-landing-screen__roadmap-list__wrap__item-list">
            <div className="roadmap-item">
              <div className="roadmap-item__date">
                <img src={Done} alt="" />
                <span>September 2020</span>
              </div>
              <div className="roadmap-item__content">
                <p>- Public Web Desktop Version</p>
                <p>- Connect Liquid to Binance API</p>
                <p>- Open Lisitng New Token/Coin</p>
                <p>- Open CircleEx Media</p>
                <p>- Public First Event Bonus to 1000 User</p>
              </div>
            </div>

            <div className="roadmap-item">
              <div className="roadmap-item__date">
                <img src={Process} alt="" />
                <span>November 2020</span>
              </div>
              <div className="roadmap-item__content">
                <p>- Public Mobile Desktop Version</p>
                <p>- Public IEO Feature</p>
                <p>- List CircleEx to Coinmarketcap</p>
                <p>- List CircleEx to Coingecko</p>
                <p>- Create LUKU Token</p>
              </div>
            </div>

            <div className="roadmap-item">
              <div className="roadmap-item__date">
                <img src={Waitting} alt="" />
                <span>December 2020</span>
              </div>
              <div className="roadmap-item__content">
                <p>- Launch LUKU Private Sale</p>
                <p>- Launch LUKU IEO Sale</p>
                <p>- Launch LUKU IEO Sale</p>
              </div>
            </div>

            <div className="roadmap-item">
              <div className="roadmap-item__date">
                <img src={Waitting} alt="" />
                <span>1st January 2021 </span>
              </div>
              <div className="roadmap-item__content">
                <p>- Open Trade LUKU token</p>
                <p>- Public Stake Feature</p>
              </div>
            </div>

            <div className="roadmap-item">
              <div className="roadmap-item__date">
                <img src={Waitting} alt="" />
                <span>February 2021 </span>
              </div>
              <div className="roadmap-item__content">
                <p>- List LUKU to other exchange</p>
                <p>- Public CircleEx Wallet App</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  public renderFeature() {
    const ios = require("./Landing/IOS.png");
    const android = require("./Landing/GooglePlay.png");

    return (
      <div className="pg-landing-screen__market-feature">
        <div className="pg-landing-screen__market-feature__wrap">
          <div className="pg-landing-screen__market-feature__wrap__left" style={{background: '#2B3139'}}>
            <div className="item-feature">
              <div><img src={FeaturesCustomizeIcon} alt="Screen" /></div>
              <div>
                <h4>User-friendly</h4>
                <span>Tutorial, Process Guidance, We know how you feel on the first time investment.</span>
              </div>
            </div>
            <div className="item-feature">
              <div><img src={FeaturesExchangeIcon} alt="Exchange" /></div>
              <div>
                <h4>Flexible Order</h4>
                <span>Fast Redeem,Instant Buy; Market/Limit/Profit&Loss, Multi-Trading Types</span>
              </div>
            </div>
            <div className="item-feature">
              <div><img src={FeaturesAPIIcon} alt="Bank" /></div>
              <div>
                <h4>CircleEx Bank</h4>
                <span>CircleEx Bank investment service,highest profit of 15% with daily interest.</span>
              </div>
            </div>
            <div className="item-feature">
              <div><img src={FeaturesCommunityIcon} alt="Device" /></div>
              <div>
                <h4>Devices Covered</h4>
                <span>Whenever there is a network, you can manage your crypto assets with Web/iOS/Android everywhere</span>
              </div>
            </div>
          </div>

          <div className="pg-landing-screen__market-feature__wrap__right">
            <div className="item-mobile__title">CircleEx Exchange is live now</div>
            {this.actionButton()}

            <div className="item-mobile__mobile">
              <div className="item-mobile__title">
                Mobile Version comming soon !!!
              </div>
              <div className="item-mobile__mobile-logo">
                <img src={ios} alt="" />
                <img src={android} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public actionButton() {
    if (this.props.isLoggedIn) {
      return (
        <Link to="/trade" className="register-button">
          Trade Now
        </Link>
      );
    }
    else {
      return (
        <Link to="/signup" className="register-button">
          Register Account
        </Link>
      );
    }
  }

  public airdropButton() {
    if (this.props.isLoggedIn) {
      return (
        <Link to="/trade" className="register-button">
          Trade Now
        </Link>
      );
    }
    else {
      return (
        <Link to="/airdrop" className="register-button">
          Join Airdrop
        </Link>
      );
    }
  }



  public render() {
    return (
      <div className="pg-landing-screen">
        {this.renderMarketInfoBlock()}
        {this.renderMarketTable()}
        {this.renderRoadmap()}
        {this.renderFeature()}
        {this.renderParterList()}
      </div>
    );
  }

  //private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
  isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const LandingScreen = compose(
  injectIntl,
  connect(mapStateToProps, null),
)(Landing) as React.ComponentClass;