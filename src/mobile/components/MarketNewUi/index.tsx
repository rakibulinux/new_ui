import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const NewUiMarket = () => {
	return (
		<div className="newUiMarket">
			<div className="newUiMarket__header d-flex justify-content-between">
				<div className="newUiMarket__header__title">Market</div>

				<div className="newUiMarket__header__search">
					<FaSearch />
				</div>
			</div>

			<div className="newUiMarket__body">
				<div className="newUiMarket__body__selection ">
					<div className="newUiMarket__body__selection__desc">Tuỳ chọn</div>

					<div className="newUiMarket__body__selection__box">
						<p className="newUiMarket__body__selection__box__item"> USDT</p>
						<p className="newUiMarket__body__selection__box__item"> USDT</p>
						<p className="newUiMarket__body__selection__box__item"> USDT</p>
						<p className="newUiMarket__body__selection__box__item"> USDT</p>
					</div>
				</div>
			</div>
		</div>
	);
};
