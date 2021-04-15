import * as React from 'react'
import { CountdownBox } from '../../components'
import Countdown from 'react-countdown';

import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons'

import './DetailInfo.css';

interface DetailInfoProps {
    airdropName: string;
    airdropBonus: string;
    status: number;
    date: string;
}


export const DetailInfo: React.FC<DetailInfoProps> = (props: DetailInfoProps) => {

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            window.location.reload();
            return <span>Timeout</span>;
        } else {
            // Render a countdown
            return <CountdownBox status={props.status} days={days} hours={hours} minutes={minutes} seconds={seconds} />;
        }
    };

    const resultView =
        <Result
            icon={<SmileOutlined />}
            title='Be ready for delivering. Thank you for paricipating!'
        />

    const countDownView =
        <div>
            <Countdown
                date={new Date(props.date)}
                renderer={renderer}
            />

            <div className="text-center">
                <div className="airdrop-total">{props.airdropName}</div>
                <div className="airdrop-title">{props.airdropBonus}</div>
            </div>
        </div>


    return (
        <div>
            {props.status === 3 ? resultView : countDownView}
        </div>
    )
}




