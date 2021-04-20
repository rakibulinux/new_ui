import styled from 'styled-components';

export const MarketTradingStyle = styled.div`
  background-color: #313445;
  height: 450px;
  padding: 15px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .rc-tabs {
    overflow: hidden;
    flex: 1;
    .rc-tabs-tabpane {
      outline: none;
    }
    .rc-tabs-nav-operations {
      display: none;
    }
    .rc-tabs-nav-list {
      background-color: transparent !important;
      padding: 0 15px;
      margin-top: 10px;
      margin-bottom: 10px;

      display: flex;
      color: #fff;
      background-color: #4e5463;
      .rc-tabs-ink-bar {
        display: none;
      }
      .rc-tabs-tab {
        flex: 1;
        height: 25px;
        border-radius: 2px;
        cursor: pointer;
        &-active {
          background-color: #2fb67e;
        }
        .rc-tabs-tab-btn {
          :focus {
            outline: none;
          }
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
`;

export const SearchBlockStyle = styled.div`
  padding: 0 15px 25px 15px;
  .search-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #848e9c;
    padding: 7px 0;
    .search-icon {
      margin-right: 20px;
    }
    .search-input {
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
`;

export const StarBlockStyle = styled.div`
  padding: 0 15px;
  display: flex;
  align-items: center;
  img {
    margin-right: 14px;
  }
  button {
    border: none;
    border-radius: 2px;
    outline: none;
    background: transparent;
    padding: 5px 6px;

    color: #fff;
    &.active {
      background-color: rgba(132, 142, 156, 0.35);
    }
  }
`;

export const MarketsListTradingStyle = styled.div`
  font-size: 10px;
  .pg-dropdown-markets-list-container {
    padding-right: unset;
    &__negative {
      color: #e01e5a;
    }
    &__positive {
      color: #ecb22d;
    }
    .td-table {
      background-color: transparent;
      thead {
        background-color: transparent;
        font-size: 12px;
        tr {
          background-color: transparent;
          th {
            color: #848e9c;
            background-color: transparent;
            padding: 5px 0 !important;
            text-align: right;
            width: calc(100% / 4);
            :first-child {
              text-align: left;
            }
            :last-child {
              width: calc(100% - 100% / 4 * 2);
            }
            > span {
              padding: 0 15px;
            }
          }
        }
      }
      tbody {
        background-color: transparent;
        tr {
          &.td-table__row--selected {
            background-color: #4e5463;
          }
          background-color: transparent;
          td {
            background-color: transparent;
            padding: 5px 0 !important;
            width: calc(100% / 4);
            text-align: right;
            > span {
              padding: 0 15px;
            }
            :first-child {
              text-align: left;
              color: #fff;
              > span {
                display: flex;
                align-items: center;
                > span {
                  margin-right: 5px;
                }
              }
            }
            :last-child {
              width: calc(100% - 100% / 4 * 2);
            }
          }
        }
      }
    }
  }
`;
