import { Button, Form, Input } from 'antd';
import { isEmail } from 'helpers';
import { GoBackIcon } from 'mobile/assets/icons';
import { forgotPassword } from 'modules';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const NewForgotPasswordScreen = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');

	const canSubmit = (): boolean => {
		return isEmail(email);
	};

	const onSubmit = () => {
		dispatch(forgotPassword({ email }));
	};

	const renderForm = () => {
		return (
			<Form className="td-mobile-screen-forgot-password__body__form w-100" layout="vertical" onFinish={onSubmit}>
				<div className="td-mobile-screen-forgot-password__body__form__title">
					<div className="td-mobile-screen-forgot-password__body__form__title__icon">
						<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M7.5 11.5H9.16667V13.1667H7.5V11.5ZM7.5 4.83335H9.16667V9.83335H7.5V4.83335ZM8.325 0.666687C3.725 0.666687 0 4.40002 0 9.00002C0 13.6 3.725 17.3334 8.325 17.3334C12.9333 17.3334 16.6667 13.6 16.6667 9.00002C16.6667 4.40002 12.9333 0.666687 8.325 0.666687ZM8.33333 15.6667C4.65 15.6667 1.66667 12.6834 1.66667 9.00002C1.66667 5.31669 4.65 2.33335 8.33333 2.33335C12.0167 2.33335 15 5.31669 15 9.00002C15 12.6834 12.0167 15.6667 8.33333 15.6667Z"
								fill="#2FB67E"
							/>
						</svg>
					</div>
					<div className="td-mobile-screen-forgot-password__body__form__title__desc">
						For security purposes, no withdrawals are permitted for 24 hours after modification of security methods.
					</div>
				</div>

				<Form.Item
					className="td-mobile-screen-forgot-password__body__form__label"
					label="Email"
					name="email"
					hasFeedback
					help={email !== '' && !isEmail(email) ? 'Email invalid!' : undefined}
					validateStatus={email === '' ? '' : isEmail(email) ? 'success' : 'error'}
				>
					<Input
						className="td-mobile-screen-forgot-password__body__form__label__input"
						value={email || ''}
						placeholder="Enter your email"
						onChange={e => setEmail(e.target.value)}
					/>
				</Form.Item>

				<Form.Item className="td-mobile-screen-forgot-password__body__form__submit">
					<Button
						className="td-mobile-screen-forgot-password__body__form__submit__btn"
						htmlType="submit"
						type="primary"
						disabled={!canSubmit()}
					>
						Next
					</Button>
				</Form.Item>
			</Form>
		);
	};

	return (
		<div className="td-mobile-screen-forgot-password">
			<div className="td-mobile-screen-forgot-password__header">
				<GoBackIcon onClick={() => history.goBack()} />
			</div>

			<div className="td-mobile-screen-forgot-password__body">{renderForm()}</div>

			<div className="td-mobile-screen-forgot-password__footer">© 2020 - 2021 CiRCLEEX.com. All rights reserved</div>
		</div>
	);
};
