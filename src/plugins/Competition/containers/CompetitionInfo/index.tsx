import Countdown from 'react-countdown';
import { format } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router';
import { LoadingCompetition } from 'plugins/Competition/components';
import classNames from 'classnames';
import moment from 'moment';
import Select from 'react-select';

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
	const [selectedState, setSelectedState] = React.useState(uppercaseCharacterFirst(type));
	const [infoTimeState, setInfoTimeState] = React.useState({
		start_date: new Date().toDateString(),
		next_update: new Date().toDateString(),
		end_date: new Date().toDateString(),
	});
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
	React.useEffect(() => {
		if (start_date && end_date && next_update) {
			setInfoTimeState({
				start_date: start_date,
				end_date: end_date,
				next_update: next_update,
			});
			setSelectedState(type);
		}
	}, [start_date, end_date, type, next_update, loading]);
	console.log('run competition info', next_update);
	const history = useHistory();
	const handleLetJoin = () => {
		if (!selectedState) {
			return;
		}
		if (type === 'stake') {
			const location = {
				pathname: '/stake',
			};
			history.push(location);
		} else {
			const market = selectedState.replace('/', '');
			const location = {
				pathname: `/marker/${market}`,
			};
			history.push(location);
		}
	};

	const handleChangeSelect = (selected: { value: string }) => {
		setSelectedState(selected.value);
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		console.log(seconds);
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
		const convert = (currency: string) => {
			const newCurrency = {
				value: currency,
				label: <span>{currency.toUpperCase()}</span>,
			};
			return newCurrency;
		};
		return options.map(convert);
	};
	const renderInfoItem = (key: string, value: JSX.Element) => (
		<div className="competition-ranking-detail__info__update">
			<div className="competition-ranking-detail__info__update__title">
				<p>{key}</p>
			</div>
			<div className="competition-ranking-detail__info__update__value">
				<p>{value}</p>
			</div>
		</div>
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
						{renderInfoItem(
							'Next Update',
							<Countdown renderer={renderer} date={new Date(infoTimeState.next_update)} />,
						)}
					</div>
					<div className="col-md-6">
						{renderInfoItem(
							'Start Time',
							<p>{format(moment(infoTimeState.start_date).toDate(), 'yyyy-MM-dd hh:mm')}</p>,
						)}
						{renderInfoItem('End Time', <p>{format(moment(infoTimeState.end_date).toDate(), 'yyyy-MM-dd hh:mm')}</p>)}
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
								className="competition-ranking-detail__info__button competition-ranking-detail__info__button--disable"
								onClick={handleLetJoin}
								disabled={status !== 'ongoing'}
							>{`Let's ${uppercaseCharacterFirst(type)}`}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
