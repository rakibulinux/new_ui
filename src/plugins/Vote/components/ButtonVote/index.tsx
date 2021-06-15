import { alertPush, selectUserInfo, selectUserLoggedIn, selectWallets, voteDonateCreate } from 'modules';
import * as constants from 'plugins/constants/vote';
import * as React from 'react';
import { Button, Form, FormControlProps, Overlay, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ImPlus } from 'react-icons/im';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface ButtonVoteProps {
	quantity: number;
	idKey: number;
	id: string;
}

export const ButtonVote: React.FC<ButtonVoteProps> = props => {
	const { quantity, id } = props;
	const dispatch = useDispatch();
	const intl = useIntl();
	const userLoggedIn = useSelector(selectUserLoggedIn, isEqual);
	const wallet = useSelector(selectWallets, isEqual).find(
		walletParam => walletParam.currency === constants.VOTE_CURRENCIE.toLowerCase(),
	);
	const user = useSelector(selectUserInfo, isEqual);
	const [show, setShow] = React.useState(false);
	const [amount, setAmount] = React.useState<number>();
	const target = React.useRef(null);

	const onToggleShow = () => {
		setShow(!show);
	};

	const changeAmount: FormControlProps['onChange'] = e => {
		setAmount(Number(e.target.value) || undefined);
	};

	const pushNotification = (message: string) => {
		dispatch(
			alertPush({
				message: [message],
				type: 'success',
			}),
		);
	};

	const onAccept = () => {
		if (wallet) {
			if (wallet.balance) {
				if ((amount || 0) > +wallet.balance) {
					pushNotification(`Amount(${amount}) must be less than wallet balance(${wallet.balance})`);
				} else {
					dispatch(
						voteDonateCreate({
							id,
							amount: Number(amount),
						}),
					);
					onToggleShow();
					setAmount(undefined);
				}
			} else {
				pushNotification(`You don't have ${constants.VOTE_CURRENCIE} wallet balance yet`);
			}
		} else {
			pushNotification(`You don't have ${constants.VOTE_CURRENCIE} wallet`);
		}
	};

	const titleTooltip = () => {
		if (!userLoggedIn) {
			return (
				<>
					You are not logged in. <Link to="/login"> {intl.formatMessage({ id: 'page.body.user.loggin' })}</Link>
				</>
			);
		} else if (!user.otp) {
			return (
				<>
					You have not enabled 2FA. <Link to="/profile"> to Profile</Link>
				</>
			);
		}

		return (
			<div className="d-flex">
				<Form.Control
					className="h-100"
					size="sm"
					type="number"
					placeholder="Amount"
					value={amount}
					onChange={changeAmount}
				/>
				<button className="pg-vote__cpn__button-vote__overlay-input__accept" disabled={!amount} onClick={onAccept}>
					<FaCheck size="10" />
				</button>
				<button className="pg-vote__cpn__button-vote__overlay-input__close" onClick={onToggleShow}>
					<FaTimes size="10" />
				</button>
			</div>
		);
	};

	return (
		<div className="pg-vote__cpn__button-vote">
			<Button ref={target} onClick={onToggleShow} variant="outline-dark">
				<span>{quantity}</span> <ImPlus className="ml-2" />
			</Button>
			<Overlay target={target.current} show={show} placement="left">
				{propOverlays => (
					<Tooltip
						className="pg-vote__cpn__button-vote__overlay-input"
						id={`overlay-vote-button-${props.idKey}`}
						{...propOverlays}
					>
						{titleTooltip()}
					</Tooltip>
				)}
			</Overlay>
		</div>
	);
};
