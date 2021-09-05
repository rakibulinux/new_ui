import { NewTabPanel } from 'components';
import { HistoryTable } from 'mobile/components/HistoryTable';
import { Subheader } from 'mobile/components/Subheader';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface WalletHistoryProps {}

export const NewWalletHistoryMobileScreen: React.FC<WalletHistoryProps> = ({}) => {
	const intl = useIntl();
	const history = useHistory();

	const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

	const TAB_LIST_INFO = [
		{
			content: currentTabIndex === 0 ? <HistoryTable type="deposits" /> : null,
			label: intl.formatMessage({ id: 'page.mobile.wallets.deposit.history' }),
		},
		{
			content: currentTabIndex === 1 ? <HistoryTable type="withdraws" /> : null,
			label: intl.formatMessage({ id: 'page.mobile.wallets.withdraw.history' }),
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = key => {
		setCurrentTabIndex(Number(key));
	};

	return (
		<div className="td-mobile-screen-wallet-history">
			<Subheader title={intl.formatMessage({ id: 'page.body.wallet.history.header' })} onGoBack={() => history.goBack()} />
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
