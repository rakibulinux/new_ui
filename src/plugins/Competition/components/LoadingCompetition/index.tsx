import React from 'react';

interface LoadingCompetitionProps {
	className?: string;
}
export const LoadingCompetition = (props: LoadingCompetitionProps) => {
	return (
		<div className="loading-competition">
			<div className="spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};
