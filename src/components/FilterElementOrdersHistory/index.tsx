import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMarkets } from '../../modules';

interface ParentProps {
	// tslint:disable-next-line: variable-name
	onFilter: (date_form: string, date_to: string, base_unit: string, quote_unit: string, side: string) => void;
	onRestFilter: () => void;
}

export const FilterElement = (parentProps: ParentProps) => {
	const [valueForm, setValueForm] = useState({
		date_from: '',
		date_to: '',
		base_unit: 'all',
		quote_unit: 'all',
		side: 'all',
	});

	const marketsData = useSelector(selectMarkets);

	const initBase = marketsData.map(e => e.base_unit);
	initBase.unshift('all');
	// tslint:disable-next-line: variable-name
	const [optionBase_unit, setOptionBase_unit] = useState(initBase);
	// tslint:disable-next-line: variable-name
	const [optionQuote_unit, setOptionQuote_unit] = useState(['all']);

	const filterQuoteByBase = (base: string) => {
		const quoteTamp: string[] = ['all'];
		// tslint:disable-next-line: ban
		marketsData.forEach(e => {
			if (e.base_unit === base) {
				quoteTamp.push(e.quote_unit);
			}
		});

		return quoteTamp;
	};

	const onChangeValueForm = (value: string, name: string): void => {
		const form = { ...valueForm };
		form[name] = value;

		if (name === 'base_unit') {
			setOptionQuote_unit([...filterQuoteByBase(value)]);
		}

		setValueForm(form);
	};

	const onSearch = () => {
		// tslint:disable-next-line: no-shadowed-variable
		const { date_from, date_to, base_unit, quote_unit, side } = valueForm;
		parentProps.onFilter(date_from, date_to, base_unit, quote_unit, side);
	};

	const onRestForm = () => {
		setValueForm({
			date_from: '',
			date_to: '',
			base_unit: 'all',
			quote_unit: 'all',
			side: 'all',
		});
		setOptionBase_unit(initBase);
		parentProps.onRestFilter();
	};

	const renderInputDate = (name: string) => {
		return (
			<input
				type="date"
				name={name}
				onChange={e => {
					onChangeValueForm(e.target.value, e.target.name);
				}}
			/>
		);
	};

	const renderSelection = (name: string, optionElem) => {
		const defaulValue = optionElem[0];

		return (
			<select
				className="form-control"
				style={{ width: '80px' }}
				name={name}
				defaultValue={defaulValue}
				onChange={e => {
					onChangeValueForm(e.target.value, e.target.name);
				}}
			>
				{optionElem.map(e => {
					return (
						<option value={e} key={e}>
							{e.toUpperCase()}
						</option>
					);
				})}
			</select>
		);
	};

	const { side } = valueForm;

	return (
		<div className="history-screen__filter">
			<form className="d-flex align-items-center">
				<div className="history-screen__filter__date d-flex align-items-center">
					<div className="history-screen__filter__date__desc">Date</div>
					{renderInputDate('date_from')}
					{renderInputDate('date_to')}
				</div>
				<div className="history-screen__filter__pair d-flex align-items-center">
					<div className="history-screen__filter__date__desc">Pair</div>
					<div className="mr-3">{renderSelection('base_unit', optionBase_unit)}</div>
					<div>{renderSelection('quote_unit', optionQuote_unit)}</div>
				</div>
				<div className="history-screen__filter__side d-flex align-items-center">
					<div className="history-screen__filter__date__desc">Type</div>
					<div>
						<select
							id="inputOrderType"
							className="form-control"
							style={{ width: '70px' }}
							name="side"
							value={side}
							onChange={e => {
								onChangeValueForm(e.target.value, e.target.name);
							}}
						>
							<option value="all">All</option>
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
						</select>
					</div>
				</div>
				<div className="history-screen__filter__search d-flex">
					<button
						className="history-screen__filter__search__btn history-screen__filter__search__btn--search"
						onClick={e => {
							e.preventDefault();
							onSearch();
						}}
					>
						Search
					</button>
					<button className="history-screen__filter__search__btn" type="reset" value="Reset" onClick={onRestForm}>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
};
