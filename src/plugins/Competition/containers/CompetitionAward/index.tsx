import { fetchCompetitionAward, selectCompetitionAward } from 'modules';
import { TableAwards } from 'plugins/Competition/components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const CompetitionAward = (props: { competition_id: number }) => {
	const { competition_id } = props;
	const awards = useSelector(selectCompetitionAward);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchCompetitionAward(competition_id));
	}, []);
	const renderTable = () => {
		const listTable: JSX.Element[] = [];
		for (let i = 0; i < awards.payload.length / 10; i++) {
			listTable.push(
				<div className="col-md-6 col-sm-12">
					<TableAwards awards={awards.payload.slice(i * 10, (i + 1) * 10)} />
				</div>,
			);
		}
		return listTable;
	};
	return <div className="competition-ranking-awards row mt-5 d-flex justify-content-center d-flex">{renderTable()}</div>;
};
