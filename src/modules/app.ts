import { combineReducers } from 'redux';
import { airdropReducer } from './airdrops/airdrop';
import { claimReducer } from './airdrops/claim';
import { ethFeeReducer } from './eth-withdraw/fee';
import { ethFeeWithdrawReducer } from './eth-withdraw/withdraw';
import { lunarReducer } from './events/lunar';
import { announcementReducer } from './info/announcement';
import { eventReducer } from './info/events';
import {
	createStakeReducer,
	stakeHistoryReducer,
	stakeWalletReducer,
	stakingListReducer,
	unStakeHistoryReducer,
	unStakeReducer,
} from './plugins/staking';
import { voteDonateReducer, voteHistoryReducer, voteListReducer } from './plugins/vote';
import { alertReducer } from './public/alert';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { customizationReducer } from './public/customization';
import { changeColorThemeReducer } from './public/globalSettings';
import { gridLayoutReducer } from './public/gridLayout/reducer';
import { changeLanguageReducer } from './public/i18n';
import { klineReducer } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { rangerReducer } from './public/ranger/reducer';
import { recentTradesReducer } from './public/recentTrades';
import { buyReducer, totalBuyersReducer } from './sale/buy';
import { priceReducer } from './sale/price';
import { saleItemReducer } from './sale/sale-item';
import { saleListReducer } from './sale/sale-list';
import { competitionItemReducer } from './trading_competitions/competition_item';
import { competitionsListReducer } from './trading_competitions/competitions';
import { rankingsReducer } from './trading_competitions/rankings';
import { apiKeysReducer } from './user/apiKeys';
import { authReducer } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { customizationUpdateReducer } from './user/customization';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { historyReducer } from './user/history';
import { addressesReducer, documentsReducer, identityReducer, labelReducer, phoneReducer } from './user/kyc';
import { newHistoryReducer } from './user/newHistory';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer } from './user/orders';
import { ordersHistoryReducer } from './user/ordersHistory';
import { passwordReducer } from './user/password';
import { profileReducer } from './user/profile';
import { userActivityReducer } from './user/userActivity';
import { allChildCurrenciesReducer, childCurrenciesReducer, walletsReducer } from './user/wallets';
import { withdrawLimitReducer } from './user/withdrawLimit';

export const eventsReducer = combineReducers({
	lunar: lunarReducer,
});

export const airdropsReducer = combineReducers({
	airdrops: airdropReducer,
	claims: claimReducer,
});

export const ethFeesReducer = combineReducers({
	ethFee: ethFeeReducer,
	withdraw: ethFeeWithdrawReducer,
});

export const saleReducer = combineReducers({
	saleList: saleListReducer,
	saleItem: saleItemReducer,
	buy: buyReducer,
	price: priceReducer,
	totalBuyers: totalBuyersReducer,
});

export const tradingCompetitionsReducer = combineReducers({
	competitions: competitionsListReducer,
	competition_item: competitionItemReducer,
	rankings: rankingsReducer,
});
export const infoReducer = combineReducers({
	events: eventReducer,
	announcement: announcementReducer,
});

export const publicReducer = combineReducers({
	blocklistAccess: blocklistAccessReducer,
	colorTheme: changeColorThemeReducer,
	configs: configsReducer,
	currencies: currenciesReducer,
	customization: customizationReducer,
	recentTrades: recentTradesReducer,
	markets: marketsReducer,
	orderBook: orderBookReducer,
	depth: depthReducer,
	incrementDepth: incrementDepthReducer,
	ranger: rangerReducer,
	i18n: changeLanguageReducer,
	kline: klineReducer,
	alerts: alertReducer,
	rgl: gridLayoutReducer,
	memberLevels: memberLevelsReducer,
});

export const userReducer = combineReducers({
	auth: authReducer,
	beneficiaries: beneficiariesReducer,
	customizationUpdate: customizationUpdateReducer,
	label: labelReducer,
	orders: ordersReducer,
	password: passwordReducer,
	profile: profileReducer,
	wallets: walletsReducer,
	child_currencies: childCurrenciesReducer,
	all_child_currencies: allChildCurrenciesReducer,
	addresses: addressesReducer,
	documents: documentsReducer,
	identity: identityReducer,
	phone: phoneReducer,
	history: historyReducer,
	newHistory: newHistoryReducer,
	apiKeys: apiKeysReducer,
	userActivity: userActivityReducer,
	ordersHistory: ordersHistoryReducer,
	openOrders: openOrdersReducer,
	sendEmailVerification: sendEmailVerificationReducer,
	captchaKeys: getGeetestCaptchaReducer,
	withdrawLimit: withdrawLimitReducer,
});

const voteReducer = combineReducers({
	list: voteListReducer,
	history: voteHistoryReducer,
	donate: voteDonateReducer,
});

export const pluginsReducer = combineReducers({
	staking_list: stakingListReducer,
	stake_wallet: stakeWalletReducer,
	stake_history: stakeHistoryReducer,
	create_stake: createStakeReducer,
	unstake: unStakeReducer,
	unstake_history: unStakeHistoryReducer,
	vote: voteReducer,
});
