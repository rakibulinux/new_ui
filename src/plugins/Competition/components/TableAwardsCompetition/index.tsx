import React from 'react';

interface TableAwardProps{
	awards :Array<{
		rank:number;
		award:string;
	}>
}
export const TableAwards = (props:TableAwardProps) => {
	const {awards} = props;
	return (
		<div id="table-award-competition">
			<table className="table table-dark">
				<thead className="text-center">
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Award</th>
					</tr>
				</thead>
				<tbody>
					{awards.map((item)=><React.Fragment key={item.rank}>
						<tr className="text-center">
						<td scope="row">{item.rank}</td>
						<td>{item.award}</td>
					</tr>
					</React.Fragment>)}
					
				</tbody>
			</table>
		</div>
	);
};
