import styled from 'styled-components';

export const OrderBookStyle = styled.div`
  font-size: 12px;
  height: 800px;
  /* .pg-order-book {
    &-loader {
      align-items: center;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      padding-bottom: calc(var(--gap) * 4.5);
    }
    &-title {
      color: #fff;
    }
    &-bid,
    &-ask {
      background-color: #313445;
      padding: 15px 20px;
    }
    &-ask {
      flex-direction: column-reverse;
      left: 0;
      overflow-x: hidden;
      right: 0;
      top: 0;
    }
    &--type {
      overflow: hidden;
    } */

  .cr-new-combined-order-book {
    &-asks,
    &-bids {
      background-color: #313445;
      padding: 15px 20px;
      height: 400px;
    }
  }

  .pg-combined-order-book .cr-combined-order-book__small {
    .cr-order-book {
      position: relative;
      height: 400px;
      &:first-child {
        border-bottom: none;
        height: 50%;
        flex-direction: column-reverse;
        left: 0;
        overflow-x: hidden;
        right: 0;
        top: 0;
      }

      &:last-child {
        height: 50%;
        top: calc(48% - 4px) !important;
        border: none;

        .cr-table-background {
          top: 0;
        }
      }

      .cr-table thead {
        display: contents;
        position: fixed;
        top: 50px;
        width: 100%;
        z-index: 2222;
      }
    }
  }

  /* } */
`;
