import * as React from 'react';
import { Card } from 'antd';
import './CardInfo.css';

interface CardInfoProps {
    cardTitle: string;
}

export class CardInfo extends React.Component<CardInfoProps> {
    render() {
        return (
            <Card
                style={{ width: '100%', height: '100%', backgroundColor: '#2B3139' }}
                title={this.props.cardTitle}
            >
                {this.props.children}
            </Card>

        );
    }
}
