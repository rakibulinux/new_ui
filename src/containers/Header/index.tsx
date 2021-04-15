import { History } from 'history';
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { IntlProps } from '../../index';
/* import { compose } from 'redux'; */
import {
  changeUserDataFetch,
  logoutFetch,
  Market,
  RootState,
  selectCurrentMarket,
  selectUserInfo,
  selectUserLoggedIn,
  User,
  selectMarketSelectorState,
  selectMobileWalletUi,
  selectSidebarState,
  setMobileWalletUi,
  toggleMarketSelector,
  toggleSidebar,

} from '../../modules';

interface State {
  isOpenDrop: boolean;
}

interface OwnProps {
  onLinkChange?: () => void;
  history: History;
  changeUserDataFetch: typeof changeUserDataFetch;
}

interface ReduxProps {
  isLoggedIn: boolean;
  currentMarket: Market | undefined;
  user: User;
  mobileWallet: string;
  sidebarOpened: boolean;
  marketSelectorOpened: boolean;
}

interface DispatchProps {
  logoutFetch: typeof logoutFetch;
  setMobileWalletUi: typeof setMobileWalletUi;
  toggleSidebar: typeof toggleSidebar;
  toggleMarketSelector: typeof toggleMarketSelector;
}

interface HistoryProps {
  history: History;
}

type Props = OwnProps & ReduxProps & HistoryProps & IntlProps & DispatchProps;

class Head extends React.Component<Props, State> {

  public render() {

    return (
      <header className={`pg-header`}>
        {this.renderHeaderDesktop()}
      </header>
    );
  }


  private renderHeaderDesktop = () => {
    const Logo = require('../../assets/images/logo.svg');
    return (
      <nav className="navbar navbar-inverse header-color">
        <div className="navbar__item-left">
          <a href="/"><img src={Logo} alt="" className="pg-logo__img" /></a>
          <Link className="market" to="/trading">Market</Link>
          <Link className="market" to="/ieo">Launchpad</Link>
          <Link className="market" to="/airdrop">Airdrop Hub</Link>
          <Link className="market" to="/trading-competition">Trade Competition</Link>
        </div>
        <div className="navbar__item-right">
          {this.renderWalletLink()}
          {this.renderOrderTab()}
          {this.renderProfileTab()}
          {this.renderUnlogin()}
        </div>
      </nav>
    );
  };

  public renderWalletLink = () => {
    const { isLoggedIn } = this.props;

    return isLoggedIn && (
      <div className="dropdown">
        <Link className="wallet" to="/wallets">
          Wallet
        </Link>
      </div>
    );
  };


  public state = {
    isOpenDrop: false,
  };

  public renderOrderTab = () => {
    const { isLoggedIn } = this.props;
    const arrowButton = require('./arrows/arrowBottom.svg');
    const order = require('../../assets/images/order.svg');
    const history = require('../../assets/images/history.svg');

    return isLoggedIn && (
      <div className="dropdown">
        <div className="dropbtn">
          <div className="dropbtn-order">
            <span>{this.translate('page.body.landing.header.orders')}</span>
            <img src={arrowButton} alt="" />
          </div>
        </div>
        <div className="dropdown-content">
          <Link to="/orders" className="dropdown-content-show">
            <img src={order} alt="" className="iconHeader"/>
            {this.translate('page.body.landing.header.order')}
          </Link>
          <Link className="dropdown-content-show" to="/history">
          <img src={history} alt="" className="iconHeader"/>
          {this.translate('page.body.landing.header.history')}
          </Link>
        </div>
      </div>
    );
  };

  public renderProfileTab = () => {
    const { isLoggedIn } = this.props;
    const arrowButton = require('./arrows/arrowBottom.svg');

    return isLoggedIn && (
      <div className="dropdown">
        <div className="dropbtn">
          <div className="dropbtn-order">
            <span>{this.translate('page.body.landing.header.account')}</span>
            <img src={arrowButton} alt="" />
          </div>
        </div>
        <div className="dropdown-content">
          {this.renderProfileLink()}
          {this.renderLogout()}
        </div>
      </div>
    );
  };

  public renderUnlogin = () => {
    const { isLoggedIn } = this.props;

    return !isLoggedIn && (
      <div>
        <button className="ant-btn ant-btn-primary" onClick={e => this.redirectSingIn()} >
          {this.translate('page.body.landing.header.button2')}
        </button>
        <button className="ant-btn ant-btn-primary" onClick={e => this.redirectSingUp()} >
          {this.translate('page.body.landing.header.button3')}
        </button>
      </div>
    );
  };

  public redirectSingIn = () => {
    this.props.history.push('/login');
  };

  public redirectSingUp = () => {
    this.props.history.push('/register');
  };

  private translate = (key: string) => this.props.intl.formatMessage({ id: key });


  public renderLogout = () => {
    const { isLoggedIn } = this.props;
    
    if (!isLoggedIn) {
      return null;
    }
    return (

      <Link to="" className="dropdown-content-show" onClick={this.props.logoutFetch} >
        <LogoutIcon className="iconHeader" />
        <FormattedMessage id={'page.body.profile.content.action.logout'} />
      </Link>
    );
  };

  public renderProfileLink = () => {
    const { isLoggedIn } = this.props;
    const profile = require('../../assets/images/user.svg');
    return isLoggedIn && (
      <Link to="/profile" className="dropdown-content-show">
        <img src={profile} alt="" className="iconHeader"/>
        <FormattedMessage id={'page.header.navbar.profile'} />
      </Link>
    );
  };

}

const mapStateToProps = (state: RootState): ReduxProps => ({
  isLoggedIn: selectUserLoggedIn(state),
  currentMarket: selectCurrentMarket(state),
  user: selectUserInfo(state),
  mobileWallet: selectMobileWalletUi(state),
  sidebarOpened: selectSidebarState(state),
  marketSelectorOpened: selectMarketSelectorState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
  dispatch => ({
    logoutFetch: () => dispatch(logoutFetch()),
    changeUserDataFetch: payload => dispatch(changeUserDataFetch(payload)),
    toggleSidebar: payload => dispatch(toggleSidebar(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
  });

const Header = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any) as any);

export {
  Header,
};