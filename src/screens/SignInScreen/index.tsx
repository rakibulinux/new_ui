import cx from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { SignInComponent, TwoFactorAuth } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import LockIcon from './assets/lock.png';
import {
	RootState,
	selectAlertState,
	selectSignInRequire2FA,
	selectSignUpRequireVerification,
	selectUserFetching,
	selectUserLoggedIn,
	signIn,
	signInError,
	signInRequire2FA,
	signUpRequireVerification,
} from '../../modules';

interface ReduxProps {
	isLoggedIn: boolean;
	loading?: boolean;
	require2FA?: boolean;
	requireEmailVerification?: boolean;
}

interface DispatchProps {
	signIn: typeof signIn;
	signInError: typeof signInError;
	signInRequire2FA: typeof signInRequire2FA;
	signUpRequireVerification: typeof signUpRequireVerification;
}

// interface SignInState {
//     email: string;
//     emailError: string;
//     emailFocused: boolean;
//     password: string;
//     passwordError: string;
//     passwordFocused: boolean;
//     otpCode: string;
//     error2fa: string;
//     codeFocused: boolean;
// }

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

const SignIn: React.FC<Props> = props => {
	const [State, setState] = React.useState({
		email: '',
		emailError: '',
		emailFocused: false,
		password: '',
		passwordError: '',
		passwordFocused: false,
		otpCode: '',
		error2fa: '',
		codeFocused: false,
	});
	React.useEffect(() => {
		setDocumentTitle('Sign In');
		props.signInError({ code: 0, message: [''] });
		props.signUpRequireVerification({ requireVerification: false });
	});

	React.useEffect(() => {
		if (props.isLoggedIn) {
			props.history.push('/wallets');
		}
		if (props.requireEmailVerification) {
			props.history.push('/email-verification', { email: State.email });
		}
	}, []);

	const renderSignInForm = () => {
		const { loading } = props;
		const { email, emailError, emailFocused, password, passwordError, passwordFocused } = State;

		return (
			<div className="group-login  m-auto">
				<div className="title">
					<h3>Log In</h3>
					<p>Please check that you are visiting the correct URL</p>
					<div className="link-web">
						<a href="https://www.cx.finance/" style={{ width: '100%' }}>
							<img src={LockIcon}></img>
							<p>
								<span>https://</span>
								cx.finance
							</p>
						</a>
					</div>
				</div>
				<SignInComponent
					email={email}
					emailError={emailError}
					emailFocused={emailFocused}
					emailPlaceholder={props.intl.formatMessage({ id: 'page.header.signIn.email' })}
					password={password}
					passwordError={passwordError}
					passwordFocused={passwordFocused}
					passwordPlaceholder={props.intl.formatMessage({ id: 'page.header.signIn.password' })}
					labelSignIn={props.intl.formatMessage({ id: 'page.header.signIn' })}
					labelSignUp={props.intl.formatMessage({ id: 'page.header.signUp' })}
					emailLabel={props.intl.formatMessage({ id: 'page.header.signIn.email' })}
					passwordLabel={props.intl.formatMessage({ id: 'page.header.signIn.password' })}
					receiveConfirmationLabel={props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation' })}
					forgotPasswordLabel={props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword' })}
					isLoading={loading}
					onForgotPassword={forgotPassword}
					handleChangeFocusField={handleFieldFocus}
					isFormValid={validateForm}
					refreshError={refreshError}
					changeEmail={handleChangeEmailValue}
					changePassword={handleChangePasswordValue}
				/>
			</div>
		);
	};

	const render2FA = () => {
		const { loading } = props;
		const { otpCode, error2fa, codeFocused } = State;

		return (
			<TwoFactorAuth
				isLoading={loading}
				onSubmit={handle2FASignIn}
				title={props.intl.formatMessage({ id: 'page.password2fa' })}
				label={props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
				buttonLabel={props.intl.formatMessage({ id: 'page.header.signIn' })}
				message={props.intl.formatMessage({ id: 'page.password2fa.message' })}
				codeFocused={codeFocused}
				otpCode={otpCode}
				error={error2fa}
				handleOtpCodeChange={handleChangeOtpCode}
				handleChangeFocusField={handle2faFocus}
				handleClose2fa={handleClose}
			/>
		);
	};

	const refreshError = () => {
		let error = {
			emailError: '',
			passwordError: '',
		};
		setState({ ...error, ...State });
	};

	const handleChangeOtpCode = (value: string) => {
		setState({
			...{ error2fa: '', otpCode: value },
			...State,
		});
	};

	const handle2FASignIn = () => {
		const { email, password, otpCode } = State;

		if (!otpCode) {
			setState({ error2fa: 'Please enter 2fa code', ...State });
		} else {
			props.signIn({
				email,
				password,
				otp_code: otpCode,
			});
		}
	};

	const forgotPassword = () => {
		props.history.push('/forgot_password');
	};

	const handleFieldFocus = (field: string) => {
		switch (field) {
			case 'email':
				setState({
					...State,
					...prev => ({
						emailFocused: !prev.emailFocused,
					}),
				});
				break;
			case 'password':
				setState({
					...State,
					...prev => ({
						passwordFocused: !prev.passwordFocused,
					}),
				});
				break;
			default:
				break;
		}
	};

	const handle2faFocus = () => {
		setState({
			...State,
			...prev => ({
				codeFocused: !prev.codeFocused,
			}),
		});
	};

	const validateForm = () => {
		const { email, password } = State;
		const isEmailValid = email.match(EMAIL_REGEX);

		if (!isEmailValid) {
			setState({
				...{
					emailError: props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
					passwordError: '',
				},
				...State,
			});

			return;
		}
		if (!password) {
			setState({
				...{
					emailError: '',
					passwordError: props.intl.formatMessage({ id: ERROR_EMPTY_PASSWORD }),
				},
				...State,
			});

			return;
		}
	};

	const handleChangeEmailValue = (value: string) => {
		setState({
			...{
				email: value,
			},
			...State,
		});
	};

	const handleChangePasswordValue = (value: string) => {
		setState({
			...{
				password: value,
			},
			...State,
		});
	};

	const handleClose = () => {
		props.signInRequire2FA({ require2fa: false });
	};
	const { loading, require2FA } = props;

	const className = cx({ loading });
	return (
		<div className={className} id="sign-in-screen">
			{require2FA ? render2FA() : renderSignInForm()}
		</div>
	);
};

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	alert: selectAlertState(state),
	isLoggedIn: selectUserLoggedIn(state),
	loading: selectUserFetching(state),
	require2FA: selectSignInRequire2FA(state),
	requireEmailVerification: selectSignUpRequireVerification(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	signIn: data => dispatch(signIn(data)),
	signInError: error => dispatch(signInError(error)),
	signInRequire2FA: payload => dispatch(signInRequire2FA(payload)),
	signUpRequireVerification: data => dispatch(signUpRequireVerification(data)),
});

export const SignInScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
)(SignIn) as React.ComponentClass;
