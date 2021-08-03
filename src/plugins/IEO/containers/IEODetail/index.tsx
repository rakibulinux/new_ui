import React from 'react';
import MaskGroup from './assets/MaskGroup.png';
import { useSelector, useDispatch } from 'react-redux';
import { currenciesFetch, selectCurrencies } from '../../../../modules';
import millify from 'millify';
import NP from 'number-precision';
interface IEODetailProps {
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
	remains: number;
	total: number;
	progress: number;
}

export const IEODetail: React.FC<IEODetailProps> = props => {
	const formatDate = date => {
		return new Date(date).toString().split(' ').slice(0, 5).join(' ');
	};
	const [progressState, setProgressState] = React.useState<number>(
		Math.round(NP.minus(100, Number(props.progress)) * 100) / 100,
	);
	const [totalState, setTotalState] = React.useState<number>(0);
	const [remainsState, setRemainsState] = React.useState<number>(0);
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	React.useEffect(() => {
		dispatchFetchCurrencies();
		const newProgress = Math.round(NP.minus(100, Number(props.progress)) * 100) / 100;
		setProgressState(newProgress);
		setTotalState(props.total);
		setRemainsState(props.remains);
		console.log('run');
		console.log(progressState);
	}, [props.total, props.remains]);
	const currencies = useSelector(selectCurrencies);
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	return (
		<div id="ieo-detail" style={{ backgroundImage: `url(${MaskGroup})` }}>
			<div className="content col-11 m-auto">
				<div id="ieo-detail-header"></div>
				<div id="ieo-detail-body" className="col-12">
					<div className="logo-icon d-flex justify-content-center">
						<img src={findIcon(props.currencyID)} alt={`${props.currencyID.toUpperCase()}-icon`}></img>
					</div>
					<p id="ieo-detail-body-time">{`${formatDate(props.startDate)} ~ ${formatDate(props.endDate)}`}</p>
					<div className="w-100" style={{ position: 'relative', margin: '5px' }}>
						<div
							className="progress"
							style={{ width: '100%', background: 'rgba(132, 142, 156, 0.35)', height: '25px' }}
						>
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								aria-valuenow={remainsState}
								aria-valuemin={0}
								aria-valuemax={totalState}
								style={{ width: `${progressState}%`, backgroundColor: '#2FB67E' }}
							/>
							<div
								className="text-white d-flex justify-content-around align-items-center"
								style={{
									position: 'absolute',
									top: '0',
									left: '0',
									width: '100%',
									height: '100%',
									padding: '0 1rem',
									fontSize: '1rem',
								}}
							>
								<span>
									(IEO Remains)
									{`${
										Number(remainsState) > 100000000
											? millify(Number(remainsState), {
													precision: 2,
											  })
											: Number(remainsState)
									} `}
								</span>
								<span hidden={Number(remainsState) <= 0}>{`  /  `}</span>
								<span hidden={Number(remainsState) <= 0}>
									{' '}
									{Number(totalState) > 100000000
										? millify(Number(totalState), {
												precision: 2,
										  })
										: Number(totalState)}{' '}
									(Total)
								</span>
							</div>
						</div>
					</div>
				</div>
				<hr></hr>
				<div id="ieo-detail-footer">
					<p>{`${props.bonus ? props.bonus : '0%'} Bonus ${props.currencyID.toUpperCase()}`}</p>
				</div>
			</div>
		</div>
	);
};
