import { Card } from 'antd';
import * as React from 'react';
import './CardInfo.css';

interface CardInfoProps {
	cardTitle: string;
}

export class CardInfo extends React.Component<CardInfoProps> {
	public render() {
		return (
			<Card style={{ width: '100%', height: '100%', backgroundColor: '#2B3139' }} title={this.props.cardTitle}>
				{this.props.children}
			</Card>
		);
	}
}
