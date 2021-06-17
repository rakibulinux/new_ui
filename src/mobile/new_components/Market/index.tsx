import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const Market = () => {
	return (
		<div className="td-market">
			<div className="td-market__header d-flex justify-content-between">
				<div className="td-market__header__title">Market</div>

				<div className="td-market__header__search">
					<FaSearch />
				</div>
			</div>

			<div className="td-market__body">
				<div className="td-market__body__selection ">
					<div className="td-market__body__selection__desc">Tuỳ chọn</div>

					<div className="td-market__body__selection__box">
						<p className="td-market__body__selection__box__item"> USDT</p>
						<p className="td-market__body__selection__box__item"> USDT</p>
						<p className="td-market__body__selection__box__item"> USDT</p>
						<p className="td-market__body__selection__box__item"> USDT</p>
					</div>
				</div>
			</div>
		</div>
	);
};
