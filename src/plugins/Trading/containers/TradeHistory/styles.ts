import styled from 'styled-components';
import { TableBlockStyle } from '../../components/Table/styles';

export const MarketHistory = styled.div`
	background-color: #313445;
	padding: 15px 13px 15px 26px;
	height: 100%;

	.rc-tabs {
		height: 100%;
		display: flex;
		flex-direction: column;
		.rc-tabs-tabpane {
			outline: none;
		}
		.rc-tabs-nav-list {
			display: flex;
			.rc-tabs-tab {
				font-weight: 500;
				&.rc-tabs-tab-active {
					font-weight: 600;
					.rc-tabs-tab-btn {
						color: #fff;
						border-bottom: 2px solid #2fb67e;
					}
				}
				:not(:last-child) {
					margin-right: 24px;
				}
				.rc-tabs-tab-btn {
					color: #848e9c;
					font-size: 14px;
					padding: 5px 0;
					outline: none;
					cursor: pointer;
				}
			}
		}
		.rc-tabs-content-holder {
			flex: 1;
			.rc-tabs-content {
				.rc-tabs-tabpane {
					.td-recent-trades__markets,
					.td-recent-trades__yours {
						${TableBlockStyle} {
							.td-table {
								tbody {
									max-height: 405px;
								}
							}
						}
					}
				}
			}
		}
		.rc-tabs-ink-bar,
		.rc-tabs-nav-operations {
			display: none;
		}
	}
	.td-recent-trades__markets,
	.td-recent-trades__yours {
		overflow-x: hidden;
		overflow-y: scroll;
		&__negative {
			color: var(--asks);
		}
		&__positive {
			color: var(--bids);
		}
		.td-table-container {
			padding: 10px 0;
			.td-table {
				background: transparent;
				width: 100%;
				.td-table__head {
					background: transparent;
					tr {
						background: transparent;
						display: flex;
						padding-right: 20px;
						th {
							width: calc(100% / 3);
							background-color: transparent;
							padding: 2px 0 !important;
							font-weight: 400;
							color: #848e9c;
							text-align: right;
							:first-child {
								text-align: left;
							}
						}
					}
				}
				.td-table__body {
					padding-right: 15px;
					color: #fff;
					background: transparent;
					max-height: 300px;
					::-webkit-scrollbar {
						-webkit-appearance: none;
						width: 5px;
					}

					::-webkit-scrollbar-thumb {
						border-radius: 4px;
						background-color: #c4c4c4;
						box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
					}
					tr {
						background: transparent;
						td.td-table__empty:nth-child(2) {
							text-align: center;
						}
						td {
							color: #fff;
							padding: 3px 0 !important;
							text-align: right;
							background-color: transparent;
							:first-child {
								text-align: left;
							}
						}
					}
				}
			}
		}
	}
`;
