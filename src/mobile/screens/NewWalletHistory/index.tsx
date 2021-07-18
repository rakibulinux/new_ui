import { NewTabPanel } from 'components';
import { DepositHistoryTable } from 'mobile/components/DepositHistoryTable';
import { Subheader } from 'mobile/components/Subheader';
import { WithdrawHistoryTable } from 'mobile/components/WithdrawHistoryTable';
import { selectWallets } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface WalletHistoryProps {}

interface WalletHistoryParam {
	currency: string;
}

export const NewWalletHistoryMobileScreen: React.FC<WalletHistoryProps> = ({}) => {
	const intl = useIntl();
	const history = useHistory();
	const { currency } = useParams<WalletHistoryParam>();

	const wallets = useSelector(selectWallets) || [];
	const wallet = wallets.find(_wallet => _wallet.currency === currency);

	const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

	const TAB_LIST_INFO = [
		{
			content: currentTabIndex === 0 ? <DepositHistoryTable currency={currency} type="deposits" /> : null,
			label: intl.formatMessage({ id: 'page.mobile.wallets.deposit.history' }),
		},
		{
			content: currentTabIndex === 1 ? <WithdrawHistoryTable currency={currency} type="withdraws" /> : null,
			label: intl.formatMessage({ id: 'page.mobile.wallets.withdraw.history' }),
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = key => {
		setCurrentTabIndex(Number(key));
	};

	return (
		<div className="td-mobile-screen-wallet-history">
			<Subheader title={`${wallet?.currency.toUpperCase()}/${wallet?.name}`} onGoBack={() => history.goBack()} />
			<NewTabPanel onChange={onChangeTabIndex}>
				{TAB_LIST_INFO.map((tabInfo, i) => (
					<TabPane key={i} tab={tabInfo.label}>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};
