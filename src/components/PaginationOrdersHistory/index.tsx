import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface PaginationProps {
	pageIndex: number;
	nextPageExists?: boolean;
	max_page: number;
	onclickFirstPage: () => void;
	onClickPrevPage: () => void;
	onClickLastPage: () => void;
	onClickNextPage: () => void;
}

export const Pagination = (paginationProps: PaginationProps) => {
	const { pageIndex, max_page } = paginationProps;

	const renderFirstPage = () => {
		const disable = pageIndex === 1;
		const onclickFirstPage = () => {
			if (disable) {
				return;
			}
			paginationProps.onclickFirstPage();
		};
		const classname = disable
			? 'history-screen__tabs__content__pagination__content__item__link history-screen__tabs__content__pagination__content__item__link--disable'
			: 'history-screen__tabs__content__pagination__content__item__link';

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onclickFirstPage}>
				<p className={classname}>
					<FaAngleDoubleLeft />
				</p>
			</li>
		);
	};

	const renderPrevPage = () => {
		const disable = pageIndex === 1;
		const onClickPrevPage = () => {
			if (disable) {
				return;
			}
			paginationProps.onClickPrevPage();
		};
		const classname = disable
			? 'history-screen__tabs__content__pagination__content__item__link history-screen__tabs__content__pagination__content__item__link--disable'
			: 'history-screen__tabs__content__pagination__content__item__link';

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickPrevPage}>
				<p className={classname}>
					<FaAngleLeft />
				</p>
			</li>
		);
	};
	const renderLastPage = () => {
		const disable = pageIndex === max_page;
		const onClickLastPage = () => {
			if (disable) {
				return;
			}
			paginationProps.onClickLastPage();
		};
		const classname = disable
			? 'history-screen__tabs__content__pagination__content__item__link history-screen__tabs__content__pagination__content__item__link--disable'
			: 'history-screen__tabs__content__pagination__content__item__link';

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickLastPage}>
				<p className={classname}>
					<FaAngleDoubleRight />
				</p>
			</li>
		);
	};

	const renderNextPage = () => {
		const disable = pageIndex === max_page;
		const onClickNextPage = () => {
			if (disable) {
				return;
			}
			paginationProps.onClickNextPage();
		};
		const classname = disable
			? 'history-screen__tabs__content__pagination__content__item__link history-screen__tabs__content__pagination__content__item__link--disable'
			: 'history-screen__tabs__content__pagination__content__item__link';

		return (
			<li className="history-screen__tabs__content__pagination__content__item" onClick={onClickNextPage}>
				<p className={classname}>
					<FaAngleRight />
				</p>
			</li>
		);
	};

	return (
		<div>
			<nav>
				<ul className="history-screen__tabs__content__pagination__content">
					{renderFirstPage()}
					{renderPrevPage()}
					<div className="ml-2">
						Page <span className="text-white">{pageIndex}</span>
					</div>
					{renderNextPage()}
					{renderLastPage()}
				</ul>
			</nav>
		</div>
	);
};
