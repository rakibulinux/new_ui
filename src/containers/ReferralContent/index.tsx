import * as React from 'react';
import { copy } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { alertPush, selectUserInfo } from '../../modules';

import FB from './Assets/fb.svg';
import TELE from './Assets/tg.svg';
import TW from './Assets/tw.svg';

import { QRCode } from 'components';
const QR_SIZE = 200;
const REFERRAL_LINK = (referralID: string) => `https://cx.finance?ref=${referralID}`;

export const ReferralContent: React.FC = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUserInfo);

	const handleCopyText = () => {
		copy('referral-link');
		dispatch(alertPush({ message: ['page.referral.link.copy.success'], type: 'success' }));
	};

	const renderReferralContent = () => {
		const referralID = user.referal_uid || '';
		return (
			<div className="container">
				<div className="td-referral-content__wrapper">
					<div className="row">
						<div className="col-md-8 d-flex justify-content-start">
							<div className="referral-container-QRcode">
								<QRCode dimensions={QR_SIZE} data={REFERRAL_LINK(referralID)} />
							</div>
							<div className="referral-container-content ml-5">
								<div
									className="referral-container-content__ID d-flex"
									style={{
										marginTop: '10px',
									}}
								>
									<p>My Referral ID:</p>
									<p className="text-white" style={{ marginLeft: '20px' }}>
										{referralID}
									</p>
								</div>
								<div
									className="referral-container-content__link d-flex align-items-center"
									style={{
										marginTop: '16px',
									}}
									onClick={handleCopyText}
								>
									<p>Referral Link:</p>
									<input
										className="text-white"
										style={{
											marginLeft: '30px',
											backgroundColor: '#2B2E3D',
											borderRadius: '5px',
											border: 'none',
											padding: '6px',
											outline: 'none',
										}}
										type="text"
										id="referral-link"
										defaultValue={REFERRAL_LINK(referralID)}
										readOnly={true}
									></input>
									<p
										className="ml-3 text-center"
										style={{
											backgroundColor: '#2FB67E',
											borderRadius: '4px',
											padding: '6px 16px',
											color: '#FFF',
											cursor: 'pointer',
											marginBottom: '0',
										}}
									>
										Copy Link
									</p>
								</div>
								<div
									className="referral-container-content__share d-flex"
									style={{
										marginTop: '12px',
									}}
								>
									<p>Share:</p>
									<div style={{ marginLeft: 66 }}>
										<img src={FB} alt="facabook" />
										<img src={TELE} alt="telefram" />
										<img src={TW} alt="twitter" />
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4 d-flex flex-column justify-content-around border-left border-dark">
							<div className="referral-container__friend d-flex justify-content-between border-bottom border-dark w-100">
								<p>Referral friends</p>
								<p className="text-white">0</p>
							</div>
							<div className="referral-container__Referral__Commission-value">Estimated Commission Value</div>
							<div className="referral-container__coin-name d-flex flex-row-reverse text-white">0.00000000 BTC</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderReferralTable = () => {
		return (
			<div>
				<div className="td-referral-content__table">
					<div className="container">
						<div className="row td-referral-content__table__row ">
							<div className="col-md-4 td-referral-content__table__row__col-left">
								<h4>Referral Friends</h4>
								<div className="row mt-3">
									<div className="col-md-6 text-center">Email</div>
									<div className="col-md-6 text-center">Date</div>
								</div>
							</div>
							<div className="col-md-8 td-referral-content__table__row__col-right">
								<h4>Lastest Commission History</h4>
								<div className="row mt-3">
									<div className="col-md-3 text-center">Commision</div>
									<div className="col-md-3 text-center">Email</div>
									<div className="col-md-3 text-center">Date</div>
									<div className="col-md-3 text-center">Description</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="td-referral-content">
			{renderReferralContent()}
			{renderReferralTable()}
		</div>
	);
};
