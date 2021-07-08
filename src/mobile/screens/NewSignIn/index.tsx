import { Button, Form, Input } from 'antd';
import { isEmail } from 'helpers';
import { useDocumentTitle } from 'hooks';
import { GoBackIcon } from 'mobile/assets/icons';
import { signIn } from 'modules';
import React, { FC, useState } from 'react';
import { ReCAPTCHA } from 'react-google-recaptcha';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const DEFAULT_SITE_KEY = '6Le3nn0bAAAAAOB3AsqWxjSh-WsGfbqB5GRPcecg';

export const NewSignInMobileScreen: FC = () => {
	useDocumentTitle('Sign In');
	const history = useHistory();
	const dispatch = useDispatch();

	const [email, setEmail] = useState<string | null>(null);
	const [pass, setPass] = useState<string | null>(null);
	const [statusCapcha, setStatusCapcha] = useState<boolean>(false);

	const onSubmit = (value: any) => {
		const dataFormLogin = {
			email: email || '',
			password: pass || '',
		};
		dispatch(signIn(dataFormLogin));
	};

	const canSubmit = (): boolean => {
		return email !== null && pass !== null && pass !== '' && isEmail(email) && statusCapcha;
	};

	const onCapcha = value => {
		if (value === null) {
			setStatusCapcha(true);
		}
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-pg-signin__body__form w-100" layout="vertical" onFinish={onSubmit}>
				<h4 className="td-mobile-pg-signin__body__form__title">Log In</h4>
				<span className="td-mobile-pg-signin__body__form__description">
					Please check that you are visiting the correct URL
				</span>
				<div className="td-mobile-pg-signin__body__form__site">
					<div className="td-mobile-pg-signin__body__form__site__lock">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-1mb79dz">
							<path
								d="M16.27 10.5V8.07C16.27 5.82 14.45 4 12.2 4S8.13 5.82 8.13 8.07v2.43H6v8.94h12.43V10.5h-2.16zm-3.07 6.46h-2v-4h2v4zm1.07-6.46h-4.14V8.07c0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07v2.43z"
								fill="currentColor"
							></path>
						</svg>
					</div>
					<div className="td-mobile-pg-signin__body__form__site__name">
						<span>https://</span>
						www.cx.finance
					</div>
				</div>
				<Form.Item
					className="td-mobile-pg-signin__body__form__label"
					label="Email"
					name="email"
					hasFeedback
					help={email !== null && !isEmail(email) ? 'Email invalid!' : undefined}
					validateStatus={email === null ? '' : isEmail(email) ? 'success' : 'error'}
				>
					<Input
						className="td-mobile-pg-signin__body__form__label__input"
						value={email || ''}
						placeholder="Enter your email"
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-pg-signin__body__form__label mb-4"
					label="Password"
					name="password"
					hasFeedback
					help={pass === '' ? 'Please input something' : undefined}
					validateStatus={pass === '' ? 'error' : ''}
				>
					<Input.Password
						className="td-mobile-pg-signin__body__form__label__input"
						value={pass || ''}
						placeholder="Enter your password"
						onChange={e => setPass(e.target.value)}
					/>
				</Form.Item>

				<div>
					<ReCAPTCHA sitekey={DEFAULT_SITE_KEY} theme="light" onChange={onCapcha} />
				</div>

				<Form.Item className="td-mobile-pg-signup__body__form__submit">
					<Button
						className="td-mobile-pg-signup__body__form__submit__btn"
						htmlType="submit"
						type="primary"
						disabled={!canSubmit()}
					>
						Sign In
					</Button>
				</Form.Item>

				<div className="td-mobile-pg-signin__body__form__links">
					<Link to="/forgot_password">Forgot Password</Link>
					<Link to="/signup">Free registration</Link>
				</div>
			</Form>
		);
	};

	return (
		<div>
			<div className="td-mobile-pg-signin">
				<div className="td-mobile-pg-signin__header">
					<GoBackIcon onClick={() => history.goBack()} />
				</div>
				<div className="td-mobile-pg-signin__body">{renderForm()}</div>
				<div className="td-mobile-pg-signin__footer">© 2020 - 2021 CiRCLEEX.com. All rights reserved</div>
			</div>
		</div>
	);
};
