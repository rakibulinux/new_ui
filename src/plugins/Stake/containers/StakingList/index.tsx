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
				staking_list.map((staking: Stake) => (
					<div className="col-lg-4 col-md-6 mb-5" key={staking.stake_id}>
						<StakingItem
							key={staking.stake_id}
							stake_id={staking.stake_id}
							currency_id={staking.currency_id}
							staking_name={staking.staking_name}
							rewards={staking.rewards}
							active={staking.active}
							icon_url={staking.icon_url}
							status={staking.status}
							description={staking.description}
							start_time={staking.start_time}
							end_time={staking.end_time}
							ref_link={staking.ref_link}
						/>
					</div>
				))
			) : (
				<div style={{ marginTop: '50px' }} className="w-100 d-flex justify-content-center">
					<img src="https://i.imgur.com/wm92tgK.png" alt="no-data" />
				</div>
			)}
			<div hidden={!isLoadingStakingList} style={{ marginTop: '200px' }}>
				<LoadingSpinner loading={isLoadingStakingList} />
			</div>
		</React.Fragment>
	);
};
