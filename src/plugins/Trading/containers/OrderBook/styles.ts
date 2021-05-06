import styled from 'styled-components';

interface OrderBookProps {
  tabState: 'all' | 'buy' | 'sell';
}

const OrderStyleVar = {
  headHeight: '32px',
};

export const OrderBookStyle = styled.div<OrderBookProps>`
  height: 100%;
  color: white;
  .td-order-book {
    background-color: #313445;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 15px;
    &-item__negative {
      color: var(--header-negative-text-color);
    }
    &-item__positive {
      color: var(--header-positive-text-color);
    }
    &-tooltip {
      bottom: 200px;
    }
    &-header {
      height: ${OrderStyleVar.headHeight};
      svg {
        cursor: pointer;
      }
    }
    &-tbheader {
      padding: 6px 23px;
      font-size: 10px;
      color: #848e9c;
    }
    &-ticker {
      margin: 5px 23px !important;
      font-size: 14px;
      &__last-price {
        font-size: 16px;
      }
      &__volume {
        color: #848e9c;
      }
    }
    &-table {
      font-size: 10px;
      height: ${(props: OrderBookProps) => (props.tabState === 'all' ? '380px' : 'calc(380px*2)')};
      display: block;
      thead,
      tbody {
        display: block;
        tr {
          display: block;
          padding: 0 23px;
          height: 18px;
          line-height: 18px;
          background-color: transparent;
          cursor: pointer;
          :hover {
            background-color: #4e5463;
          }
          td,
          th {
            width: calc(100% / 3);
            display: inline-block;
            text-align: right;
            :first-child {
              text-align: left;
            }
          }
        }
      }
      tbody {
        height: 100%;
        overflow-y: scroll;
        tr {
          margin-top: 1px;
          margin-bottom: 1px;
          td {
            height: 100%;
          }
        }
      }
      &.td-reverse-table-body {
        tbody {
          transform: rotate(180deg);
          .td-order-book-table__empty_data {
            transform: rotate(180deg);
          }
          tr {
            direction: rtl;
            td {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }
`;

interface TrProps {
  percentWidth: number;
  placement: 'left' | 'right';
  color: string;
}

export const TrStyle = styled.tr<TrProps>`
  position: relative;
  z-index: 5;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props: TrProps) => (props.placement === 'right' ? 0 : 'unset')};
    bottom: 0;
    left: ${(props: TrProps) => (props.placement === 'left' ? 0 : 'unset')};
    background-color: ${(props: TrProps) => props.color};
    width: ${(props: TrProps) => props.percentWidth}%;
    z-index: -5;
  }
`;
