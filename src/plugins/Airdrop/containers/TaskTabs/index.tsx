import * as React from 'react';
import { ClaimTab, FacebookTab, TelegramTab, TwitterTab } from '../../components';

import { Steps } from 'antd';

import { useSelector } from 'react-redux';
import { selectClaim, selectUserInfo } from '../../../../modules';
import { TasksConfig } from '../../screens';

const { Step } = Steps;

interface Step {
	title: string;
	content: any;
	icon: any;
}

interface TaskTabsProps {
	airdropID: string;
	tasksConfig: TasksConfig;
}

export const TaskTabs: React.FC<TaskTabsProps> = (props: TaskTabsProps) => {
	const user = useSelector(selectUserInfo);
	const claim = useSelector(selectClaim);

	const [current, setCurrent] = React.useState(0);

	const next = () => {
		setCurrent(current + 1);
	};

	const [twitterState, setTwitterState] = React.useState('');
	const [facebookState, setFacebookState] = React.useState('');
	const [telegramState, setTelegramState] = React.useState('');

	const handleTwitterSuccess = username => {
		next();
		setTwitterState(username);
	};
	const handleFacebookSuccess = id => {
		next();
		setFacebookState(id);
	};
	const handleTelegramSuccess = username => {
		next();
		setTelegramState(username);
	};

	const steps = [
		{
			title: 'Facebook',
			content: (
				<FacebookTab
					airdropID={props.airdropID}
					facebookConfig={props.tasksConfig.facebook}
					onFacebookSuccess={handleFacebookSuccess}
				/>
			),
			icon: '',
		},
		{
			title: 'Twitter',
			content: (
				<TwitterTab
					airdropID={props.airdropID}
					twitterConfig={props.tasksConfig.twitter}
					onTwitterSuccess={handleTwitterSuccess}
				/>
			),
			icon: '',
		},
		{
			title: 'Telegram',
			content: (
				<TelegramTab
					airdropID={props.airdropID}
					telegramConfig={props.tasksConfig.telegram}
					onTelegramSuccess={handleTelegramSuccess}
				/>
			),
			icon: '',
		},
	];
	const claimStep: Step = {
		title: 'Claim',
		content: (
			<ClaimTab
				userInfo={user}
				airdropID={props.airdropID}
				facebookId={facebookState}
				twitterUsername={twitterState}
				telegramUsername={telegramState}
			/>
		),
		icon: '',
	};

	const customSteps: Step[] = [];
	if (!claim.loading) {
		if (claim.payload.length === 0) {
			if (!props.tasksConfig.twitter.disable) {
				customSteps.push(steps[steps.findIndex(step => step.title === 'Twitter')]);
			}
			if (!props.tasksConfig.telegram.disable) {
				customSteps.push(steps[steps.findIndex(step => step.title === 'Telegram')]);
			}
			if (!props.tasksConfig.facebook.disable) {
				customSteps.push(steps[steps.findIndex(step => step.title === 'Facebook')]);
			}
		}
		customSteps.push(claimStep);
	}

	return (
		<>
			<Steps current={current}>
				{customSteps.map(item => (
					<Step key={item.title} title={item.title} icon={item.icon} />
				))}
			</Steps>
			{customSteps[current] ? <div className="steps-content">{customSteps[current].content}</div> : ''}
		</>
	);
};
