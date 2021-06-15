import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectStakingListLoading, Stake } from '../../../../../modules';
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
					<div className="col-lg-4 col-md-6 mb-5" key={staking.stake_id}>
						<StakingItem
							key={staking.stake_id}
							stake_id={staking.stake_id}
							currency_id={staking.currency_id}
							staking_name={staking.staking_name}
							rewards={staking.rewards}
							active={staking.active}
							status={staking.status}
							description={staking.description}
							start_time={staking.start_time}
							end_time={staking.end_time}
							cap_amount={staking.cap_amount}
							total_amount={staking.total_amount}
							min_amount={staking.min_amount}
							cap_amount_per_user={staking.cap_amount_per_user}
						/>
					</div>
				))
			) : (
				<div style={{ marginTop: '50px', width: '100vw' }}>
					<div className="w-100 text-center">
						<img
							src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
							alt="no-data"
						/>
					</div>
					<div className="w-100 text-center mt-2">
						<h5>No Data</h5>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};
