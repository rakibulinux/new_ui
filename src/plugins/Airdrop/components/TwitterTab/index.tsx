import * as React from 'react';
import './TwitterTab.css';
import { Table, Input, Button, Result, message } from 'antd/lib';
import api from '../../../api';
import { TwitterTabConfig } from '../../screens';

const { Search } = Input;

interface TwitterTabProps {
  airdropID: string;
  twitterConfig: TwitterTabConfig;
  onTwitterSuccess: any;
}

export const TwitterTab: React.FC<TwitterTabProps> = (props: TwitterTabProps) => {
  const [userNameInputState, setUserNameInputState] = React.useState('');
  const [twitterUsername, setTwitterUsername] = React.useState('');
  const [followState, setFolowState] = React.useState(false);
  const [tweetState, setTweetState] = React.useState(false);
  const [followClickState, setFolowClickState] = React.useState(false);
  const [tweetClickState, setTweetClickState] = React.useState(false);

  const handleUserNameInput = (e) => {
    setUserNameInputState(e.target.value);
  };

  const handleUserNameSubmitClick = () => {
    api.get(`/claim/find/airdrop_id=${props.airdropID}&twitter_username=${userNameInputState}`).then((response) => {
      const twitterIdList = response.data.payload;
      if (twitterIdList.length > 0) {
        message.error('Your Twitter has used in other claim.');
      } else {
        setTwitterUsername(userNameInputState);
        setUserNameInputState(userNameInputState);
      }
    });
  };

  const handleTweetCheckButton = () => {
    message.warning('Wait in few seconds. We are checking ...');
    setTimeout(() => {
      message.success('Checking successfully!');
      setTweetState(true);
    }, 5000);
  };

  const handleFollowCheckButton = () => {
    message.warning('Wait in few seconds. We are checking ...');
    setTimeout(() => {
      message.success('Checking successfully!');
      setFolowState(true);
    }, 5000);
  };

  const twitterUsernameInput = (
    <Search
      disabled={twitterUsername !== ''}
      placeholder="Twitter Username"
      enterButton="Submit"
      value={userNameInputState}
      onChange={handleUserNameInput}
      autoFocus
      onSearch={() => handleUserNameSubmitClick()}
    />
  );

  const dataSource = [
    {
      key: '1',
      step: '1',
      task:
        twitterUsername === '' ? `Enter Twitter username. Ex: @${props.twitterConfig.twitterUserName}` : '@' + twitterUsername,
      action: twitterUsernameInput,
    },
    {
      key: '2',
      step: '2',
      task: `Follow ${props.twitterConfig.twitterName} on Twitter`,
      action: followClickState ? (
        <Button type="primary" disabled={followState} onClick={() => handleFollowCheckButton()}>
          Verify
        </Button>
      ) : (
        <Button
          onClick={() => setFolowClickState(true)}
          type="primary"
          href={props.twitterConfig.twitterPage}
          target="_blank"
          disabled={twitterUsername === ''}
        >
          Follow
        </Button>
      ),
    },
    {
      key: '3',
      step: '3',
      task: `Tweet Airdrop event post of ${props.twitterConfig.twitterName}  on Twitter`,
      action: tweetClickState ? (
        <Button type="primary" onClick={() => handleTweetCheckButton()}>
          Verify
        </Button>
      ) : (
        <Button
          onClick={() => setTweetClickState(true)}
          type="primary"
          href={props.twitterConfig.twitterPost}
          target="_blank"
          disabled={twitterUsername === '' || !followState || tweetState}
        >
          Tweet
        </Button>
      ),
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
      title="Successfully Verified Twitter Task!"
      extra={[
        <Button type="primary" key="next" onClick={() => props.onTwitterSuccess(userNameInputState)}>
          Next
        </Button>,
      ]}
    />
  );

  return <div className="airdrop-twitter-tab">{followState && tweetState ? resultView : tableView}</div>;
};
