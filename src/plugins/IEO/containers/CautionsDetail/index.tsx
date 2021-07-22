import { fetchIEOCaution, selectIEOCaution } from 'modules/plugins/ieo/caution';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const CautionsDetail = (props: { ieoID: number }) => {
	const caution = useSelector(selectIEOCaution);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchIEOCaution({ ieo_id: props.ieoID }));
	}, []);

	const loadingSpinner = () => {
		return (
			<div className="loading d-flex -justify-content-center w-100">
				<div className="spinner-border text-primary m-auto" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	};
	return (
		<div id="cautions-detail">
			<div className="cautions-detail-title">
				<h3>CAUTIONS</h3>
			</div>
			{caution.loading ? (
				loadingSpinner()
			) : (
				<div className="container-fluid">
					<div className="describe">
						<ul>
							<li>
								{`Sale and purchase of ${caution.payload.name} take place between you and${caution.payload.name} (the “Issuer”) and ProBit is
							neither a seller nor a party as any capacity in the sale of ${caution.payload.name}`}
							</li>
							<li>{`Purchase of ${caution.payload.name} is final and there will be no refunds or cancellations`}</li>
							<li>{`Please contact the Issuer for any inquiries regarding ${caution.payload.name}`}</li>

							<li>{`Distribution schedule of ${caution.payload.name} is to be determined by the Issuer.`}</li>
						</ul>
					</div>
					<div className="noticeForRate">
						<h3> Notice For Rates</h3>
						<ul>
							{caution.payload.notices.map((notice, index) => (
								<li key={index}>{notice}</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};
