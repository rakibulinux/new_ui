import * as React from 'react';

export const LKT2More = () => {
	return (
		<div className="row justify-content-center">
			<div className="col-12">
				<h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>1. CircleEx Token Information</h2>
				<br />
				<p style={{ fontSize: '1.6rem' }}>
					<strong style={{ color: '#fff' }}>Smart Contract: </strong>0x243c56e8e740025ac6b112d7b9af59be8eef6e33
					<br />
					<br />
					<strong style={{ color: '#fff' }}>Max Total Supply: </strong> 100,000,000 CX
					<br />
					<br />
					<strong style={{ color: '#fff' }}>Decimals: </strong> 6
				</p>
				<br />
				<br />
				<h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>2. IEO Bonus Detail</h2>
				<br />
				<p style={{ fontSize: '1.6rem' }}>
					<strong style={{ color: '#fff' }}>Buy 2.000-4.000 CX: </strong>Got 5% Bonus
					<br />
					<br />
					<strong style={{ color: '#fff' }}>Buy 4.001-20.000 CX: </strong>Got 10% Bonus
					<br />
					<br />
					<strong style={{ color: '#fff' }}>Buy 20.001-1.000.000 CX: </strong>Got 15% Bonus
				</p>
			</div>
		</div>
	);
};
