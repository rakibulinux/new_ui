import { Button, Checkbox, Form, Input } from 'antd';
import { isEmail, isValidPassword } from 'helpers';
import { useDocumentTitle } from 'hooks';
import { GoBackIcon } from 'mobile/assets/icons';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

export const NewSignUpMobileScreen: FC = () => {
	useDocumentTitle('Sign Up');

	const onSubmit = (value: any) => {
		// tslint:disable-next-line: no-console
		console.log(value);
	};

	const [email, setEmail] = useState<string | null>(null);
	const [pass, setPass] = useState<string | null>(null);
	const [confirm, setConfirm] = useState<string | null>(null);
	const [isCheckTerms, setIsCheckTerms] = useState<boolean>(false);

	const canSubmit = () => {
		return email !== null && isEmail(email) && pass !== null && isValidPassword(pass) && pass === confirm && isCheckTerms;
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-signup__body__form" layout="vertical" onFinish={onSubmit}>
				<h3 className="td-mobile-signup__body__form__title">Create a free account</h3>
				<h4 className="td-mobile-signup__body__form__description">Welcome to CiRCLEEX</h4>
				<Form.Item
					className="td-mobile-signup__body__form__label"
					label="Email"
					name="email"
					hasFeedback
					help={email !== null && !isEmail(email) ? 'Email invalid!' : undefined}
					validateStatus={email === null ? '' : isEmail(email) ? 'success' : 'error'}
				>
					<Input
						className="td-mobile-signup__body__form__label__input"
						value={email || ''}
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-signup__body__form__label"
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
						className="td-mobile-signup__body__form__label__input"
						value={pass || ''}
						onChange={e => setPass(e.target.value)}
					/>
				</Form.Item>

				<Form.Item
					className="td-mobile-signup__body__form__label"
					label="Confirm password"
					name="confirm"
					hasFeedback
					help={confirm !== null && confirm !== pass ? 'Confirm password does not same' : undefined}
					validateStatus={confirm === null ? '' : confirm !== pass ? 'error' : 'success'}
				>
					<Input.Password
						className="td-mobile-signup__body__form__label__input"
						value={confirm || ''}
						onChange={e => setConfirm(e.target.value)}
					/>
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked">
					<Checkbox
						className="td-mobile-signup__body__form__checkbox"
						value={isCheckTerms}
						onChange={e => setIsCheckTerms(e.target.checked)}
					>
						I have read and agree to the Terms of service{' '}
					</Checkbox>
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

				<div className="td-mobile-signup__body__form__to-login">
					<span>Already registered?</span>{' '}
					<Link className="td-mobile-signup__body__form__to-login__link" to="/signin">
						Log In
					</Link>
				</div>
			</Form>
		);
	};

	return (
		<div className="td-mobile-signup">
			<div className="td-mobile-signup__header">
				<GoBackIcon />
			</div>
			<div className="td-mobile-signup__body">{renderForm()}</div>
			<div className="td-mobile-signup__footer">© 2017 - 2021 CiRCLEEX.com. All rights reserved</div>
		</div>
	);
};
