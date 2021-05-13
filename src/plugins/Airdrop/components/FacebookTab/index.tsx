import { Button, message, Result, Table } from 'antd/lib';
import * as React from 'react';
import { FacebookProvider, Like, Login, Share } from 'react-facebook';
import api from '../../../api';
import { FacebookTabConfig } from '../../screens';
import './FacebookTab.css';

interface FacebookTabProps {
	airdropID: string;
	facebookConfig: FacebookTabConfig;
	onFacebookSuccess: any;
}

export const FacebookTab: React.FC<FacebookTabProps> = (props: FacebookTabProps) => {
	const [loginState, setLoginState] = React.useState({
		status: false,
		id: '',
		name: '',
	});

	const [facebookTaskState, setFacebookState] = React.useState({
		sharePage: false,
		likePost: false,
		sharePost: false,
	});

	const handleResponse = data => {
		if (!facebookTaskState.sharePage) {
			message.error(`You have't share page task 2.`);
		}
		if (!facebookTaskState.likePost) {
			message.error(`You have't like post task 3.`);
		}
		if (!facebookTaskState.sharePost) {
			message.error(`You have't share post task 4.`);
		}

		api.get(`/claim/find/airdrop_id=${props.airdropID}&facebook_id=${data.profile.id}`)
			.then(response => {
				const facebookIdList = response.data.payload;
				if (facebookIdList.length > 0) {
					message.error('You logined this facebook account in other claim.');
				} else {
					setLoginState({
						status: true,
						id: data.profile.id,
						name: data.profile.name,
					});
				}
			})
			.catch(err => {
				message.error('Try again after minutes');
			});
	};

	const handleError = error => {
		setLoginState({
			status: false,
			id: '',
			name: '',
		});
	};

	const likePageButton = (
		<FacebookProvider appId={props.facebookConfig.facebookAppId}>
			<Like width="50px" colorScheme="dark" href={props.facebookConfig.facebookPage} />
		</FacebookProvider>
	);

	const sharePageButton = (
		<a onClick={() => setFacebookState({ ...facebookTaskState, sharePage: true })}>
			<FacebookProvider appId={props.facebookConfig.facebookAppId}>
				<Share href={props.facebookConfig.facebookPage}>
					{({ handleClick, loading }) => (
						<Button type="primary" onClick={handleClick}>
							Share
						</Button>
					)}
				</Share>
			</FacebookProvider>
		</a>
	);

	const likePostButton = (
		<Button
			onClick={() => setFacebookState({ ...facebookTaskState, likePost: true })}
			type="primary"
			href={props.facebookConfig.facebookPost}
			target="_blank"
		>
			Like
		</Button>
	);

	const sharePostButton = (
		<a onClick={() => setFacebookState({ ...facebookTaskState, sharePost: true })}>
			<FacebookProvider appId={props.facebookConfig.facebookAppId}>
				<Share href={props.facebookConfig.facebookPost}>
					{({ handleClick, loading }) => (
						<Button type="primary" onClick={handleClick}>
							Share
						</Button>
					)}
				</Share>
			</FacebookProvider>
		</a>
	);
	const verifyButton = (
		<FacebookProvider appId={props.facebookConfig.facebookAppId}>
			<Login scope="email" onCompleted={handleResponse} onError={handleError}>
				{({ loading, handleClick, error, data }) => (
					<Button type="primary" loading={loading} onClick={handleClick}>
						Verify
					</Button>
				)}
			</Login>
		</FacebookProvider>
	);

	const dataSource = [
		{
			key: '1',
			step: '1',
			task: 'Like Fanpage',
			action: likePageButton,
		},
		{
			key: '2',
			step: '2',
			task: 'Share Fanpage',
			action: sharePageButton,
		},
		{
			key: '3',
			step: '3',
			task: 'Like Airdrop Post',
			action: likePostButton,
		},
		{
			key: '4',
			step: '4',
			task: 'Share Airdrop Post',
			action: sharePostButton,
		},
		{
			key: '5',
			step: '5',
			task: 'Verify Facebook Task',
			action: verifyButton,
		},
	];

	const columns = [
		{
			title: 'Step.',
			dataIndex: 'step',
			key: 'step',
		},
		{
			title: 'Task',
			dataIndex: 'task',
			key: 'task',
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
		},
	];

	const tableView = <Table pagination={false} dataSource={dataSource} columns={columns} />;
	const resultView = (
		<Result
			status="success"
			title="Successfully Verified Facebook Task!"
			extra={[
				<Button type="primary" key="next" onClick={() => props.onFacebookSuccess(loginState.id)}>
					Next
				</Button>,
			]}
		/>
	);

	return (
		<div>
			{loginState.status && facebookTaskState.sharePage && facebookTaskState.likePost && facebookTaskState.sharePost
				? resultView
				: tableView}
		</div>
	);
};
