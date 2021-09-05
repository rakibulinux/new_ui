import { SmileOutlined } from '@ant-design/icons';
import { Button, message, Result } from 'antd/lib';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectAirdrop, selectClaim } from '../../../../modules';
import axios from '../../../api/index';
const publicIp = require('public-ip');

interface ClaimTabProps {
	airdropID: string;
	facebookId: string;
	twitterUsername: string;
	telegramUsername: string;
	userInfo: {
		uid: string;
		email: string;
	};
}

export const ClaimTab: React.FC<ClaimTabProps> = (props: ClaimTabProps) => {
	const history = useHistory();
	const [ipV4, setIpV4] = React.useState('');
	const [claimClickState, setClaimClickState] = React.useState(false);
	const claim = useSelector(selectClaim);
	const airdrops = useSelector(selectAirdrop);

	// tslint:disable-next-line: no-floating-promises
	(async () => {
		setIpV4(await publicIp.v4());
	})();

	const handleClaimButton = () => {
		const claimData = {
			user_uid: props.userInfo.uid,
			email_user: props.userInfo.email,
			facebook_id: props.facebookId || '',
			twitter_username: props.twitterUsername || '',
			telegram_username: props.telegramUsername || '',
			user_ip: ipV4,
		};
		setClaimClickState(true);
		axios
			.get(`/claim/find/airdrop_id=${props.airdropID}&user_ip=${ipV4}/`)
			.then(response => {
				const ipList = response.data.payload;
				if (ipList.length > 0) {
					axios
						.post(`/block/${claimData.user_uid}`)
						.then(_response => {
							message.error('Hmm. You are blocked because claim too much');
							history.goBack();
						})
						.catch(err => {
							return err;
						});
				} else {
					axios
						.post(`/claim/airdrop_id=${props.airdropID}`, claimData)
						// tslint:disable-next-line: no-shadowed-variable
						.then(response => {
							switch (response.data.msg) {
								case 'out_of_tokens':
									message.error('Sorry. You can not claim because out of tokens. Thanks for joining with us.');
									break;
								case 'exist_user_uid':
									message.error(
										'Hmmm... Maybe you has claimed yet. 1 account just receives one. Sorry for that.',
									);
									break;
								case 'claim_success':
									message.success('Good job. Claimed Successfully. Thank you for your participating!');
									break;
								default:
									message.error('Sorry. Cannot claim now. We will fix soon!');
							}
						})
						.catch(err => {
							message.error('Sorry. Cannot claim now. We will fix soon!');
						});
				}
			})
			.catch(err => {
				message.error('Sorry. Cannot claim now. We will fix soon!');
			});
	};

	let claimResult = (
		<Result
			icon={<SmileOutlined />}
			title="Great, we have done all the tasks!"
			extra={
				<Button disabled={ipV4 === '' || claimClickState} type="primary" onClick={handleClaimButton}>
					{ipV4 === '' ? 'Waiting ...' : 'Claim'}
				</Button>
			}
		/>
	);
	if (claim && claim.payload.length > 0) {
		switch (claim.payload[0].claim_status) {
			case 0:
				claimResult = <Result icon={<SmileOutlined />} title="Thanks you for your participating!" />;
				break;
			case 1:
				claimResult = (
					<Result
						status="success"
						title="Thanks, you are eligible for receive tokens. Remember follow us at CircleEx channel on Twitter."
					/>
				);
				break;
			case 2:
				claimResult = (
					<Result
						status="error"
						title="Hmm, you rejected and not receive tokens because some reasons (not complete tasks, cheating, ....)! Hope you join us in other specical Airdrop. Thank you!"
					/>
				);
				break;
			default:
				break;
		}
	}

	if (claimClickState) {
		claimResult = <Result icon={<SmileOutlined />} title="Thanks you for your participating!" />;
	}

	if (airdrops && airdrops.payload.length > 0) {
		if (airdrops.payload[0].remain_tokens <= 0) {
			claimResult = <Result status="error" title="Full participants!" />;
		}
	}

	return <div>{claimResult}</div>;
};
