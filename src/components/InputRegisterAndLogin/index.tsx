import * as React from 'react';
import openInputIcon from './assets/dropdown.jpg';

export interface InputRegisterAndLoginProps {
	className?: string;
	type: string;
	label: string;
	defaultLabel: string;
	handleChangeInput?: (value: string) => void;
	inputValue: string | number;
	handleFocusInput?: () => void;
	placeholder: string;
	classNameLabel?: string;
	classNameInput?: string;
	autoFocus?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	id?: string;
	handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
	isDisabled?: boolean;
	labelVisible?: boolean;
	openInput?: boolean | undefined;
	isInvalid?: boolean;
}

interface OnChangeEvent {
	target: {
		value: string;
	};
}
type Props = InputRegisterAndLoginProps;

const InputRegisterAndLogin: React.FC<Props> = props => {
	const handleChangeValue = (e: OnChangeEvent) => {
		props.handleChangeInput && props.handleChangeInput(e.target.value);
	};

	const [enableInput, setenableInput] = React.useState(true);

	const handleClickOpenInput = () => {
		if (props.openInput) setenableInput(!enableInput);
	};
	return (
		<div id="custom-input" className={props.className || ''}>
			<label
				htmlFor="email"
				className={props.classNameLabel}
				onClick={() => {
					handleClickOpenInput();
				}}
			>
				{props.label}
				{props.openInput ? <img src={openInputIcon} className="toggle-input" /> : ''}
				{(props.labelVisible || '') && (props.label || props.defaultLabel)}
			</label>
			{enableInput ? (
				<div className="col-12">
					<input
						className={'form-control form-input' || props.classNameInput}
						name="email"
						required
						type={props.type.toString()}
						// value={props.inputValue.toString()}
						placeholder={props.placeholder}
						autoFocus={props.autoFocus}
						onFocus={props.handleFocusInput}
						onBlur={props.handleFocusInput}
						onChange={e => handleChangeValue(e)}
						readOnly={props.readOnly}
						id={props.id}
						onClick={props.handleClick}
						disabled={props.isDisabled}
						onKeyPress={props.onKeyPress}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
export { InputRegisterAndLogin };
