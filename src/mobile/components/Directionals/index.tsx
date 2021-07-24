import { CrownOutlined, ExperimentOutlined, GiftOutlined, WalletOutlined } from '@ant-design/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';

const DirectionalsComponent: React.FC = () => {
	return (
		<div className="td-mobile-directional">
			<div className="td-mobile-directional__inner">
				<Link to="/wallets" className="dropdown-content-show">
					<WalletOutlined style={{ color: 'wheat', fontSize: '20px' }} />
					<span>Deposit</span>
				</Link>

				<Link to="/ieo" className="dropdown-content-show">
					<ExperimentOutlined style={{ color: 'wheat', fontSize: '20px' }} />
					<span>IEO</span>
				</Link>

				<Link to="/airdrops" className="dropdown-content-show">
					<GiftOutlined style={{ color: 'wheat', fontSize: '20px' }} />
					<span>Airdrop</span>
				</Link>

				<Link to="/trading-competition" className="dropdown-content-show">
					<CrownOutlined style={{ color: 'wheat', fontSize: '20px' }} />
					<span>Competition</span>
				</Link>
			</div>
			<div className="td-mobile-directional-banner">
				<a href="/ieo">
					<img src="https://i.imgur.com/2yZzXcQ.jpg" alt="" />
				</a>
			</div>
		</div>
	);
};

export const Directionals = React.memo(DirectionalsComponent);
