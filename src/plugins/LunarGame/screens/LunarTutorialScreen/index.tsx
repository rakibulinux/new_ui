import { Button, Col,notification,Row, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import * as moment from 'moment';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../../';
import { Decimal, WalletItemProps } from '../../../../components';
import { awardFetch, Lot, lotFetch, LunarsState, RootState,selectLunarAwards, selectLunarLots, selectUserFetching, selectUserInfo, selectUserLoggedIn, selectWallets, User } from '../../../../modules';
import './LunarTutorialScreen.css';

// tslint:disable-next-line: no-empty-interface
interface LocationProps extends RouterProps {
}

interface LunarTutorialState {
  isShowResultModal: boolean;
}

interface ReduxProps {
  awards: LunarsState['awards'];
  user: User;
  lots: LunarsState['lots'];
  isLoggedIn: boolean;
  userLoading: boolean;
  wallets :  WalletItemProps[];
}

interface DispatchProps {
  awardFetch: typeof awardFetch;
  lotFetch: typeof lotFetch;
}

export type LunarTutorialProps = LocationProps & IntlProps & ReduxProps & DispatchProps;

class LunarTutorial extends React.Component<LunarTutorialProps, LunarTutorialState> {
  constructor(props: LunarTutorialProps) {
    super(props);
  }

  public componentDidMount = () => {
    //fetch
    this.props.awardFetch();
  };

  public componentDidUpdate(_prevProps: LunarTutorialProps) {
    const { user, userLoading, isLoggedIn, lots } = this.props;
    if (isLoggedIn && !userLoading && !lots.firstCall) {
       this.props.lotFetch(user.uid);
    }
}

  public awardDetailsRender = () => {
    const awardsRedux = this.props.awards;
    const awards = [...awardsRedux.data].sort((a, b) => a.award - b.award);
    const headerDefault = awards.length ? awards.map(award => `${award.award}`) : ['10', '20', '40', '80'];
    const dataHorizontal = [
      {
        name: 'quantity',
        ...Object.assign({}, ...awards.map(award => ({ [award.award]: award.quantity }))),
      },
      {
        name: 'remain',
        ...Object.assign({}, ...awards.map(award => ({ [award.award]: award.remain }))),
      },
    ];

    const columns: ColumnsType = [
      {
        title: '',
        render: (_text, _record, i) => i === 0 ? 'Quantity' : 'Remain',
      },
      {
        title: `${headerDefault[0]} USDT`,
        align: 'center',
        dataIndex: headerDefault[0],
        key: headerDefault[0],
      },
      {
        title: `${headerDefault[1]} USDT`,
        align: 'center',
        dataIndex: headerDefault[1],
        key: headerDefault[1],
      },
      {
        title: `${headerDefault[2]} USDT`,
        align: 'center',
        dataIndex: headerDefault[2],
        key: headerDefault[2],
      },
      {
        title: `${headerDefault[3]} USDT`,
        align: 'center' as 'center',
        dataIndex: headerDefault[3],
        key: headerDefault[3],
      },
    ];

    return <div className="table-award-detail">
      <h2>Details of the rewards</h2>
      <Table columns={columns} loading={awardsRedux.loading} bordered dataSource={dataHorizontal} pagination={false} />
      </div>;
  };

  public depositTableRender = () => {
    const { lots } = this.props;
    const columns: ColumnsType<Lot> = [
      {
        title: 'Currency',
        dataIndex: 'currency_id',
        key: 'currency_id',
        width: 100,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 150,
        render: text => `${Decimal.format(text, 6, ',')}`,
      },
      {
        title: 'Txid',
        dataIndex: 'txid',
        key: 'txid',
        width: 150,
        ellipsis: true,
      },
      {
        title: 'Completed At',
        dataIndex: 'completed_at',
        width: 150,
        key: 'completed_at',
        render: text => moment(text).format('MM DD YYYY, hh:mm'),
      },
      {
        title: 'Status',
        key: 'used',
        width: 100,
        dataIndex: 'used',
        render: (status: boolean,record : any) => {
          const color = status ? 'red' : 'yellow';
          const name = status ? `${record.reward} USDT` : 'waiting';

          return (
            <Tag color={color}>
              {name.toUpperCase()}
            </Tag>
          );
        },
      },
      {
        title: 'Action',
        key: 'used',
        fixed: 'right' as 'right',
        width: 80,
        dataIndex: 'used',
        render: (status, record) => {
          if (status) {
            return '';
          }

          return (
            <Button type="primary" onClick={() => this.handleClickPlay(record.txid)}>PLAY</Button>
          );
        },
      },
    ];

    return <div className="table-deposit-detail"><h2>Deposit history</h2> <Table<Lot> scroll={{ x: 600 }} loading={lots.loading} pagination={false} columns={columns} dataSource={lots.data} /></div>;
  };

  public handleClickPlay = (txid : string) =>  {
    const { wallets,history } = this.props;
    
    const usdt = wallets.find(wallet => wallet.currency === "usdt");
    if (usdt && usdt.balance){
      history.push(`/lunar-game?txid=${txid}`);
    }else{
      notification.warning({
        description : 'Please read Tutorial - Conditions and create a USDT wallet address',
        message : 'No USDT wallet yet',
      });
    }
  };

  public render() {
    const bgImg = require('../../assets/bg-op.jpg');
    const bgLeftImg = require('../../assets/bg-left.png');
    const bgRightImg = require('../../assets/bg-right.png');

    return (
      <div className="container-fluid pg-lunar-tutorial" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="pg-lunar-tutorial-parallax">
          <div className="left" style={{ backgroundImage: `url(${bgLeftImg})` }}></div>
          <div className="right" style={{ backgroundImage: `url(${bgRightImg})` }}></div>
        </div>
        <div className="container-fluid pg-lunar-tutorial__inner">
          <Row gutter={[20, 20]}>
            <Col span={24} lg={17}>
              {this.depositTableRender()}
            </Col>
            <Col span={24} lg={7}>
              {this.awardDetailsRender()}
            </Col>
          </Row>
          <div className="pg-lunar-tutorial-content">
            <h2 className="title-game">tutorial</h2>
            <div className="pg-lunar-tutorial-content-requirement">
              <h3 className="title">* CONDITIONS :</h3>
              <p>- You must have a USDT wallet address in the <a onClick={this.toWalletPage}>WALLET</a> directory to receive the reward, if not, you can go to <a onClick={this.toWalletPage}>WALLET</a> -{'>'} USDT -{'>'} Generate USDT address</p>
              <p>- When making transactions> 30 USD, you will be drawn a free lucky draw.</p>
              <p>- The 3 most recent transactions will be used to join the game.</p>
              <p>- Drawings are free once eligibility is met and gifts are guaranteed.</p>
            </div>
            <div className="pg-lunar-tutorial-content-play">
              <h3 className="title">* HOW TO PLAY! :</h3>
              <p>- In the tab 'Deposit history', column 'Action'.</p>
              <p>- If your trade is unused and eligible to play there will be a play button.</p>
              <p>- Click on and select your lucky bag right away, Good luck!.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private toWalletPage = () => {
    this.props.history.push('/wallets');
  };
  // private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
  awards: selectLunarAwards(state),
  lots: selectLunarLots(state),
  user: selectUserInfo(state),
  userLoading: selectUserFetching(state),
  isLoggedIn: selectUserLoggedIn(state),
  wallets : selectWallets(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
  awardFetch: () => dispatch(awardFetch()),
  lotFetch: (uid: string) => dispatch(lotFetch(uid)),
});

export const LunarTutorialScreen = compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps, mapDispatchProps),
)(LunarTutorial) as React.ComponentClass;
