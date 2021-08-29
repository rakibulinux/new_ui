import Countdown from 'react-countdown';
import { format } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router';
import { LoadingCompetition } from 'plugins/Competition/components';
import classNames from 'classnames';
// import moment from 'moment';
import Select from 'react-select';
import moment from 'moment';

interface CompetitionInfoProps {
	currency_id: string;
	start_date: string;
	end_date: string;
	type: 'trade' | 'stake';
	markets: string[];
	volume: number;
	next_update: string;
	loading: boolean;
	status: 'ongoing' | 'ended' | 'upcoming';
}

export const CompetitionInfo = (props: CompetitionInfoProps) => {
	const { currency_id, start_date, end_date, type, markets, volume, next_update, loading, status } = props;
	const uppercaseCharacterFirst = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const history = useHistory();

	const [selectedState, setSelectedState] = React.useState(uppercaseCharacterFirst(type));
	React.useEffect(() => {
		setSelectedState(uppercaseCharacterFirst(type));
	}, [type]);
	const SelectStyles = {
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isFocused ? '#313F60' : '#313445',
			cursor: 'pointer',
		}),
		control: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: '#fff',
			backgroundColor: '#313445',
			cursor: 'pointer',
		}),
		placeholder: (provided, state) => ({
			...provided,
			color: '#fff',
			cursor: 'pointer',
		}),
		singleValue: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: '#fff',
			backgroundColor: '#313445',
		}),
		menu: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: '#fff',
			backgroundColor: '#313445',
		}),
		input: (provided, state) => ({
			...provided,
			color: '#fff',
		}),
	};

	const handleLetJoin = () => {
		if (selectedState == uppercaseCharacterFirst(type)) {
			return;
		}
		if (type === 'stake') {
			const location = {
				pathname: '/stake',
			};
			history.push(location);
		} else {
			const marketID = selectedState.replace('/', '').toLowerCase();
			const location = {
				pathname: `/market/${marketID}`,
			};
			history.push(location);
		}
	};

	const handleChangeSelect = (selected: { value: string }) => {
		setSelectedState(selected.value);
	};

	const getSafeDate = (date: string) => {
		if (date.trim() === '') {
			return new Date();
		}
		return moment(date).toDate();
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		// console.log(seconds);
		if (completed) {
			// render a completed state
			return <p className="time">00 : 00</p>;
		} else {
			// render a countdown

			return (
				<p>
					{minutes < 10 ? 0 : ''}
					{minutes} : {seconds < 10 ? 0 : ''}
					{seconds}
				</p>
			);
		}
	};

	const getOptionSelect = () => {
		const options = type === 'trade' ? markets.map(item => item.toUpperCase()) : [currency_id.toUpperCase()];
		const convert = (currency: string, index: number) => {
			const newCurrency = {
				value: currency,
				label: <span key={index}>{currency.toUpperCase()}</span>,
			};
			return newCurrency;
		};
		return options.map(convert);
	};
	const renderInfoItem = (key: string, value: JSX.Element) => (
		<div className="competition-ranking-detail__info__update">
			<div className="competition-ranking-detail__info__update__title">
				<p className="competition-ranking-detail__info__update__title--key">{key}</p>
			</div>
			<div className="competition-ranking-detail__info__update__value">
				<div>{value}</div>
			</div>
		</div>
	);
	const buttonForwardClassName = classNames(
		`${
			status !== 'ongoing'
				? 'competition-ranking-detail__info__button--disable'
				: 'competition-ranking-detail__info__button--active'
		} `,
	);
	const buttonUpcomingClassName = classNames(`competition-ranking-detail__info__button--upcoming`);
	const buttonEndedClassName = classNames(`competition-ranking-detail__info__button--ended`);
	const buttonStatusClassName = classNames(
		`${status == 'ended' ? buttonEndedClassName : status === 'upcoming' ? buttonUpcomingClassName : ''}`,
	);
	const loadingDetailsClassNames = classNames('align-item-center', 'competition-background-loading');
	return (
		<div
			className={`competition-ranking-detail d-flex flex-column justify-content-center ${
				loading ? loadingDetailsClassNames : ''
			}`}
		>
			{loading ? <LoadingCompetition className="competition-ranking-detail__loading position-absolute" /> : ''}

			<div className="competition-ranking-detail__title text-center">
				<h4>Become a winner and get a prize</h4>
			</div>
			<div className="competition-ranking-detail__description text-center m-auto">
				<p>
					{`${uppercaseCharacterFirst(
						type,
					)} ${currency_id.toUpperCase()} and win. The one who ${type} the largest volume will receive the main prize! ${
						type === 'trade'
							? `Condition: buy or sell  ${currency_id.toUpperCase()}!`
							: `Stake ${currency_id.toUpperCase()}`
					}`}
				</p>
			</div>
			<div className="competition-ranking-detail__info d-flex flex-wrap">
				<div className="col-md-8 col-lg-6 row">
					<div className="col-md-6">
						{renderInfoItem(`Your ${uppercaseCharacterFirst(type)} volume`, <p>{volume.toFixed(4)}</p>)}
						{loading
							? renderInfoItem('Next Update', <p>00 : 00</p>)
							: renderInfoItem('Next Update', <Countdown date={getSafeDate(next_update)} renderer={renderer} />)}
					</div>
					<div className="col-md-6">
						{renderInfoItem('Start Time', <p>{format(getSafeDate(start_date), 'yyyy-MM-dd hh:mm')}</p>)}
						{renderInfoItem('End Time', <p>{format(getSafeDate(end_date), 'yyyy-MM-dd hh:mm')}</p>)}
					</div>
				</div>
				<div className="col-md-4 col-lg-6 position-relative">
					<div
						className="d-flex flex-column justify-content-center position-absolute"
						style={{
							width: '80%',
							right: 0,
						}}
					>
						<Select
							autoFocus
							backspaceRemovesValue={false}
							controlShouldRenderValue={false}
							hideSelectedOptions={false}
							isClearable={false}
							onChange={handleChangeSelect}
							options={getOptionSelect()}
							placeholder={selectedState}
							styles={SelectStyles}
							tabSelectsValue={false}
							value={getOptionSelect().map(option => option.value.toLowerCase())}
						/>

						<div className="d-flex justify-content-center">
							<button
								className={`competition-ranking-detail__info__button ${buttonForwardClassName} ${buttonStatusClassName}`}
								onClick={handleLetJoin}
								disabled={status !== 'ongoing'}
							>{`${
								status !== 'ongoing' ? `${status.toUpperCase()}` : `Let's ${uppercaseCharacterFirst(type)}`
							}`}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
