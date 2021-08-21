import * as React from 'react';
import { CompetitionItem } from '../../components';
import { NewCompetitionState } from '../../../../modules';

interface ListCompetitionProps {
	CompetitionList: Array<NewCompetitionState>;
}
export const ListCompetition: React.FC<ListCompetitionProps> = props => {
	const { CompetitionList } = props;

	const EmptyComponent = () => {
		return (
			<div className="col-12">
				<div className="col-12 d-flex justify-content-center">
					<img
						src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
						style={{ marginTop: '3rem' }}
						alt="empty"
					/>
				</div>
				<p className="col-12 text-center text-white h5" style={{ padding: '1rem' }}>
					No Data
				</p>
			</div>
		);
	};
	return (
		<div id="ioe-listing-screen-ieos" className="row mt-5">
			{!CompetitionList.length
				? EmptyComponent()
				: CompetitionList.map((item, index) => {
						return (
							<div key={index} className="col-md-6 col-xl-4 mb-5">
								<CompetitionItem
									type={item.type}
									currency_id={item.currency_id}
									start_date={item.start_date}
									end_date={item.end_date}
									id={item.id}
									key={index}
									market_ids={item.market_ids}
									status={item.status}
									total_prize={item.total_prize}
								/>
							</div>
						);
				  })}
		</div>
	);
};
