import { useWalletsFetch } from 'hooks';
import * as React from 'react';
import { Container } from 'react-bootstrap';
import { VoteHistory, VoteNews } from '../../containers';
// tslint:disable-next-line: no-empty-interface
interface VoteScreenProps {}

export const VoteScreen: React.FC<VoteScreenProps> = ({}) => {
	useWalletsFetch();

	return (
		<div className="pg-vote">
			<Container>
				<VoteNews />
				<VoteHistory />
			</Container>
		</div>
	);
};
