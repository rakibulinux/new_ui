import classNames from 'classnames';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchProps {
	backToAll: () => void;
	onSearch: (pageIndex: string) => void;
}

export const HeaderSearch: React.FC<SearchProps> = ({ onSearch, backToAll }) => {
	const [isOpenInput, setIsOpenInput] = useState(true);
	const [valueSearch, setValueSearch] = useState('');

	const nonSearch = classNames('td-market__header', { 'd-none': !isOpenInput }, { 'td-market__header--show': isOpenInput });
	const search = classNames(
		'td-market__header-search ',
		{ 'd-none': isOpenInput },
		{ 'td-market__header-search--show': !isOpenInput },
	);

	const openForm = value => {
		if (value) {
			setIsOpenInput(false);
		} else {
			backToAll();
			setIsOpenInput(true);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (valueSearch !== '') {
			onSearch(valueSearch);
			e.target.reset();
		}
	};
	const onChangeInput = e => {
		setValueSearch(e.target.value);
	};

	return (
		<div>
			<div className={nonSearch}>
				<div className="td-market__header__title">Market</div>

				<div className="td-market__header__search " onClick={() => openForm(true)}>
					<FaSearch />
				</div>
			</div>
			<div className={search}>
				<div className="td-market__header-search__input input-group">
					<span>
						<FaSearch />
					</span>
					<form action="" onSubmit={handleSubmit} className=" w-100">
						<input
							type="text"
							className="form-control w-100"
							onChange={onChangeInput}
							placeholder="Tìm kiếm các thẻ"
						/>
					</form>
				</div>
				<div className="td-market__header-search__desc" onClick={() => openForm(false)}>
					Hủy
				</div>
			</div>
		</div>
	);
};
