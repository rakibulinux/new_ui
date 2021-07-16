import classnames from 'classnames';
import * as React from 'react';

export interface SummaryFieldProps {
	/**
	 * Additional class name for styling. By default element receives `td-input` class
	 * @default empty
	 */
	className?: string;
	/**
	 * The string to use as the label for the SummaryField.
	 */
	message: string;
	/**
	 * Content will be displayed instead of amount and currency, if it is necessary
	 */
	content: JSX.Element;
}

/**
 * Component to display currency amount with specific label.
 */
export const SummaryField: React.FunctionComponent<SummaryFieldProps> = props => {
	const { message, className, content } = props;
	const cx = classnames('td-summary-field', className);

	return (
		<div className={cx}>
			<span className="td-summary-field-message">{message}</span>
			<span className="td-summary-field-content">{content}</span>
		</div>
	);
};
