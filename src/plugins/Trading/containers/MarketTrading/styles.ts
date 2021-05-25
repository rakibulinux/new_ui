import styled from 'styled-components';

export const MarketTradingStyle = styled.div`
	background-color: #313445;
	height: 450px;
	padding: 15px 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

export const SearchBlockStyle = styled.div`
	padding: 10px 18px 15px 18px;
	.search-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #848e9c;
		padding: 5px 0;

		.search-icon {
			margin-right: 20px;
		}
		.search-input {
			width: inherit;
			flex: 1;
			outline: none;
			background-color: transparent;
			border: none;
			color: #fff;
			::placeholder {
				color: #848e9c;
			}
		}
	}
	.select-wrapper {
		.select-item {
			cursor: pointer;
		}
		* {
			cursor: pointer;
		}
		i {
			box-sizing: border-box;
			margin: 0px 4px 0px 0px;
			min-width: 0px;
			display: flex;
			border: 1px solid #848e9c;
			border-radius: 99999px;
			::before {
				content: '';
				width: 6px;
				height: 6px;
				margin: 2px;
			}
			&.active {
				border: 1px solid #2fb67e;
				::before {
					content: '';
					width: 6px;
					height: 6px;
					margin: 2px;
					border-radius: 99999px;
					background-color: #2fb67e;
				}
			}
		}
	}
`;

export const StarBlockStyle = styled.div`
	padding: 0 18px;
	display: flex;
	align-items: center;
	button {
		position: relative;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		border-radius: 5%;
		margin-right: 2px;
		outline: none;
		background: transparent;
		padding: 2px 6px;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: #fff;
		:hover {
			:not(.active) {
				background-color: rgb(41, 45, 63);
			}
			.td-markets-trading-list-dropdown-wrapper {
				display: inline-block;
			}
		}
		> svg {
			box-sizing: border-box;
			margin: 0px;
			min-width: 0px;
			color: currentcolor;
			font-size: 10px;
			fill: currentcolor;
			transform: scale(1.8);
			width: 1em;
			height: 1em;
		}
		.td-markets-trading-list-dropdown-wrapper {
			display: none;
			position: absolute;
			top: 22px;
			left: 0;
			z-index: 10;
			padding-top: 3px;
			.td-markets-trading-list-dropdown {
				background-color: rgb(41, 45, 63);
				&__item {
					display: flex;
					align-items: center;
					padding: 2px 6px;
					:hover {
						background-color: rgba(132, 142, 156, 0.35);
					}
					> svg {
						box-sizing: border-box;
						margin: 0px 8px 0px 0px;
						min-width: 0px;
						color: currentcolor;
						font-size: 10px;
						fill: currentcolor;
						width: 1em;
						height: 1em;
					}
				}
			}
		}

		&.favorite {
			width: 30px;
		}
		&.active {
			background-color: rgba(132, 142, 156, 0.35);
		}
	}
`;

export const MarketsListTradingStyle = styled.div`
	.td-markets-trading-list-container {
		overflow-x: hidden;
		overflow-y: scroll;
		&__negative {
			color: var(--asks);
		}
		&__positive {
			color: var(--bids);
		}
		.sort-icon svg {
			height: calc(0.5em * 1.67);
			height: calc(var(--gap) * 1.67);
			opacity: 1;
			padding-left: calc(0.5em * 0.5);
			padding-left: calc(var(--gap) * 0.5);
			vertical-align: middle;
			width: calc(0.5em * 2);
			width: calc(var(--gap) * 2);
		}
		.td-table {
			background-color: transparent;
			thead {
				background-color: transparent;
				tr {
					background-color: transparent;
					width: 100%;
					display: table;
					table-layout: fixed;
					cursor: pointer;
					th {
						color: #848e9c;
						background-color: transparent;
						padding-top: 0 0 7px 0 !important;
						padding-bottom: 0 0 7px 0 !important;
						text-align: right;
						width: calc(100% / 3);
						:first-child {
							text-align: left;
							> span {
								padding-left: 18px;
							}
						}
						:nth-child(3) {
							> span {
								padding-right: 18px;
							}
						}
						:last-child {
							display: none;
						}
					}
				}
			}
			tbody {
				max-height: 305px;
				overflow-y: scroll;
				background-color: transparent;
				tr {
					position: relative;
					&.td-table__row--selected {
						background-color: #4e5463;
					}
					margin-bottom: 1px;
					background-color: transparent;
					td.td-table__empty:nth-child(2) {
						text-align: center;
					}
					td {
						background-color: transparent;
						width: calc(100% / 3);
						text-align: right;
						padding: unset !important;
						> span {
							display: block;
						}
						:first-child {
							text-align: left;
							color: #fff;
							> span {
								.favorite {
									cursor: pointer;
								}
								display: flex;
								padding-left: 18px;
								align-items: center;
								> span {
									margin-right: 5px;
								}
							}
						}
						:nth-child(3) {
							> span {
								padding-right: 18px;
							}
						}
						:last-child {
							display: none;
						}
					}
					:hover {
						background-color: #4e5463;
					}
				}
			}
		}
	}
`;
