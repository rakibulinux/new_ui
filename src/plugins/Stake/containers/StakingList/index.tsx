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
			{staking_list.length > 0 ? (
				staking_list.map((stake: Stake) => (
					<div className="col-lg-4 col-md-6 mb-5" key={stake.stake_id}>
						<StakingItem
							key={stake.stake_id}
							stake_id={stake.stake_id}
							currency_id={stake.currency_id}
							staking_name={stake.staking_name}
							rewards={stake.rewards}
							active={stake.active}
							status={stake.status}
							description={stake.description}
							start_time={stake.start_time}
							end_time={stake.end_time}
							ref_link={stake.ref_link}
							total_amount={stake.total_amount}
							cap_amount={stake.cap_amount}
							cap_amount_per_user={stake.cap_amount_per_user}
							min_amount={stake.min_amount}
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
			<div hidden={!isLoadingStakingList} style={{ marginTop: '200px' }}>
				<LoadingSpinner loading={isLoadingStakingList} />
			</div>
		</React.Fragment>
	);
};
