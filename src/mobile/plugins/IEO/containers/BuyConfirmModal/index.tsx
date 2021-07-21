import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import NP from 'number-precision';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies } from '../../../../../modules';

interface BuyConfirmModalProps {
	visible: boolean;
	onHiddenModal: () => void;
	onBuy: () => void;
	quantity: number;
	ieoID: string;
	baseBalance: number;
	baseCurrency: string;
	quoteBalance: number;
	quoteCurrency: string;
	quoteTotal: number;
	bonus: number;
}

export const BuyConfirmModal: React.FC<BuyConfirmModalProps> = (props: BuyConfirmModalProps) => {
	const currencies = useSelector(selectCurrencies);
	const {
		onHiddenModal,
		onBuy,
		quantity,
		quoteBalance,
		quoteCurrency,
		baseBalance,
		baseCurrency,
		quoteTotal,
		bonus,
		visible,
	} = props;
	const findIcon = (currencyID: string): string => {
		const currency = currencies.find(currency => currency.id === currencyID);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${currencyID.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const bonusQuantity = NP.times(quantity, bonus);
	const totalQuantity = NP.plus(baseBalance, quantity, bonusQuantity);
	const baseTitle = (
		<div className="base-title-content w-100 d-flex flex-wrap justify-content-center">
			<img style={{ width: '3rem', height: '3rem' }} src={findIcon(baseCurrency)} alt={baseCurrency} />
			<span style={{ fontSize: '1.6rem', marginLeft: '5px' }}>{baseCurrency}</span>
		</div>
	);
	const quoteTitle = (
		<div className="base-title-content w-100 d-flex  flex-wrap justify-content-center">
			<img style={{ width: '3rem', height: '3rem' }} src={findIcon(quoteCurrency)} alt={quoteCurrency} />
			<span style={{ fontSize: '1.6rem', marginLeft: '5px' }}>{quoteCurrency}</span>
		</div>
	);
	const informationBuy = (balance: number, Status: JSX.Element, type: string) => {
		return (
			<div className={`information_to_Buy ${type}`}>
				<p>{balance}</p>
				{Status}
			</div>
		);
	};
	const bonusComponent = () => {
		if (bonus <= 0) {
			return null;
		}
		return (
			<div className="bonus">
				<p>
					{`🥳 You will receive ${bonus * 100}% bonus of ${quantity} ${baseCurrency.toUpperCase()}
					(+${bonusQuantity} ${baseCurrency.toUpperCase()}) = ${NP.plus(quantity, bonusQuantity)} 
					${baseCurrency.toUpperCase()}`}
				</p>
			</div>
		);
	};

	return (
		<React.Fragment>
			{visible ? (
				<div id="buy-confirm-modal">
					<div id="buy-confirm-modal-header">
						<h2 style={{ marginTop: '8px' }}>Confirm To Buy</h2>
					</div>
					<div id="buy-confirm-modal-body">
						<div className="d-flex flex-wrap justify-content-between col-12">
							<div className="col-5 infor-price d-flex flex-wrap justify-content-center">
								{baseTitle}
								{informationBuy(totalQuantity, <ArrowUpOutlined />, 'up')}
							</div>
							<div className="col-5 infor-price d-flex flex-wrap justify-content-center">
								{quoteTitle}
								{informationBuy(NP.minus(quoteBalance, Number(quoteTotal)), <ArrowDownOutlined />, 'down')}
							</div>
						</div>
						{bonusComponent()}
					</div>
					<div id="buy-confirm-modal-footer">
						<button className="btn btn-secondary w-50" style={{ borderRadius: 0 }} onClick={onHiddenModal}>
							Cancel
						</button>
						<button className="btn btn-primary w-50" style={{ borderRadius: 0 }} onClick={onBuy}>
							Agree to Buy
						</button>
					</div>
				</div>
			) : null}
		</React.Fragment>
	);
};
