import styled from 'styled-components';

export const MarketHistory = styled.div`
  background-color: #313445;
  padding: 15px 23px;
  height: 450px;

  .rc-tabs {
    .rc-tabs-tabpane {
      outline: none;
    }
    .rc-tabs-nav-list {
      display: flex;
      .rc-tabs-tab {
        &.rc-tabs-tab-active {
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
      color: #e01e5a;
    }
    &__positive {
      color: #ecb22d;
    }
    .td-table-container {
      padding: 10px 0;
      .td-table {
        background: transparent;
        width: 100%;
        .td-table__head {
          font-size: 12px;
          background: transparent;
          tr {
            background: transparent;
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
          font-size: 10px;
          color: #fff;
          background: transparent;
          tr {
            background: transparent;
            td.td-table__empty:nth-child(2) {
              text-align: center;
            }
            td {
              color: #fff;
              padding: 5px 0 !important;
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
