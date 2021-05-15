import cr from 'classnames';
import * as React from 'react';
// import { useIntl } from 'react-intl';
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { NewCustomInput } from '../';
import { EMAIL_REGEX } from '../../helpers';
// import { selectMobileDeviceState } from '../../modules/public/globalSettings';

export interface NewSignInProps {
	labelSignIn?: string;
	labelSignUp?: string;
	emailLabel?: string;
	passwordLabel?: string;
	receiveConfirmationLabel?: string;
	forgotPasswordLabel?: string;
	isLoading?: boolean;
	title?: string;
	onForgotPassword: (email?: string) => void;
	onConfirmationResend?: (email?: string) => void;

	className?: string;
	image?: string;
	email: string;
	emailError: string;
	password: string;
	passwordError: string;
	emailFocused: boolean;
	emailPlaceholder: string;
	passwordFocused: boolean;
	passwordPlaceholder: string;
	isFormValid: () => void;
	refreshError: () => void;
	handleChangeFocusField: (value: string) => void;
	changePassword: (value: string) => void;
	changeEmail: (value: string) => void;
}

const NewLogin = React.memo((props: NewSignInProps) => {
	// const isMobileDevice = useSelector(selectMobileDeviceState);
	const history = useHistory();
	// const intl = useIntl();
	const isValidForm = () => {
		const isEmailValid = props.email.match(EMAIL_REGEX);

		return props.email && isEmailValid && props.password;
	};

	const handleChangeEmail = (value: string) => {
		props.changeEmail(value);
	};

	const handleChangePassword = (value: string) => {
		props.changePassword(value);
	};

	const handleFieldFocus = (field: string) => {
		props.handleChangeFocusField(field);
	};

	const handleSubmitForm = () => {
		props.refreshError();
	};

	const handleValidateForm = () => {
		props.isFormValid();
	};

	const handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
		if (e) {
			e.preventDefault();
		}
		if (!isValidForm()) {
			handleValidateForm();
		} else {
			handleSubmitForm();
		}
	};

	const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();

			handleClick();
		}
	};

	const {
		email,
		emailError,
		emailPlaceholder,
		password,
		passwordError,
		passwordPlaceholder,
		isLoading,
		// onSignUp,
		// image,
		// labelSignIn,
		// labelSignUp,
		emailLabel,
		passwordLabel,
		emailFocused,
		passwordFocused,
	} = props;
	const emailGroupClass = cr('cr-sign-in-form_group', {
		'cr-sign-in-form__group--focused': emailFocused,
	});
	const passwordGroupClass = cr('cr-sign-in-form_group', {
		'cr-sign-in-form_group--focused': passwordFocused,
	});

	return (
		<>
			<form>
				<div className="form-group" onKeyPress={handleEnterPress}>
					<div className="form-input-login">
						<div className={emailGroupClass}>
							<NewCustomInput
								type="email"
								label={emailLabel || 'Email'}
								placeholder={emailPlaceholder}
								defaultLabel="Email"
								handleChangeInput={handleChangeEmail}
								inputValue={email}
								handleFocusInput={() => handleFieldFocus('email')}
								classNameLabel="col-12"
								autoFocus={true}
								openInput={true}
							/>
							{emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
						</div>
						<div className={passwordGroupClass}>
							<NewCustomInput
								type="password"
								label={passwordLabel || 'Password'}
								placeholder={passwordPlaceholder}
								defaultLabel="Password"
								handleChangeInput={handleChangePassword}
								inputValue={password}
								handleFocusInput={() => handleFieldFocus('password')}
								classNameLabel="col-12 mt-4"
								autoFocus={false}
								openInput={true}
							/>
							{passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
						</div>

						<div className="col-12 mt-5">
							<button type="submit" className=" btn btn-success">
								{isLoading ? 'Loading...' : 'Sign in'}
							</button>
						</div>
					</div>
				</div>
			</form>
			<div className="bottom-section mt-4">
				<div
					className="forgot-password"
					onClick={() => {
						props.onForgotPassword(email);
					}}
				>
					Forgot Password
				</div>
				<div className="register" onClick={() => history.push('/register')}>
					Free Registration
					{/* {intl.formatMessage({ id: 'page.body.landing.header.button3' })} */}
				</div>
			</div>
		</>
	);
});

export { NewLogin };
