import styled from 'styled-components';

export const OrderHistoryStyle = styled.div`
  background-color: #313445;
  padding: 10px;
  height: 350px;
  margin-bottom: 3px;

  /* .td-open-orders {
    &.td-open-orders--empty {
      thead tr th {
        font-size: 12px;
        color: #848e9c;
      }
      tbody tr td {
        color: #fff;
        font-size: 10px;
      }
    }

    &.td-open-orders--loading {
      .td-open-order-loading {
        align-items: center;
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        padding-top: calc(var(--gap) * 4.5);
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .cr-open-orders {
      * {
        background-color: transparent;
      }
    }
  } */

  .rc-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .rc-tabs-nav {
      display: flex;
      align-items: center;
      .rc-tabs-extra-content {
        padding: 0 13px;
        display: flex;
        align-items: center;
        .td-open-orders-tabs__cancel {
          color: white;
          cursor: pointer;
          :hover {
            color: red;
          }
          svg {
            margin-left: 5px;
          }
        }
      }
      .rc-tabs-nav-wrap {
        flex: 1;
        .rc-tabs-nav-list {
          padding: 0 13px;
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
      }
    }
    .rc-tabs-content-holder {
      flex: 1;
      .rc-tabs-content {
        height: 100%;
        .rc-tabs-tabpane {
          height: 100%;
          outline: none;
          padding: 8px 0;
        }
      }
    }
    .rc-tabs-ink-bar,
    .rc-tabs-nav-operations {
      display: none;
    }
  }
`;

export const TableStyle = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  color: white;
  font-size: 12px;
  th {
    text-align: left;
  }
  thead {
    color: #848e9c;
    tr {
      position: relative;
      th {
        border: none;
      }
    }
  }
  tbody {
    display: block;
    overflow: auto;
    width: 100%;
    height: 260px;
    td {
      border: none;
      font-size: 10px;
    }
  }
  tr {
    display: flex;
    th,
    td {
      flex: 1;
      padding: 3px 13px;
      :not(:first-child):not(:last-child) {
        text-align: right;
      }
      :last-child {
        text-align: center;
        svg {
          cursor: pointer;
        }
      }
    }
  }
`;

export const OpenOrdersStyle = styled.div`
  height: 100%;
  ${TableStyle} {
    tr {
      th,
      td {
        :not(:first-child):not(:last-child) {
          text-align: right;
        }
        :last-child {
          text-align: center;
          svg {
            cursor: pointer;
          }
        }
      }
    }
  }
`;

export const OrderHistoryListStyle = styled.div`
  ${TableStyle} {
    tr {
      td {
        .td-order-history-list-executed {
          color: var(--system-yellow);
        }

        .td-order-history-list-canceled {
          color: var(--system-red);
        }

        .td-order-history-list-opened {
          color: var(--system-green);
        }
      }
    }
  }
`;
