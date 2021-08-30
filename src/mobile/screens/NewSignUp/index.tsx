import { Button, Checkbox, Form, Input } from 'antd';
import { isEmail, isValidPassword } from 'helpers';
import { useDocumentTitle } from 'hooks';
import { GoBackIcon } from 'mobile/assets/icons';
import { selectConfigs, selectCurrentLanguage, signUp } from 'modules';
import React, { FC, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { GeetestCaptcha } from './../../../containers/GeetestCaptcha/index';
import { selectSignUpError, selectSignUpRequireVerification } from './../../../modules/user/auth/selectors';

const NewSignUpMobileComponent: FC = () => {
	useDocumentTitle('Sign Up');
	const history = useHistory();
	const dispatch = useDispatch();
	const i18n = useSelector(selectCurrentLanguage, isEqual);
	const configs = useSelector(selectConfigs, isEqual);
	const signUpError = useSelector(selectSignUpError, isEqual);
	const requireVerification = useSelector(selectSignUpRequireVerification, isEqual);

	const [email, setEmail] = useState<string | null>(null);
	const [pass, setPass] = useState<string | null>(null);
	const [confirm, setConfirm] = useState<string | null>(null);
	const [isCheckTerms, setIsCheckTerms] = useState<boolean>(false);
	const [statusCapcha, setStatusCapcha] = useState<boolean>(false);
	const [refID, setRefID] = useState<string | null>(null);
	const [shouldGeetestReset, setShouldGeetestReset] = useState<boolean>(false);
	const reCaptchaRef = React.createRef<ReCAPTCHA>();
	const geetestCaptchaRef = React.createRef<ReCAPTCHA>();

	useEffect(() => {
		if (signUpError) {
			if (reCaptchaRef.current) {
				reCaptchaRef.current.reset();
			}

			if (geetestCaptchaRef.current) {
				setShouldGeetestReset(true);
			}
		}
	}, [signUpError]);

	React.useEffect(() => {
		if (requireVerification) {
			history.push('/email-verification', { email: email });
		}
	}, [requireVerification]);

	const extractRefIDs = (url: string) => new URLSearchParams(url).get('refid');

	useEffect(() => {
		const refId = extractRefIDs(window.location.search);
		setRefID(refId);
	}, []);

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

	const onSubmit = (value: any) => {
		if (refID) {
			dispatch(
				signUp({
					email: email || '',
					password: pass || '',
					data: JSON.stringify({
						language: i18n,
					}),
					refid: refID,
				}),
			);
		} else {
			dispatch(
				signUp({
					email: email || '',
					password: pass || '',
					data: JSON.stringify({
						language: i18n,
					}),
				}),
			);
		}

		if (reCaptchaRef.current) {
			reCaptchaRef.current.reset();
		}
		if (geetestCaptchaRef.current) {
			setShouldGeetestReset(true);
		}
		setStatusCapcha(false);
	};

	const handleReCaptchaSuccess: ReCAPTCHAProps['onChange'] = () => {
		setStatusCapcha(true);
	};

	const handleGeetestCaptchaSuccess = value => {
		setShouldGeetestReset(false);
	};

	const RenderRecapcha = () => {
		switch (configs.captcha_type) {
			case 'recaptcha':
				if (configs.captcha_id) {
					return (
						<ReCAPTCHA
							theme="dark"
							ref={reCaptchaRef}
							sitekey={String(configs.captcha_id)}
							onChange={handleReCaptchaSuccess}
						/>
					);
				}
				return null;
			case 'geetest':
				return (
					<GeetestCaptcha
						ref={() => geetestCaptchaRef}
						shouldCaptchaReset={shouldGeetestReset}
						onSuccess={handleGeetestCaptchaSuccess}
					/>
				);
			default:
				return null;
		}
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-screen-signup__body__form w-100" layout="vertical" onFinish={onSubmit}>
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
						onChange={e => setEmail(e.target.value)}
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
						onChange={e => setPass(e.target.value)}
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
						onChange={e => setConfirm(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-screen-signup__body__form__label"
					label="Referral Code: (Optional)"
					name="referral_code"
				>
					<Input
						className="td-mobile-screen-signup__body__form__label__input"
						value={refID || ''}
						placeholder={refID ? `Your referral code: ${refID}` : 'Enter referral code'}
						onChange={e => setRefID(e.target.value)}
					/>
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked">
					<Checkbox
						className="td-mobile-screen-signup__body__form__checkbox"
						value={isCheckTerms}
						onChange={e => setIsCheckTerms(e.target.checked)}
					>
						I have read and agree to the Terms of service{' '}
					</Checkbox>
				</Form.Item>

				<div className="td-mobile-screen-signup__body__form__recaptcha">
					<RenderRecapcha />
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
		);
	};

	return (
		<div className="td-mobile-screen-signup">
			<div className="td-mobile-screen-signup__header">
				<GoBackIcon onClick={() => history.goBack()} />
			</div>
			<div className="td-mobile-screen-signup__body">{renderForm()}</div>
			<div className="td-mobile-screen-signup__footer">© 2020 - 2021 CiRCLEEX.com. All rights reserved</div>
		</div>
	);
};

export const NewSignUpMobileScreen = React.memo(NewSignUpMobileComponent, isEqual);
