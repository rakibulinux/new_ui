import { selectMarkets   } from 'modules';
import * as moment from 'moment-timezone';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
	onFilter: (data:any) => void;
	onRestFilter: () => void;
	data:any;
}

export const FilterElement:React.FC<Props> = props => {

	const initialStateForm={
		date_from: '',
		date_to: '',
		base_unit: 'all',
		quote_unit: 'all',
		side: 'all',
	};
	const [valueForm, setValueForm] = useState(initialStateForm);

	const marketsData = useSelector(selectMarkets);

	const initBase = marketsData.map(e => e.base_unit);
	initBase.unshift('all');
	const [optionBaseUnit, setOptionBaseUnit] = useState(initBase);
	const [optionQuoteUnit, setOptionQuoteUnit] = useState(['all']);

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
		const form =  valueForm  ;
		form[name] = value;

		if (name === 'base_unit') {
			setOptionQuoteUnit(filterQuoteByBase(value));
		}
		setValueForm(form);
	};

	const onSearch = () => {

		const {date_from, date_to, base_unit, quote_unit, side} = valueForm;
		let dataFilter = props.data;
		// // filter by base_unit vs quote_unit
		if (base_unit === 'all') {
			// no filter
		} else {
			if (quote_unit === 'all') {
				const baseStringLength = base_unit.length;
				dataFilter = dataFilter.filter((e:any) => e.market.slice(0, baseStringLength) === base_unit);
			} else {
				const market = base_unit + quote_unit;
				dataFilter = dataFilter.filter( (e:any) => e.market === market);
			}
		}
		// // filter by side
		if (side !== 'all') {
			dataFilter = dataFilter.filter((e: any) => {
				const textSide = e.side || e.taker_type;

				return textSide === side;
			});
		}
		// filter by time from
		if (date_from !== '') {
			dataFilter = dataFilter.filter(
				e => moment(e.created_at, 'YYYYMMDD').valueOf() >= moment(date_from, 'YYYYMMDD').valueOf(),
			);
		}
		// filter by time to
		if (date_to !== '') {
			dataFilter = dataFilter.filter(
				e => moment(e.created_at, 'YYYYMMDD').valueOf() <= moment(date_to, 'YYYYMMDD').valueOf(),
			);
		}

		props.onFilter(dataFilter);

	};

	const onRestForm = () => {
		setValueForm(initialStateForm);
		setOptionBaseUnit(initBase);
		props.onRestFilter();
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

	const renderSelection = (name: string, optionElem:string[]) => {
		const defaultValue = optionElem[0];

		return (
			<select
				className="form-control"
				name={name}
				defaultValue={defaultValue}
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

	return (
		<div className="history-screen__filter">
			<form className="d-flex align-items-center">
				<div className="history-screen__filter__date d-flex align-items-center">
					<div className="history-screen__filter__date__desc">Date</div>
					{renderInputDate('date_from')}
					{renderInputDate('date_to')}
				</div>
				<div className="history-screen__filter__select d-flex align-items-center">
					<div className="history-screen__filter__select__desc">Pair</div>
					<div className="mr-3 history-screen__filter__select__choose">{renderSelection('base_unit', optionBaseUnit)}</div>
					<div className="history-screen__filter__select__choose">{renderSelection('quote_unit', optionQuoteUnit)}</div>
				</div>
				<div className="history-screen__filter__select d-flex align-items-center">
					<div className="history-screen__filter__select__desc">Type</div>
					<div className="history-screen__filter__select__choose">
						<select
							id="inputOrderType"
							className="form-control"
							name="side"
							value={valueForm.side}
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
