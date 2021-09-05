import { Button, Checkbox, Form, Input } from 'antd';
import { isEmail, isValidPassword, setDocumentTitle } from 'helpers';
import { History } from 'history';
import { IntlProps } from 'index';
import { GoBackIcon } from 'mobile/assets/icons';
import { Configs, entropyPasswordFetch, LanguageState, RootState, selectConfigs, selectCurrentLanguage, signUp } from 'modules';
import React from 'react';
import isEqual from 'react-fast-compare';
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { GeetestCaptcha } from './../../../containers/GeetestCaptcha/index';
import {
	selectCurrentPasswordEntropy,
	selectSignUpError,
	selectSignUpRequireVerification,
} from './../../../modules/user/auth/selectors';

const RenderCapchaComponent: React.FC<{
	renderCapcha: JSX.Element | null;
}> = ({ renderCapcha }) => {
	return <>{renderCapcha}</>;
};

const RenderCapcha = React.memo(RenderCapchaComponent, isEqual);
interface ReduxProps {
	configs: Configs;
	requireVerification?: boolean;
	loading?: boolean;
	currentPasswordEntropy: number;
}

interface DispatchProps {
	signUp: typeof signUp;
	fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

interface RouterProps {
	location: {
		search: string;
	};
	history: History;
}

interface OwnProps {
	signUpError: boolean;
	i18n: LanguageState['lang'];
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;
interface FormRegisterState {
	email: string | null;
	pass: string | null;
	confirm: string | null;
	isCheckTerms: boolean;
	statusCapcha: boolean;
	refId: string | null;
	shouldGeetestReset: boolean;
}

class FormRegister extends React.Component<Props, FormRegisterState> {
	public readonly state: FormRegisterState = {
		email: null,
		pass: null,
		confirm: null,
		isCheckTerms: false,
		statusCapcha: false,
		refId: null,
		shouldGeetestReset: false,
	};

	public constructor(props) {
		super(props);
		this.reCaptchaRef = React.createRef();
		this.geetestCaptchaRef = React.createRef();
	}

	private reCaptchaRef: React.RefObject<ReCAPTCHA>;
	private geetestCaptchaRef: React.RefObject<ReCAPTCHA>;

	public componentDidMount() {
		setDocumentTitle('Sign Up');
		const localReferralCode = localStorage.getItem('referralCode');
		const refId = this.extractRefIDs(this.props.location.search);
		const referralCode = refId || localReferralCode || '';
		this.setState({
			refId: referralCode,
		});
		if (refId && refId !== localReferralCode) {
			localStorage.setItem('referralCode', referralCode);
		}
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { email } = this.state;

		if (nextProps.requireVerification) {
			nextProps.history.push('/email-verification', { email: email });
		}

		if (nextProps.signUpError) {
			if (this.reCaptchaRef.current) {
				this.reCaptchaRef.current.reset();
			}

			if (this.geetestCaptchaRef.current) {
				this.setState({ shouldGeetestReset: true });
			}
		}
	}

