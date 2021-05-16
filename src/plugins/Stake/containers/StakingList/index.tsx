import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectStakingListLoading, Stake } from '../../../../modules';
import { LoadingSpinner, StakingItem } from '../../components';
interface StakingListProps {
	staking_list: Stake[];
}
export const StakingList: React.FC<StakingListProps> = (props: StakingListProps) => {
	const { staking_list } = props;

	const isLoadingStakingList = useSelector(selectStakingListLoading);

	return (
		<React.Fragment>
			{isLoadingStakingList ? (
				<div style={{ marginTop: '200px' }}>
					<LoadingSpinner loading={isLoadingStakingList} />
				</div>
			) : staking_list.length > 0 ? (
				staking_list.map((staking: Stake) => (
					<div className="col-lg-4 col-md-6 mb-5" key={staking.staking_id}>
						<StakingItem
							key={staking.staking_id}
							staking_id={staking.staking_id}
							currency_id={staking.currency_id}
							staking_name={staking.staking_name}
							rewards={staking.rewards}
							active={staking.active}
							icon_url={staking.icon_url}
							status={staking.status}
							description={staking.description}
							start_time={staking.start_time}
							end_time={staking.end_time}
						/>
					</div>
				))
			) : (
				<div style={{ marginTop: '50px' }} className="w-100 d-flex justify-content-center">
					<img
						src="https://lh3.googleusercontent.com/proxy/rjJB53aegpeYWeoE-P0VHT7OwI662-WCYh5k-p3UxkNtavuGdTPH5dM8OCGMRQtcP_l5dv7ikAaMTtx2JZ-vrlQ7mZ86FHZHJV85cw"
						alt="no-data"
					/>
				</div>
			)}
		</React.Fragment>
	);
};
