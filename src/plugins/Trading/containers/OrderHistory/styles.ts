import styled from 'styled-components';

export const OrderHistoryStyle = styled.div`
  padding: 10px;
  height: 200px;

  .td-open-orders {
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
  }

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
    .rc-tabs-tabpane {
      outline: none;
    }
    .rc-tabs-content-holder {
      flex: 1;
    }
    .rc-tabs-ink-bar,
    .rc-tabs-nav-operations {
      display: none;
    }
  }
`;