	public render() {
		const { history, configs } = this.props;
		const { email, pass, confirm, isCheckTerms, refId, statusCapcha, shouldGeetestReset } = this.state;

		const canSubmit = () => {
			const checkCaptcha = () => {
				switch (configs.captcha_type) {
					case 'recaptcha':
						return statusCapcha;
					case 'geetest':
						return !shouldGeetestReset;
					default:
						return true;
				}
			};

			return (
				email !== null &&
				isEmail(email) &&
				pass !== null &&
				isValidPassword(pass) &&
				pass === confirm &&
				isCheckTerms &&
				checkCaptcha()
			);
		};

		return (
			<div className="td-mobile-screen-signup">
				<div className="td-mobile-screen-signup__header">
					<GoBackIcon onClick={() => history.goBack()} />
				</div>
				<div className="td-mobile-screen-signup__body">
					<Form className="td-mobile-screen-signup__body__form w-100" layout="vertical" onFinish={this.onSubmit}>
						<h4 className="td-mobile-screen-signup__body__form__title">Create a free account</h4>
						<span className="td-mobile-screen-signup__body__form__description">Welcome to CiRCLEEX</span>
						<Form.Item
							className="td-mobile-screen-signup__body__form__label"
							label="Email"
							name="email"
							hasFeedback
							help={email !== null && !isEmail(email) ? 'Email invalid!' : undefined}
							validateStatus={email === null ? '' : isEmail(email) ? 'success' : 'error'}
						>
							<Input
								className="td-mobile-screen-signup__body__form__label__input"
								value={email || ''}
								placeholder="Enter your email"
								onChange={e =>
									this.setState({
										email: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-signup__body__form__label"
							label="Password"
							name="password"
							hasFeedback
							help={
								pass !== null && !isValidPassword(pass)
									? 'Pass must have at least 1 digit, 1 upper and 1 lower.'
									: undefined
							}
							validateStatus={pass === null ? '' : isValidPassword(pass) ? 'success' : 'error'}
						>
							<Input.Password
								className="td-mobile-screen-signup__body__form__label__input"
								value={pass || ''}
								placeholder="Enter your password"
								onChange={e =>
									this.setState({
										pass: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-signup__body__form__label"
							label="Confirm password"
							name="confirm"
							hasFeedback
							help={confirm !== null && confirm !== pass ? 'Confirm password does not same' : undefined}
							validateStatus={confirm === null ? '' : confirm !== pass ? 'error' : 'success'}
						>
							<Input.Password
								className="td-mobile-screen-signup__body__form__label__input"
								value={confirm || ''}
								placeholder="Confirm password"
								onChange={e =>
									this.setState({
										confirm: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-signup__body__form__label"
							label="Referral Code: (Optional)"
							name="referral_code"
						>
							<Input
								className="td-mobile-screen-signup__body__form__label__input"
								value={refId || ''}
								placeholder={refId ? `Your referral code: ${refId}` : 'Enter referral code'}
								onChange={e =>
									this.setState({
										refId: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item name="remember" valuePropName="checked">
							<Checkbox
								className="td-mobile-screen-signup__body__form__checkbox"
								value={isCheckTerms}
								onChange={e =>
									this.setState({
										isCheckTerms: e.target.checked,
									})
								}
							>
								I have read and agree to the Terms of service{' '}
							</Checkbox>
						</Form.Item>

						<div className="td-mobile-screen-signup__body__form__recaptcha">
							<RenderCapcha renderCapcha={this.renderRecapcha()} />
						</div>

						<Form.Item className="td-mobile-screen-signup__body__form__submit">
							<Button
								className="td-mobile-screen-signup__body__form__submit__btn"
								htmlType="submit"
								type="primary"
								disabled={!canSubmit()}
							>
								Sign Up
							</Button>
						</Form.Item>

						<div className="td-mobile-screen-signup__body__form__to-login">
							<span>Already registered?</span>{' '}
							<Link className="td-mobile-screen-signup__body__form__to-login__link" to="/signin">
								Log In
							</Link>
						</div>
					</Form>
				</div>
				<div className="td-mobile-screen-signup__footer">© 2020 - 2021 CiRCLEEX.com. All rights reserved</div>
			</div>
		);
	}

	private handleReCaptchaSuccess: ReCAPTCHAProps['onChange'] = () => {
		this.setState({
			statusCapcha: true,
		});
	};

	private handleGeetestCaptchaSuccess = () => {
		this.setState({
			shouldGeetestReset: false,
		});
	};

	private renderRecapcha = () => {
		const { configs } = this.props;
		const { shouldGeetestReset } = this.state;

		switch (configs.captcha_type) {
			case 'recaptcha':
				if (configs.captcha_id) {
					return (
						<ReCAPTCHA
							theme="dark"
							ref={this.reCaptchaRef}
							sitekey={String(configs.captcha_id)}
							onChange={this.handleReCaptchaSuccess}
						/>
					);
				}
				return null;
			case 'geetest':
				return (
					<GeetestCaptcha
						ref={() => this.geetestCaptchaRef}
						shouldCaptchaReset={shouldGeetestReset}
						onSuccess={this.handleGeetestCaptchaSuccess}
					/>
				);
			default:
				return null;
		}
	};

	private onSubmit = (value: any) => {
		const { refId, email, pass } = this.state;
		const { i18n } = this.props;
		if (refId) {
			this.props.signUp({
				email: email || '',
				password: pass || '',
				data: JSON.stringify({
					language: i18n,
				}),
				refid: refId,
			});
		} else {
			this.props.signUp({
				email: email || '',
				password: pass || '',
				data: JSON.stringify({
					language: i18n,
				}),
			});
		}

		if (this.reCaptchaRef.current) {
			this.reCaptchaRef.current.reset();
		}
		if (this.geetestCaptchaRef.current) {
			this.setState({
				shouldGeetestReset: true,
			});
		}
		this.setState({
			statusCapcha: false,
		});
	};

	private extractRefIDs = (url: string) => new URLSearchParams(url).get('refid');
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	configs: selectConfigs(state),
	i18n: selectCurrentLanguage(state),
	requireVerification: selectSignUpRequireVerification(state),
	signUpError: selectSignUpError(state),
	currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	signUp: credentials => dispatch(signUp(credentials)),
	fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
});

export const NewSignUpMobileScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
)(FormRegister) as React.ComponentClass;
