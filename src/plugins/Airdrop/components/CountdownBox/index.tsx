import * as React from 'react';
import './CountdownBox.css';

interface CountdownBoxProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    status: number;
}

export class CountdownBox extends React.Component<CountdownBoxProps> {
    public render() {
        let title;
        switch (this.props.status) {
            case 0:
                title = 'READY FOR STARTING';
                break;
            case 1:
                title = 'LET\'S DO TASK AND CLAIM';
                break;
            case 2:
                title = 'DELIVER';
                break;
            default:
                title = '';
                break;
        }

        return (
            <div id="container-countdown">
                <div className="balloon white">
                    <div className="star-red"/>
                    <div className="face">
                        <div className="eye"/>
                        <div className="mouth happy"/>
                    </div>
                    <div className="triangle"/>
                    <div className="string"/>
                </div>
                <div className="balloon red">
                    <div className="star"/>
                    <div className="face">
                        <div className="eye"/>
                        <div className="mouth happy"/>
                    </div>
                    <div className="triangle"/>
                    <div className="string"/>
                </div>
                <div className="balloon blue">
                    <div className="star"/>
                    <div className="face">
                        <div className="eye"/>
                        <div className="mouth happy"/>
                    </div>
                    <div className="triangle"/>
                    <div className="string"/>
                </div>
                <div id="countdown-timer">
                    <div className="days">
                        <div className="numbers">{this.props.days}</div>days</div>
                    <div className="hours">
                        <div className="numbers">{this.props.hours}</div>hours</div>
                    <div className="minutes">
                        <div className="numbers">{this.props.minutes}</div>minutes</div>
                    <div className="seconds">
                        <div className="numbers">{this.props.seconds}</div>seconds</div>
                </div>
                <h1>{title}</h1>
            </div >
        );
    }
}
