import * as React from 'react';
import imgDetail from './assets/imgDetail.png';
import { selectIEODetail, fetchIEODetail } from '../../../../modules';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

export const InformationIEO = () => {
	const toUpperCaseFirstChar = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const { ieoID } = useParams<{ ieoID: string }>();
	const ieoDetail = useSelector(selectIEODetail);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(
			fetchIEODetail({
				ieo_id: Number(ieoID),
			}),
		);
	}, []);

	const information = {
		name: ieoDetail.payload.name,
		date: ieoDetail.payload.date,
		price: ieoDetail.payload.price,
		homepage: ieoDetail.payload.homepage,
		bonus: ieoDetail.payload.bonus,
		bonusLookup: ieoDetail.payload.bonus_lockup,
		softcap: ieoDetail.payload.softcap,
		hardcap: ieoDetail.payload.hardcap,
		usage: ieoDetail.payload.usage,
		whitepaper: ieoDetail.payload.whitepaper,
		tech: ieoDetail.payload.tech,
		sns: ieoDetail.payload.twitter,
	};
	const showInformationComponent = () => {
		let content: Array<JSX.Element> = [];
		for (let key in information) {
			const jsx = (
				<div key={key} className="col-md-6 col-sm-12 d-flex detail" style={{ padding: '0px' }}>
					<div className="content-key col-md-5 col-xl-3">
						<p>{toUpperCaseFirstChar(key)}</p>
					</div>
					<div className="content-value col-md-7 co-xl-9">
						<p>{information[key]}</p>
					</div>
				</div>
			);
			content.push(jsx);
		}
		return content;
	};
	return (
		<div id="information-ieo">
			<div className="information-ieo-title">
				<h3>DETAIL</h3>
			</div>
			<div className="col-11 content row" style={{ padding: '0px' }}>
				{showInformationComponent()}
			</div>
			<div className="information-ieo-image col-11 d-flex justify-content-center" style={{ padding: '0px' }}>
				<img src={imgDetail}></img>
			</div>
		</div>
	);
};
