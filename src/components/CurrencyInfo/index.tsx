import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { WalletItemProps } from '../WalletItem';

export interface CurrencyInfoProps {
  wallet: WalletItemProps;
}

interface CurrencyIconProps {
  icon?: string | null;
  currency: string;
}

const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
  return props.icon ?
    <img alt="" className="cr-wallet-item__single__image-icon" src={props.icon} /> :
    <CryptoIcon code={props.currency} />;
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
  const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';

  const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';

  const currency = (props.wallet || { currency: '' }).currency.toUpperCase();

  const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

  const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
  const iconUrl = props.wallet ? props.wallet.iconUrl : null;



  return (
    <div className="cr-wallet-item__single">
      <CurrencyIcon icon={iconUrl} currency={currency} />
      <div className="info-grid">
        <div className="item1"><FormattedMessage id="page.body.wallets.balance" /></div>
        <div className="item2"><FormattedMessage id="page.body.wallets.locked" /></div>
        <div className="item3"><Decimal fixed={selectedFixed}>{balance}</Decimal></div>
        <div className="item4"><Decimal fixed={selectedFixed}>{stringLocked}</Decimal></div>
      </div>
    </div>

  );
};

export {
  CurrencyInfo,
};


