import * as React from 'react';
import { AirdropTable } from '../../containers/AirdropTable';

export const AirdropList: React.FC = () => {
	return (
		<React.Fragment>
			<div className="container-fluid">
				<div className="col-12">
					<div className="row">
						<div className="col-12">
							<h1 style={{ fontSize: '3rem', textAlign: 'center', marginTop: '1em', color: 'white' }}>
								CircleEx Airdrop Hub
							</h1>
						</div>
					</div>
					<div className="row">
						<AirdropTable />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
