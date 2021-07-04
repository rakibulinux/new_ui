import { Button, Form, Input } from 'antd';
import { isEmail } from 'helpers';
import { GoBackIcon } from 'mobile/assets/icons';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

export const NewSignInMobileScreen: FC = () => {
	const [email, setEmail] = useState<string | null>(null);
	const [pass, setPass] = useState<string | null>(null);

	const onSubmit = (value: any) => {
		// tslint:disable-next-line: no-console
		console.log(value);
	};

	const canSubmit = (): boolean => {
		return email !== null && pass !== null && pass !== '' && isEmail(email);
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-signin__body__form" layout="vertical" onFinish={onSubmit}>
				<h3 className="td-mobile-signin__body__form__title">Log In</h3>
				<h4 className="td-mobile-signin__body__form__description">Please check that you are visiting the correct URL</h4>

				<Form.Item
					className="td-mobile-signin__body__form__label"
					label="Email"
					name="email"
					hasFeedback
					help={email !== null && !isEmail(email) ? 'Email invalid!' : undefined}
					validateStatus={email === null ? '' : isEmail(email) ? 'success' : 'error'}
				>
					<Input
						className="td-mobile-signin__body__form__label__input"
						value={email || ''}
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-signin__body__form__label"
					label="Password"
					name="password"
					hasFeedback
					help={pass === '' ? 'Please input something' : ''}
					validateStatus={pass === '' ? 'error' : ''}
				>
					<Input.Password
						className="td-mobile-signin__body__form__label__input"
						value={pass || ''}
						onChange={e => setPass(e.target.value)}
					/>
				</Form.Item>

				<Form.Item className="td-mobile-signup__body__form__submit">
					<Button
						className="td-mobile-signup__body__form__submit__btn"
						htmlType="submit"
						type="primary"
						disabled={!canSubmit()}
					>
						Submit
					</Button>
				</Form.Item>

				<div className="td-mobile-signin__body__form__links">
					<Link to="/forgot_password">Forgot Password</Link>
					<Link to="/#">Scan to login</Link>
					<Link to="/signup">Free registration</Link>
				</div>
			</Form>
		);
	};

	return (
		<div>
			<div className="td-mobile-signin">
				<div className="td-mobile-signin__header">
					<GoBackIcon />
				</div>
				<div className="td-mobile-signin__body">{renderForm()}</div>
				<div className="td-mobile-signin__footer">© 2017 - 2021 CiRCLEEX.com. All rights reserved</div>
			</div>
		</div>
	);
};
