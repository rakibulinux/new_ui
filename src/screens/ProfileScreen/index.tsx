import { Empty, Switch } from 'antd';
import classnames from 'classnames';
import { CustomInput, NewCopyableTextField, NewCustomInput, NewTabPanel } from 'components';
import { getUserAgentBrowserAndDevice, localeDate, PASSWORD_REGEX, setDocumentTitle } from 'helpers';
import { useWalletsFetch } from 'hooks';
import {
	alertPush,
	apiKeyCreateFetch,
	ApiKeyCreateFetch,
	ApiKeyDataInterface,
	apiKeyDeleteFetch,
	ApiKeyDeleteFetch,
	apiKeys2FAModal,
	ApiKeys2FAModal,
	apiKeysFetch,
	ApiKeyUpdateFetch,
	apiKeyUpdateFetch,
	changePasswordFetch,
	getUserActivity,
	selectUserActivity,
	selectUserInfo,
	selectUserLoggedIn,
	selectWallets,
	toggle2faFetch,
} from 'modules';
import { selectApiKeys, selectApiKeysModal } from 'modules/user/apiKeys/selectors';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const ActivityContainer: React.FC = () => {
	const intl = useIntl();
	const dispatch = useDispatch();

	const userActivity = useSelector(selectUserActivity);
	const [tabKeyActiveState, setTabkeyActiveState] = React.useState<string>('Activity');

	React.useEffect(() => {
		dispatch(getUserActivity({ page: 0, limit: 25 }));
	}, []);

	const renderResult = (result: string) => {
		const className = classnames({
			'td-pg-profile__activity-result-succeed':
				result === intl.formatMessage({ id: 'page.body.profile.content.result.succeed' }),
			'td-pg-profile__activity-result-failed':
				result === intl.formatMessage({ id: 'page.body.profile.content.result.failed' }) ||
				result === intl.formatMessage({ id: 'page.body.profile.content.result.denied' }),
		});

		return <span className={className}>{result}</span>;
	};

	const getResultOfUserAction = (value: string) => {
		switch (value) {
			case 'login':
				return intl.formatMessage({ id: 'page.body.profile.content.action.login' });
			case 'logout':
				return intl.formatMessage({ id: 'page.body.profile.content.action.logout' });
			case 'request QR code for 2FA':
				return intl.formatMessage({ id: 'page.body.profile.content.action.request2fa' });
			case 'enable 2FA':
				return intl.formatMessage({ id: 'page.body.profile.content.action.enable2fa' });
			case 'login::2fa':
				return intl.formatMessage({ id: 'page.body.profile.content.action.login.2fa' });
			case 'request password reset':
				return intl.formatMessage({ id: 'page.body.profile.content.action.requestPasswordReset' });
			case 'password reset':
				return intl.formatMessage({ id: 'page.body.profile.content.action.passwordReset' });
			default:
				return value;
		}
	};

	const renderData = (keyShow: 'browserName' | 'deviceName') => {
		return (
			<div className="td-pg-profile__inner">
				{userActivity.map((activity, i) => {
					const names = getUserAgentBrowserAndDevice(activity.user_agent);

					return (
						<div className="td-pg-profile__activity__item" key={i}>
							<div className="d-flex justify-content-between">
								<span className="td-pg-profile__activity__item__field--highlight">{names[keyShow]}</span>
								<span>
									{getResultOfUserAction(activity.action)}/
									{renderResult(
										intl.formatMessage({ id: `page.body.profile.content.result.${activity.result}` }),
									)}
								</span>
							</div>
							<div className="d-flex justify-content-between">
								<span>{activity.user_ip}</span> <span>{localeDate(activity.created_at, 'fullDate')}</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const onChangeTabKey: TabsProps['onChange'] = key => {
		setTabkeyActiveState(key);
	};

	const TAB_LIST_INFO = [
		{
			label: 'Activity',
			content: tabKeyActiveState === 'Activity' ? renderData('browserName') : null,
		},
		{
			label: 'Device',
			content: tabKeyActiveState === 'Device' ? renderData('deviceName') : null,
		},
	];

	return (
		<NewTabPanel defaultActiveKey={tabKeyActiveState} onChange={onChangeTabKey}>
			{TAB_LIST_INFO.map(tabInfo => (
				<TabPane key={tabInfo.label} tab={tabInfo.label}>
					{tabInfo.content}
				</TabPane>
			))}
		</NewTabPanel>
	);
};

const ActiveStepContainer: React.FC = () => {
	const history = useHistory();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const user = useSelector(selectUserInfo);
	const wallet = useSelector(selectWallets);

	const isExistBalance =
		wallet.reduce((prev, current) => {
			const result = prev + (current.balance ? +current.balance : 0);

			return result;
		}, 0) > 0;

	const svgActive = (
		<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.99993 7.8L1.19993 5L0.266602 5.93334L3.99993 9.66667L11.9999 1.66667L11.0666 0.733337L3.99993 7.8Z"
				fill="white"
			/>
		</svg>
	);

	const handleNavigateTo2fa = () => {
		history.push('/security/2fa', { enable2fa: user.otp });
	};

	const handleToWallet = () => {
		history.push('/wallets');
	};

	return (
		<div className="td-pg-profile--radius td-pg-profile__active-step">
			<h1 className="td-pg-profile__active-step__tile">Welcome to CiRCLEEX</h1>
			<span className="td-pg-profile__active-step__desc">Just a few more steps and you’re good to go!</span>
			<div className="td-pg-profile__active-step__content d-flex">
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn,
						})}
					>
						{isLoggedIn ? svgActive : '1'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">Register Account</h5>
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': isLoggedIn && user.otp,
						})}
					>
						{user.otp ? svgActive : '2'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">2FA</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						Secure your account with two- factor authentication！
					</span>
					{!user.otp ? (
						<Button
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleNavigateTo2fa}
						>
							Verify
						</Button>
					) : null}
				</div>
				<div className="td-pg-profile__active-step__content__item">
					<span
						className={classnames('td-pg-profile__active-step__content__item__step', {
							'td-pg-profile__active-step__content__item__step--active': user.otp && isExistBalance,
						})}
					>
						{isExistBalance ? svgActive : '3'}
					</span>
					<h5 className="td-pg-profile__active-step__content__item__title">Deposit Funds</h5>
					<span className="td-pg-profile--color--second td-pg-profile__active-step__content__item__desc">
						Add cash or crypto funds to your wallet and start trading right away
					</span>
					{user.otp && !isExistBalance ? (
						<Button
							size="sm"
							className="td-pg-profile__active-step__content__item__action mt-3"
							onClick={handleToWallet}
						>
							To Wallet
						</Button>
					) : null}
				</div>
			</div>
			<img className="td-pg-profile__active-step__mask-icon" src={require('assets/images/profile/maskIconToStep.svg')} />
		</div>
	);
};

export const ProfileQuickContainer: React.FC = () => {
	const userActivity = useSelector(selectUserActivity);
	const user = useSelector(selectUserInfo);

	const lastLogin = userActivity.find(act => act.action === 'login');
	const ip = lastLogin ? lastLogin.user_ip : '';
	const time = lastLogin ? localeDate(lastLogin.created_at, 'fullDate') : '';

	return (
		<div className="td-pg-profile--bg--second td-pg-profile--bg td-pg-profile__quick">
			<Container fluid>
				<div className="td-pg-profile__quick__inner d-flex align-items-center">
					<div className="td-pg-profile__quick__logo">
						<img src={require('assets/images/profile/avatar.svg')} />
						{user.email && <div className="td-pg-profile__quick__logo__name">{user.email[0]}</div>}
					</div>
					<div className="td-pg-profile__quick__info d-flex flex-column align-items-start">
						<div className="td-pg-profile__quick__info--top d-flex align-items-center">
							<div className="td-pg-profile__quick__info--top__email mr-2">{user.email}</div>
							<div className="td-pg-profile__quick__info--top__user-id">
								<span className="td-pg-profile--color--second td-pg-profile__quick__info--top__user-id--label mr-1">
									User Id:
								</span>
								<span className="td-pg-profile__quick__info--top__user-id--content">{user.uid}</span>
							</div>
						</div>
						<div className="td-pg-profile--color--second td-pg-profile__quick__info--bottom">
							<span className="td-pg-profile__quick__info--bottom__last-login--time mr-2">
								Last login time {time}
							</span>
							<span className="td-pg-profile__quick__info--bottom__last-login--ip">IP : {ip}</span>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

const AnnouncementContainer: React.FC = () => {
	return (
		<React.Fragment>
			<Link to="/announcement" className="td-pg-profile__content__item__header td-pg-profile__content__item__header--link">
				<div className="td-pg-profile__content__item__header__title">Announcements</div>
				<div className="td-pg-profile__content__item__header__to-page">
					<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.01986 0L0.609863 1.41L5.18986 6L0.609863 10.59L2.01986 12L8.01986 6L2.01986 0Z"
							fill="#848E9C"
						/>
					</svg>
				</div>
			</Link>
			<div className="td-pg-profile__content__item__content d-flex flex-column">
				{true
					? null
					: new Array(2).fill(null).map((_a, i) => (
							<div className="td-pg-profile__announcement__item d-flex justify-content-between" key={i}>
								<div className="td-pg-profile__announcement__item__title flex-fill">
									<Link to={'/profile'}>
										VITE Promotion - Win a Share of $50,000 in VITE,VITE Promotion - Win a Share of $50,000 in
										VITEVITE Promotion - Win a Share of $50,000 in VITEVITE Promotion - Win a Share of $50,000
										in VITEVITE Promotion - Win a Share of $50,000 in VITEVITE Promotion - Win a Share of
										$50,000 in VITEVITE Promotion - Win a Share of $50,000 in VITE
									</Link>
								</div>
								<div className="td-pg-profile__announcement__item__date">2021-04-09</div>
							</div>
					  ))}
			</div>
		</React.Fragment>
	);
};

export const ProfileTwoFactorAuthComponent: React.FC<{
	isShow: boolean;
	setHide: () => void;
	navigateTo2fa: () => void;
}> = ({ isShow, setHide, navigateTo2fa }) => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const [code2Fa, setCode2Fa] = React.useState('');
	const [code2FaFocus, setCode2FaFocus] = React.useState(false);

	const handleChange2FaCode = (value: string) => {
		setCode2Fa(value);
	};

	const handleDisable2Fa = () => {
		dispatch(toggle2faFetch({ code: code2Fa, enable: false }));
		setCode2Fa('');
	};

	const renderBodyModal2Fa = () => {
		const code2FaClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': code2FaFocus,
		});
		const isValid2Fa = code2Fa.match('^[0-9]{6}$');

		return (
			<form className="td-email-form" onSubmit={handleDisable2Fa}>
				<div className={code2FaClass}>
					<NewCustomInput
						type="text"
						label="2FA code"
						placeholder="2FA code"
						defaultLabel=""
						handleFocusInput={() => {
							setCode2FaFocus(true);
						}}
						handleChangeInput={handleChange2FaCode}
						inputValue={code2Fa}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<div className="td-email-form__button-wrapper">
					<Button block={true} disabled={!isValid2Fa} onClick={handleDisable2Fa} size="lg" variant="primary">
						{intl.formatMessage({
							id: 'page.body.profile.header.account.content.twoFactorAuthentication.disable',
						})}
					</Button>
				</div>
			</form>
		);
	};

	return (
		<Modal
			className="td-pg-profile__modal"
			animation={false}
			show={isShow}
			onHide={setHide}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>
					<FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader" />
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>{renderBodyModal2Fa()}</Modal.Body>
		</Modal>
	);
};

