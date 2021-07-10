import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalWithdrawConfirmProps {
	amount: string;
	currency: string;
	onSubmit: () => void;
	onDismiss: () => void;
	rid: string;
	isMobileDevice?: boolean;
	show: boolean;
	ethBallance?: string;
	selectedWalletFee?: number;
	ethFee?: number;
}

export const ModalWithdrawConfirm = (props: ModalWithdrawConfirmProps) => {
	const { onSubmit, onDismiss, amount, show } = props;
	return (
		<Modal
			show={show}
			onHide={onDismiss}
			className="withdraw-confirm__modal"
			animation={true}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title>Confirmation</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					You will receive {amount} BTC on address <code>1MM67SnmHrRcuRtbQunU2HUkembjxuzrgD</code>
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onDismiss}>
					Close
				</Button>
				<Button variant="primary" onClick={onSubmit}>
					Withdraw
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
