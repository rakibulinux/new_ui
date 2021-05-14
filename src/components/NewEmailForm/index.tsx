import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
import { NewCustomInput } from '../';
import { EMAIL_REGEX } from '../../helpers';
import { StyleEmailForm } from './StyleEmailForm';
// import { selectMobileDeviceState } from '../../modules/public/globalSettings';

export interface NewEmailFormProps {
	title?: string;
	buttonLabel?: string;
	errorMessage?: string;
	isLoading?: boolean;
	OnSubmit: () => void;
	className?: string;
	emailLabel?: string;
	email: string;
	message: string;
	emailError: string;
	emailFocused: boolean;
	placeholder?: string;
	validateForm: () => void;
	handleInputEmail: (value: string) => void;
	handleFieldFocus: () => void;
	handleReturnBack: () => void;
}

const NewEmailForm = React.memo((props: NewEmailFormProps) => {
	const { buttonLabel, isLoading, emailLabel, message, email, emailFocused, emailError } = props;

	// const handleCancel = () => {
	//     props.handleReturnBack();
	// };

	const handleSubmitForm = () => {
		props.OnSubmit();
	};

	const isValidForm = () => {
		const isEmailValid = email.match(EMAIL_REGEX);

		return email && isEmailValid;
	};

	const handleClick = (label?: string, e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (e) {
			e.preventDefault();
		}

		if (!isValidForm()) {
			props.validateForm();
		} else {
			handleSubmitForm();
		}
	};

	const emailGroupClass = cr('cr-email-form__group', {
		'cr-email-form__group--focused': emailFocused,
	});

	return (
		<StyleEmailForm>
			<div className="cr-email-form">
				<div className="cr-email-form__form-content">
					<div className="cr-email-form__header col-12">{message}</div>
					<div className={emailGroupClass}>
						<NewCustomInput
							type="email"
							label={emailLabel || 'Email'}
							placeholder={'Email'}
							defaultLabel="Email"
							handleChangeInput={props.handleInputEmail}
							inputValue={email}
							handleFocusInput={props.handleFieldFocus}
							classNameLabel="cr-email-form__label col-12 success"
							classNameInput="cr-email-form__input  success"
							autoFocus={true}
						/>
						{emailError && <div className="cr-email-form__error">{emailError}</div>}
					</div>
					<div className="col-12 cr-email-form__button-wrapper">
						<Button
							block={true}
							type="button"
							disabled={isLoading || !email.match(EMAIL_REGEX)}
							onClick={e => handleClick(undefined, e)}
							size="lg"
							variant="success"
							className="forgot_password_submit"
						>
							{isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
						</Button>
					</div>
				</div>
			</div>
		</StyleEmailForm>
	);
});

export { NewEmailForm };
