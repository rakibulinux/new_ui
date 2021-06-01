import { voteListFetch, VotePagination } from 'modules';
import * as React from 'react';
import { useDispatch } from 'react-redux';

export const useVoteListFetch = (pagination: VotePagination) => {
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(voteListFetch(pagination));
	}, [dispatch, pagination]);
};