export const SecurityContainer: React.FC = () => {
	const intl = useIntl();
	const history = useHistory();
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);
	const [showChangeModal, setShowChangeModal] = React.useState(false);
	const [showModal2Fa, setShowModal2Fa] = React.useState(false);
	const [formPassword, setFormPassword] = React.useState({
		oldPassword: '',
		newPassword: '',
		confirmationPassword: '',
	});

	const [formPasswordFocus, setFormPasswordFocus] = React.useState({
		oldPasswordFocus: false,
		newPasswordFocus: false,
		confirmPasswordFocus: false,
	});

	const handleCloseChange = () => {
		setShowChangeModal(false);
	};
	const handleShowChange = () => {
		setShowChangeModal(true);
	};
	const handleClose2Fa = () => {
		setShowModal2Fa(false);
	};
	const handleShow2Fa = () => {
		setShowModal2Fa(true);
	};

	const handleFieldFocus = (field: string) => {
		setFormPasswordFocus(prev => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleFieldPassword = (field: string, value: string) => {
		setFormPassword(prev => ({
			...prev,
			[field]: value,
		}));
	};

	const isValidForm = () => {
		const { confirmationPassword, oldPassword, newPassword } = formPassword;
		const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
		const isConfirmPasswordValid = newPassword === confirmationPassword;

		return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
	};

	const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		dispatch(
			changePasswordFetch({
				confirm_password: formPassword.confirmationPassword,
				old_password: formPassword.oldPassword,
				new_password: formPassword.newPassword,
			}),
		);
	};

	const renderBodyModalChangePassword = () => {
		if (!showChangeModal) {
			return null;
		}

		const { oldPassword, newPassword, confirmationPassword } = formPassword;
		const { oldPasswordFocus, newPasswordFocus, confirmPasswordFocus } = formPasswordFocus;

		const oldPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': oldPasswordFocus,
		});

		const newPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': newPasswordFocus,
		});

		const confirmPasswordClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': confirmPasswordFocus,
		});

		return (
			<form className="td-email-form" onSubmit={handleChangePassword}>
				<div className={oldPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.old',
						})}
						defaultLabel="Old password"
						handleChangeInput={value => {
							handleFieldPassword('oldPassword', value);
						}}
						inputValue={oldPassword}
						handleFocusInput={() => {
							handleFieldFocus('oldPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
					/>
				</div>
				<div className={newPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.new',
						})}
						defaultLabel="New password"
						handleChangeInput={value => {
							handleFieldPassword('newPassword', value);
						}}
						inputValue={newPassword}
						handleFocusInput={() => {
							handleFieldFocus('newPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
				<div className={confirmPasswordClass}>
					<NewCustomInput
						type="password"
						label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
						placeholder={intl.formatMessage({
							id: 'page.body.profile.header.account.content.password.conf',
						})}
						defaultLabel="Password confirmation"
						handleChangeInput={value => {
							handleFieldPassword('confirmationPassword', value);
						}}
						inputValue={confirmationPassword}
						handleFocusInput={() => {
							handleFieldFocus('confirmPasswordFocus');
						}}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={false}
					/>
				</div>
				<div className="td-email-form__button-wrapper">
					<Button disabled={!isValidForm()} type="submit" className="w-100" variant="primary" size="lg">
						{intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change' })}
					</Button>
				</div>
			</form>
		);
	};

	const handleNavigateTo2fa = () => {
		if (!user.otp) {
			history.push('/security/2fa', { enable2fa: user.otp });
		} else {
			setShowModal2Fa(false);
		}
	};

	return (
		<React.Fragment>
			<div className="td-pg-profile__content__item__header">
				<div className="td-pg-profile__content__item__header__title">Security</div>
			</div>
			<div className="td-pg-profile__content__item__content">
				<div className="td-pg-profile__inner">
					<div className="td-pg-profile__security__row-item">
						<div className="td-pg-profile__security__item__left">
							<div className="td-pg-profile__security__row-item__title">Enable 2FA</div>
							<div
								className="td-pg-profile__security__row-item__action"
								onClick={user.otp ? handleShow2Fa : handleNavigateTo2fa}
							>
								{user.otp ? 'Off' : 'On'}
							</div>
						</div>
						<div className="td-pg-profile__security__item__right">
							<div className="td-pg-profile__security__row-item__title">Identity Verification</div>
							<div className="td-pg-profile__security__row-item__action">Verify</div>
						</div>
					</div>
					<div className="td-pg-profile__security__row-item">
						<div className="td-pg-profile__security__item__left">
							<div className="td-pg-profile__security__row-item__title">Change Password</div>
							<div className="td-pg-profile__security__row-item__action" onClick={handleShowChange}>
								Change
							</div>
						</div>
						<div className="td-pg-profile__security__item__right"></div>
					</div>
				</div>
				<Modal
					className="td-pg-profile__modal"
					animation={false}
					show={showChangeModal}
					onHide={handleCloseChange}
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>
							<FormattedMessage id="page.body.profile.header.account.content.password.change" />
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>{renderBodyModalChangePassword()}</Modal.Body>
				</Modal>
				<ProfileTwoFactorAuthComponent
					isShow={showModal2Fa}
					setHide={handleClose2Fa}
					navigateTo2fa={handleNavigateTo2fa}
				/>
			</div>
		</React.Fragment>
	);
};

export const ApiKeyContainer: React.FC = () => {
	const intl = useIntl();
	const dispatch = useDispatch();

	const [otpCode, setOtpCode] = React.useState('');
	const [codeFocused, setCodeFocused] = React.useState(false);
	const apiKeys = useSelector(selectApiKeys);
	const modal = useSelector(selectApiKeysModal);

	React.useEffect(() => {
		dispatch(apiKeysFetch());
	}, []);

	const translate = (id: string) => {
		return intl.formatMessage({ id });
	};
	const getTableHeaders = () => {
		return [
			translate('page.body.profile.apiKeys.table.header.kid'),
			translate('page.body.profile.apiKeys.table.header.algorithm'),
			translate('page.body.profile.apiKeys.table.header.state'),
			'Status',
			translate('page.body.profile.apiKeys.table.header.created'),
			translate('page.body.profile.apiKeys.table.header.updated'),
			'Action',
		];
	};

	const onChangeSwitch = (checked: boolean, apiKey: ApiKeyDataInterface) => {
		const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'updateKey', apiKey };
		dispatch(apiKeys2FAModal(payload));
	};

	const handleDeleteKeyClick = (apiKey: ApiKeyDataInterface) => {
		const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'deleteKey', apiKey };
		dispatch(apiKeys2FAModal(payload));
	};

	const getTableData = () => {
		return [...apiKeys, ...apiKeys, ...apiKeys].map(item => [
			item.kid,
			item.algorithm,
			<div>
				<span>{item.state}</span>
			</div>,
			<div>
				<Switch
					checked={item.state === 'active'}
					onChange={checked => {
						onChangeSwitch(checked, item);
					}}
				/>
			</div>,
			localeDate(item.created_at, 'fullDate'),
			localeDate(item.updated_at, 'fullDate'),
			<span className="td-pg-profile__action-delete" key={item.kid} onClick={() => handleDeleteKeyClick(item)}>
				X
			</span>,
		]);
	};

	const handleCreateKey = () => {
		const payload: ApiKeyCreateFetch['payload'] = { totp_code: otpCode };
		dispatch(apiKeyCreateFetch(payload));
		setOtpCode('');
	};

	const handleCreateSuccess = () => {
		const payload: ApiKeys2FAModal['payload'] = { active: false };
		dispatch(apiKeys2FAModal(payload));
	};

	const handleUpdateKey = () => {
		const apiKey: ApiKeyDataInterface = { ...modal.apiKey } as any;
		apiKey.state = apiKey.state === 'active' ? 'disabled' : 'active';
		const payload: ApiKeyUpdateFetch['payload'] = { totp_code: otpCode, apiKey: apiKey };
		dispatch(apiKeyUpdateFetch(payload));
		setOtpCode('');
	};

	const copy = (id: string) => {
		const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

		if (copyText) {
			copyText.select();

			document.execCommand('copy');
			(window.getSelection() as any).removeAllRanges(); // tslint:disable-line
		}
	};

	const handleCopy = (id: string, type: string) => {
		copy(id);
		dispatch(alertPush({ message: [`success.api_keys.copied.${type}`], type: 'success' }));
	};

	const handleDeleteKey = () => {
		const payload: ApiKeyDeleteFetch['payload'] = {
			kid: (modal.apiKey && modal.apiKey.kid) || '',
			totp_code: otpCode,
		};
		dispatch(apiKeyDeleteFetch(payload));
		setOtpCode('');
	};

	const handleOtpCodeChange = (value: string) => {
		setOtpCode(value);
	};

	const handleChangeFocusField = () => {
		setCodeFocused(prev => !prev);
	};

	const renderOnClick = () => {
		switch (modal.action) {
			case 'createKey':
				handleCreateKey();
				break;
			case 'createSuccess':
				handleCreateSuccess();
				break;
			case 'updateKey':
				handleUpdateKey();
				break;
			case 'deleteKey':
				handleDeleteKey();
				break;
			default:
				break;
		}
	};

	const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			renderOnClick();
		}
	};

	const renderModalBody = () => {
		/* const secret = (modal && modal.apiKey) ? modal.apiKey.secret : ''; */
		const emailGroupClass = classnames('td-email-form__group', {
			'td-email-form__group--focused': codeFocused,
		});
		let body: JSX.Element | null = null;
		let button: JSX.Element | null = null;
		const isDisabled = !otpCode.match(/.{6}/g);
		switch (modal.action) {
			case 'createKey':
				button = (
					<Button block={true} onClick={handleCreateKey} disabled={isDisabled} size="lg" variant="primary">
						{translate('page.body.profile.apiKeys.modal.btn.create')}
					</Button>
				);
				break;
			case 'createSuccess':
				button = (
					<Button block={true} onClick={handleCreateSuccess} size="lg" variant="primary">
						{translate('page.body.profile.apiKeys.modal.btn.create')}
					</Button>
				);
				body = (
					<div className="td-success-create">
						<div className="td-copyable-text__section">
							<fieldset onClick={() => handleCopy('access-key-id', 'access')}>
								<NewCopyableTextField
									className="td-copyable-text-field__input"
									fieldId={'access-key-id'}
									value={(modal.apiKey && modal.apiKey.kid) || ''}
									copyButtonText={translate('page.body.profile.content.copyLink')}
									label={translate('page.body.profile.apiKeys.modal.access_key')}
								/>
							</fieldset>
						</div>
						<div className="secret-section">
							<span className="secret-sign">&#9888;</span>
							<p className="secret-warning">
								<span>{translate('page.body.profile.apiKeys.modal.secret_key')}</span>
								<br />
								{translate('page.body.profile.apiKeys.modal.secret_key_info')}
								<span> {translate('page.body.profile.apiKeys.modal.secret_key_store')}</span>
							</p>
						</div>
						<div className="td-copyable-text__section">
							<fieldset onClick={() => handleCopy('secret-key-id', 'secret')}>
								<NewCopyableTextField
									className="td-copyable-text-field__input"
									fieldId={'secret_key-id'}
									value={(modal.apiKey && modal.apiKey.secret) || ''}
									copyButtonText={translate('page.body.profile.content.copyLink')}
									label={translate('page.body.profile.apiKeys.modal.secret_key')}
								/>
							</fieldset>
						</div>
						<p className="note-section">
							<span>{translate('page.body.profile.apiKeys.modal.note')} </span>
							<br />
							{translate('page.body.profile.apiKeys.modal.note_content')}
						</p>
						<div className="button-confirmation">{button}</div>
					</div>
				);
				break;
			case 'updateKey':
				button = (
					<Button block={true} onClick={handleUpdateKey} disabled={isDisabled} size="lg" variant="primary">
						{modal.apiKey && modal.apiKey.state === 'active'
							? translate('page.body.profile.apiKeys.modal.btn.disabled')
							: translate('page.body.profile.apiKeys.modal.btn.activate')}
					</Button>
				);
				break;
			case 'deleteKey':
				button = (
					<Button block={true} onClick={handleDeleteKey} disabled={isDisabled} size="lg" variant="primary">
						{translate('page.body.profile.apiKeys.modal.btn.delete')}
					</Button>
				);
				break;
			default:
				break;
		}
		body = !body ? (
			<div className="td-email-form">
				<div className="td-email-form__header">{translate('page.body.profile.apiKeys.modal.title')}</div>
				<div className={emailGroupClass}>
					<CustomInput
						type="number"
						label={translate('page.body.profile.apiKeys.modal.label')}
						placeholder={translate('page.body.profile.apiKeys.modal.placeholder')}
						defaultLabel="2FA code"
						handleChangeInput={handleOtpCodeChange}
						inputValue={otpCode || ''}
						handleFocusInput={handleChangeFocusField}
						classNameLabel="td-email-form__label"
						classNameInput="td-email-form__input"
						autoFocus={true}
						onKeyPress={handleEnterPress}
					/>
				</div>
				<div className="td-email-form__button-wrapper">{button}</div>
			</div>
		) : (
			body
		);

		return <React.Fragment>{body}</React.Fragment>;
	};

	const handleHide2FAModal = () => {
		const payload: ApiKeys2FAModal['payload'] = { active: false };
		dispatch(apiKeys2FAModal(payload));
		setOtpCode('');
	};

	const renderModalHeader = () => {
		return modal.action === 'createSuccess'
			? translate('page.body.profile.apiKeys.modal.created_header')
			: translate('page.body.profile.apiKeys.modal.header');
	};

	const handleCreateKeyClick = () => {
		const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'createKey' };
		dispatch(apiKeys2FAModal(payload));
	};

	return (
		<React.Fragment>
			<div className="td-pg-profile__content__item__header">
				<div className="td-pg-profile__content__item__header__title">My API Keys</div>
				<div className="td-pg-profile__content__item__header__action">
					<button type="button" className="td-pg-profile--radius btn btn-success" onClick={handleCreateKeyClick}>
						Create new
					</button>
				</div>
			</div>
			<div className="td-pg-profile__content__item__content">
				<div className="td-pg-profile__inner">
					<table className="td-pg-profile--color--second td-pg-profile__list-api-key__table">
						<thead>
							<tr>
								{getTableHeaders().map((title, i) => (
									<th key={i}>{title}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{getTableData().map((record, i) => (
								<tr key={i}>
									{record.map((elm, j) => (
										<td key={j}>{elm}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					{!apiKeys.length && <Empty className="pt-3 pb-3" />}
					<Modal
						className="td-pg-profile__modal"
						animation={false}
						show={modal.active}
						onHide={handleHide2FAModal}
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title>{renderModalHeader()}</Modal.Title>
						</Modal.Header>
						<Modal.Body>{renderModalBody()}</Modal.Body>
					</Modal>
				</div>
			</div>
		</React.Fragment>
	);
};

export const ProfileScreen: React.FC = () => {
	useWalletsFetch();

	React.useEffect(() => {
		setDocumentTitle('Profile');
	}, []);

	return (
		<div className="td-pg-profile">
			<ProfileQuickContainer />
			<Container fluid>
				<ActiveStepContainer />
				<div className="td-pg-profile__content">
					<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__activity">
						<ActivityContainer />
					</div>
					<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__security">
						<SecurityContainer />
					</div>
					<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__announcement">
						<AnnouncementContainer />
					</div>
					<Link
						to="/task-center"
						className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__content__item--no-content td-pg-profile__task-center"
					>
						<div className="td-pg-profile__content__item__header">
							<div className="td-pg-profile__content__item__header__title">Task Center</div>
							<div className="td-pg-profile__content__item__header__desc">View tasks to win rewards</div>
							<div className="td-pg-profile__content__item__header__to-page">
								<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M2.01986 0L0.609863 1.41L5.18986 6L0.609863 10.59L2.01986 12L8.01986 6L2.01986 0Z"
										fill="#848E9C"
									/>
								</svg>
							</div>
						</div>
					</Link>
					<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__list-api-key">
						<ApiKeyContainer />
					</div>
				</div>
			</Container>
		</div>
	);
};
