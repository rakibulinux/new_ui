import { DEFAULT_KYC_STEPS, ORDER_BOOK_DEFAULT_SIDE_LIMIT, STORAGE_DEFAULT_LIMIT } from '../constants';
import { Config } from './types';

export const defaultConfig: Config = {
	api: {
		authUrl: '',
		tradeUrl: '',
		applogicUrl: '',
		rangerUrl: '',
		arkeUrl: '',
		finexUrl: '',
		ieoAPIUrl: '',
		sunshineUrl: '',
		airdropUrl: '',
		stakeUrl: '',
		walletUrl: '',
		referralUrl: '',
		competitionUrl: '',
		holderUrl: '',
	},
	minutesUntilAutoLogout: '30',
	rangerReconnectPeriod: '1',
	withCredentials: true,
	storage: {},
	gaTrackerKey: '',
	msAlertDisplayTime: '5000',
	incrementalOrderBook: false,
	finex: false,
	isResizable: false,
	isDraggable: false,
	languages: ['en'],
	sessionCheckInterval: '15000',
	balancesFetchInterval: '3000',
	passwordEntropyStep: 0,
	showLanding: true,
	sentryEnabled: false,
	kycSteps: ['email', 'profile', 'document', 'address'],
};

export const Cryptobase = {
	config: defaultConfig,
};

declare global {
	interface Window {
		env: Config;
	}
}

window.env = window.env || defaultConfig;
Cryptobase.config = { ...window.env };
//hot custome env
Cryptobase.config.api.competitionUrl = Cryptobase.config.api.competitionUrl || '/api/v2/competition';
Cryptobase.config.api.airdropUrl = Cryptobase.config.api.airdropUrl || '/api/v2/airdrop';
Cryptobase.config.api.sunshineUrl = Cryptobase.config.api.sunshineUrl || '/api/v2/sunshine';
Cryptobase.config.api.stakeUrl = Cryptobase.config.api.stakeUrl || '/api/v2/stake';
Cryptobase.config.api.ieoAPIUrl = Cryptobase.config.api.ieoAPIUrl || '/api/v2/ieo';
Cryptobase.config.api.walletUrl = Cryptobase.config.api.walletUrl || '/api/v2/wallet';
Cryptobase.config.api.referralUrl = Cryptobase.config.api.referralUrl || '/api/v2/referral';
Cryptobase.config.api.holderUrl = Cryptobase.config.api.holderUrl || '/api/v2/holder';
//end custome env
Cryptobase.config.storage = Cryptobase.config.storage || {};

export const competitionUrl = () => Cryptobase.config.api.competitionUrl;
export const tradeUrl = () => Cryptobase.config.api.tradeUrl;
export const authUrl = () => Cryptobase.config.api.authUrl;
export const applogicUrl = () => Cryptobase.config.api.applogicUrl;
export const sunshineUrl = () => Cryptobase.config.api.sunshineUrl;
export const airdropUrl = () => Cryptobase.config.api.airdropUrl;
export const ieoAPIUrl = () => Cryptobase.config.api.ieoAPIUrl;
export const stakeUrl = () => Cryptobase.config.api.stakeUrl;
export const walletUrl = () => Cryptobase.config.api.walletUrl;
export const referralUrl = () => Cryptobase.config.api.referralUrl;
export const holderUrl = () => Cryptobase.config.api.holderUrl;
export const rangerUrl = () => Cryptobase.config.api.rangerUrl;
export const arkeUrl = () => Cryptobase.config.api.arkeUrl || tradeUrl();
export const finexUrl = () => Cryptobase.config.api.finexUrl || tradeUrl();
export const minutesUntilAutoLogout = (): string => Cryptobase.config.minutesUntilAutoLogout || '5';
export const withCredentials = () => Cryptobase.config.withCredentials;
export const defaultStorageLimit = () => Cryptobase.config.storage.defaultStorageLimit || STORAGE_DEFAULT_LIMIT;
export const orderBookSideLimit = () => Cryptobase.config.storage.orderBookSideLimit || ORDER_BOOK_DEFAULT_SIDE_LIMIT;
export const gaTrackerKey = (): string => Cryptobase.config.gaTrackerKey || '';
export const msAlertDisplayTime = (): string => Cryptobase.config.msAlertDisplayTime || '5000';
export const rangerReconnectPeriod = (): number =>
	Cryptobase.config.rangerReconnectPeriod ? Number(Cryptobase.config.rangerReconnectPeriod) : 1;
export const incrementalOrderBook = (): boolean => Cryptobase.config.incrementalOrderBook || false;
export const isResizableGrid = (): boolean => Cryptobase.config.isResizable || false;
export const isDraggableGrid = (): boolean => Cryptobase.config.isDraggable || false;
export const languages =
	Cryptobase.config.languages && Cryptobase.config.languages.length > 0 ? Cryptobase.config.languages : ['en'];
export const sessionCheckInterval = (): string => Cryptobase.config.sessionCheckInterval || '15000';
export const balancesFetchInterval = (): string => Cryptobase.config.balancesFetchInterval || '3000';
export const isFinexEnabled = (): boolean => Cryptobase.config.finex || false;
export const passwordEntropyStep = (): number => Cryptobase.config.passwordEntropyStep;
export const showLanding = (): boolean => Cryptobase.config.showLanding;
export const sentryEnabled = () => Cryptobase.config.sentryEnabled || defaultConfig.sentryEnabled;
export const kycSteps = (): string[] => Cryptobase.config.kycSteps || DEFAULT_KYC_STEPS;
