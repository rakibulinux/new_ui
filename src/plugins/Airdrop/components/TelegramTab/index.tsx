import * as React from 'react';
import { Table, Input, Button, Result, message } from 'antd/lib';
import api from '../../../api';
import { TelegramTabConfig } from '../../screens';

const { Search } = Input;

interface TelegramTabProps {
  airdropID: string;
  telegramConfig: TelegramTabConfig;
  onTelegramSuccess: any
}

export const TelegramTab: React.FC<TelegramTabProps> = (props: TelegramTabProps) => {
  const [usernameState, setUsernameState] = React.useState('');
  const onSubmit = value => {
    api.get(`/claim/find/airdrop_id=${props.airdropID}&telegram_username=${value}`)
      .then(response => {
        const telegramUsernameList = response.data.payload;
        if (telegramUsernameList.length > 0) {
          message.error('You entered used username in other claim.');
        }
        else {
          setUsernameState(value);
        }
      })
      .catch(err => {
        message.error('Please check your username again!');
      })
  }

  const [joinGroupClickState, setJoinGroupClickState] = React.useState(false);
  const [joinChannelClickState, setJoinChannelClickState] = React.useState(false);
  const [joinGroupVerifyState, setJoinGroupVerifyState] = React.useState(false);
  const [joinChannelVerifyState, setJoinChannelVerifyState] = React.useState(false);
  const handleJoinGroupVerify = () => {
    message.warning('Wait in few seconds. We are checking ...');
    setTimeout(() => {
      message.success('Checking successfully!');
      setJoinGroupVerifyState(true);
    }, 5000);
  }

  const handleJoinChannelVerify = () => {
    message.warning('Wait in few seconds. We are checking ...');
    setTimeout(() => {
      message.success('Checking successfully!');
      setJoinChannelVerifyState(true);
    }, 5000);
  }

  const dataSource = [
    {
      key: '1',
      step: '1',
      task: 'Join Telegram Group',
      action: joinGroupClickState 
      ? <Button disabled={joinGroupVerifyState} onClick={() => handleJoinGroupVerify()} type="primary" target="_blank">Verify</Button> 
      : <Button onClick={() => setJoinGroupClickState(true)} type="primary" href={props.telegramConfig.telegramGroup} target="_blank">Join</Button>,
    },
    {
      key: '2',
      step: '2',
      task: 'Join Telegram Channel',
      action: joinChannelClickState 
      ? <Button disabled={joinChannelVerifyState} onClick={() => handleJoinChannelVerify()} type="primary" target="_blank">Verify</Button> 
      : <Button onClick={() => setJoinChannelClickState(true)} type="primary" href={props.telegramConfig.telegramChannel} target="_blank">Join</Button>,
    },
    {
      key: '3',
      step: '3',
      task: 'Enter Telegram Username Joined. Ex: @CircleEx',
      action: <Search
        disabled={!(joinGroupVerifyState && joinChannelVerifyState)}
        placeholder="Telegram username"
        allowClear
        enterButton="Submit"
        size="large"
        onSearch={onSubmit}
      />,
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
    }
  ];

  const tableView = <Table pagination={false} dataSource={dataSource} columns={columns} />;
  const resultView = <Result
    status="success"
    title="Successfully Verified Telegram Task!"
    extra={[
      <Button type="primary" key="next" onClick={() => props.onTelegramSuccess(usernameState)}>
        Next
      </Button>,
    ]}
  />

  return (
    <div>
      {usernameState !== '' ? resultView : tableView}
    </div>
  );
}