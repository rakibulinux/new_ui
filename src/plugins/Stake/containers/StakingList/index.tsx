import * as React from 'react';
import { Stake } from '../../../../modules';
import { StakingItem } from '../../components';

interface StakingListProps {
	stakes: Stake[];
}

export const StakingList: React.FC<StakingListProps> = (props: StakingListProps) => {
	const { stakes } = props;

	return (
		<React.Fragment>
			{stakes.reverse().map((stake: Stake) => (
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
			))}
		</React.Fragment>
	);
};
