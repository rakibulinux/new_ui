import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { LetterIcon } from '../../../assets/images/LetterIcon';
import { NewCustomInput } from '../../../components';
import { IntlProps } from '../../../index';
import {
	beneficiariesActivate,
	Beneficiary,
	RootState,
	selectBeneficiariesActivateError,
	selectBeneficiariesActivateSuccess,
	selectMobileDeviceState,
} from '../../../modules';
import { CommonError } from '../../../modules/types';

interface ReduxProps {
	beneficiariesActivateError?: CommonError;
	beneficiariesActivateSuccess: boolean;
	isMobileDevice: boolean;
}

interface DispatchProps {
	activateAddress: typeof beneficiariesActivate;
}

interface OwnProps {
	beneficiariesAddData: Beneficiary;
	handleToggleConfirmationModal: () => void;
}

interface State {
	confirmationModalCode: string;
	confirmationModalCodeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

const defaultState = {
	confirmationModalCode: '',
	confirmationModalCodeFocused: false,
};

class BeneficiariesActivateModalComponent extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			...defaultState,
		};
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { beneficiariesActivateError, beneficiariesActivateSuccess } = this.props;

		if (
			(nextProps.beneficiariesActivateError && !beneficiariesActivateError) ||
			(nextProps.beneficiariesActivateSuccess && !beneficiariesActivateSuccess)
		) {
			this.props.handleToggleConfirmationModal();
			this.handleClearModalsInputs();
		}
	}

	public render() {
		const { confirmationModalCode } = this.state;

		const isDisabled = !confirmationModalCode;

		return (
			<Modal
				show
				onHide={this.props.handleToggleConfirmationModal}
				className="withdraw-confirm__modal"
				animation={true}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.translate('page.body.wallets.beneficiaries.confirmationModal.header')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<div className="d-flex align-items-center mb-4">
							<LetterIcon />
							<span className="ml-4">
								{this.translate('page.body.wallets.beneficiaries.confirmationModal.body.text')}
							</span>
						</div>
						<div className="mb-4">
							<NewCustomInput
								type="text"
								label={''}
								placeholder={this.translate(
									`page.body.wallets.beneficiaries.confirmationModal.body.confirmationModalCode`,
								)}
								defaultLabel={''}
								handleChangeInput={value => this.handleChangeFieldValue('confirmationModalCode', value)}
								inputValue={this.state.confirmationModalCode}
								handleFocusInput={() => this.handleChangeFieldFocus(`confirmationModalCodeFocused`)}
								classNameLabel="cr-email-form__label"
								classNameInput="cr-email-form__input"
								autoFocus={true}
							/>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						disabled={isDisabled}
						onClick={this.handleSubmitConfirmationModal}
						size="lg"
						variant="primary"
						className="w-100"
					>
						{this.translate('page.body.wallets.beneficiaries.confirmationModal.body.button')}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	private handleChangeFieldValue = (key: string, value: string) => {
		// @ts-ignore
		this.setState({
			[key]: value,
		});
	};

	private handleChangeFieldFocus = (key: string) => {
		// @ts-ignore
		this.setState(prev => ({
			[key]: !prev[key],
		}));
	};

	private handleClearModalsInputs = () => {
		this.setState({
			...defaultState,
		});
	};

	private handleSubmitConfirmationModal = () => {
		const { beneficiariesAddData } = this.props;
		const { confirmationModalCode } = this.state;

		if (beneficiariesAddData) {
			const payload = {
				pin: confirmationModalCode,
				id: beneficiariesAddData.id,
			};

			this.props.activateAddress(payload);
		}
	};

	private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	beneficiariesActivateError: selectBeneficiariesActivateError(state),
	beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
	isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	activateAddress: payload => dispatch(beneficiariesActivate(payload)),
});

// tslint:disable-next-line:no-any
export const BeneficiariesActivateModal = injectIntl(
	connect(mapStateToProps, mapDispatchToProps)(BeneficiariesActivateModalComponent) as any,
) as any;
