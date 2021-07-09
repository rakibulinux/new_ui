import { InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import * as React from 'react';
import './SaleSocial.css';

interface SaleSocialProps {
	website?: string;
	whitepaper?: string;
	ico?: string;
	facebook?: string;
	twitter?: string;
	telegram?: string;
	instagram?: string;
	linkedin?: string;
}

export const SaleSocial: React.FC<SaleSocialProps> = (props: SaleSocialProps) => {
	const TelegramIcon = require('../../../../../assets/images/landing/social/Telegram.svg');
	const FacebookIcon = require('../../../../../assets/images/landing/social/Facebook.svg');
	const TwitterIcon = require('../../../../../assets/images/landing/social/Twitter.svg');

	return (
		<React.Fragment>
			<Row gutter={[32, 16]} className="link-wrapper-mobile">
				<Col span={8} className="text-center">
					<Button style={{ backgroundColor: '#3C4055', border: '#3C4055' }} block href={props.website} target="_blank">
						Website
					</Button>
				</Col>
				<Col span={8} className="text-center">
					<Button
						style={{ backgroundColor: '#3C4055', border: '#3C4055' }}
						block
						href={props.whitepaper}
						target="_blank"
					>
						WhitePaper
					</Button>
				</Col>
				<Col span={8} className="text-center">
					<Button style={{ backgroundColor: '#3C4055', border: '#3C4055' }} block href={props.ico} target="_blank">
						ICO
					</Button>
				</Col>
			</Row>
			<hr />
			<div className="social-item-mobiles">
				{props.twitter ? (
					<div>
						{' '}
						<a href={props.twitter} target="_blank" rel="noopener noreferrer">
							<img src={TwitterIcon} alt="telegram" />
						</a>{' '}
					</div>
				) : (
					''
				)}
				{props.facebook ? (
					<div>
						{' '}
						<a href={props.facebook} target="_blank" rel="noopener noreferrer">
							<img src={FacebookIcon} alt="telegram" />
						</a>{' '}
					</div>
				) : (
					''
				)}
				{props.instagram ? (
					<div>
						{' '}
						<a href={props.instagram} target="_blank" rel="noopener noreferrer">
							<InstagramOutlined className="social-item-mobile" />
						</a>{' '}
					</div>
				) : (
					''
				)}
				{props.linkedin ? (
					<div>
						{' '}
						<a href={props.linkedin} target="_blank" rel="noopener noreferrer">
							<LinkedinOutlined className="social-item-mobile" />
						</a>{' '}
					</div>
				) : (
					''
				)}
				{props.telegram ? (
					<div>
						{' '}
						<a href={props.telegram} target="_blank" rel="noopener noreferrer">
							<img src={TelegramIcon} alt="telegram" />
						</a>{' '}
					</div>
				) : (
					''
				)}
			</div>
		</React.Fragment>
	);
};
