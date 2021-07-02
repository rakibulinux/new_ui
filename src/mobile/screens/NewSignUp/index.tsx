import { Button, Checkbox, Form, Input } from 'antd';
import { useDocumentTitle } from 'hooks';
import { GoBackIcon } from 'mobile/assets/icons';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const NewSignUpMobileScreen: FC = () => {
	useDocumentTitle('Sign Up');

	const renderFrom = () => {
		return (
			<Form className="td-mobile-signup__body__form" layout="vertical">
				<h3 className="td-mobile-signup__body__form__title">Create a free account</h3>
				<h4 className="td-mobile-signup__body__form__description">Welcome to CiRCLEEX</h4>
				<Form.Item
					className="td-mobile-signup__body__form__label"
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Please input your username!',
						},
					]}
				>
					<Input className="td-mobile-signup__body__form__label__input" />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}
				>
					<Input.Password className="td-mobile-signup__body__form__label__input" />
				</Form.Item>

				<Form.Item
					label="Confirm password"
					name="confirm"
					rules={[
						{
							required: true,
							message: 'Please input your password!',
						},
					]}
				>
					<Input.Password className="td-mobile-signup__body__form__label__input" />
				</Form.Item>

				<Form.Item name="remember" valuePropName="checked">
					<Checkbox className="td-mobile-signup__body__form__checkbox">
						I have read and agree to the Terms of service{' '}
					</Checkbox>
				</Form.Item>

				<Button className="td-mobile-signup__body__form__submit" htmlType="submit" type="primary">
					Submit
				</Button>

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
			<div className="td-mobile-signup__body">{renderFrom()}</div>
			<div className="td-mobile-signup__footer">© 2017 - 2021 CiRCLEEX.com. All rights reserved</div>
		</div>
	);
};
