import * as React from 'react';
import styled from 'styled-components';

import { NewTeamSection, NewMarketList} from '../../containers';
import Feature1 from './Home/Feature1.svg';
import Feature2 from './Home/Feature2.svg';
import Feature3 from './Home/Feature3.svg';


const Title = styled.h1`
	color: #fff;
	font-size: 3em;
	font-weight: bold;
	padding-bottom: 20px;
	margin-bottom: 102px;
	text-align: center;
`;

export const NewHomePage: React.FC = () => {

	const banner = require('./Home/bannercx.png');

	const renderTitle = () => (

		<div className="main_page__title" style={{ backgroundImage: "url(" + banner + ")" }}>
			<div className="container">
				<div className="cx-title">
					<h2 className="cx-title_exchange">CircleEX Exchange</h2>
					<p className="cx-title_description">First Governance Community Exchange<br />For the community By the Community</p>
					<a href="" className="cx-title_action">Get Started</a>
				</div>
			</div>
		</div>
	)

	const renderMarkets = () => {
		return (
			<NewMarketList />
		)
	}
	const renderFeature = () => (

		<div style={{ padding: "150px 0", backgroundColor: '#252A3B' }}>
			<div className="row">
				<div className="col-12">
					<Title>FEATURES</Title>
				</div>
			</div>
			<div className="container text-white">
				<div className="row">
					<div className="col-4 text-center">
						<img className="img-fluid w-50" src={Feature2} alt="support" />
						<h3 style={{ marginTop: 62 }}>Revenue Sharing</h3>
					</div>
					<div className="col-4 text-center">
						<img className="img-fluid w-50" src={Feature1} alt="support" />
						<h3 style={{ marginTop: 62 }}>Multi Layer Protection</h3>
					</div>
					<div className="col-4 text-center">
						<img className="img-fluid w-50" src={Feature3} alt="support" />
						<h3 style={{ marginTop: 62 }}>Community-Driven</h3>
					</div>
				</div>
			</div>
		</div>
	)

	const renderPoster = () => {
		const Download1 = require('./Home/download1.png');
		const Download2 = require('./Home/download2.png');
		const DownloadGG = require('./Home/downloadGG.png');
		const DownloadAPP = require('./Home/downloadAPP.png');
		const BannerCX = require('./Home/banner_cx.png');
		return (
			<div style={{ padding: '50px 0', backgroundColor: '#FFFFFF' }}>
				<div className="container">
					<div className="row">
						<div className="col-6">
							<div className="row">
								<div className="col-12">
									<h1 style={{ color: '#000' }}>Trade anytime and anywhere</h1>
									<h4 className="mt-5" style={{ color: '#000' }}>
										Download CircleEx APP, you will be able to easily at any time, anywhere trading global
										mainstream, popular digital assets.
										</h4>
								</div>
							</div>
							<div className="row mt-5">
								<div className="col-6">
									<img className="img-fluid" src={DownloadAPP} alt="apple+store" />
								</div>
								<div className="col-6">
									<img width="255px" src={Download1} alt="scan+qrcode" />
								</div>
								<div className="col-6 mt-3">
									<img className="img-fluid" src={Download2} alt="android+apk" />
								</div>
								<div className="col-6 mt-3">
									<img className="img-fluid" src={DownloadGG} alt="google+play" />
								</div>
							</div>
						</div>
						<div className="col-6 pl-5" >
							<img className="img-fluid" src={BannerCX} alt="exchange" />
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderTeam = () => {
		return (
			<div style={{ padding: '50px 0' }}>
				<NewTeamSection />;
			</div>
		)
	};

	return (
		<div className="main_page">
			{renderTitle()}
			{renderMarkets()}
			{renderFeature()}
			{renderPoster()}
			{renderTeam()}
		</div>
	)
}
