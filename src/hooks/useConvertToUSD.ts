import { API, RequestOptions } from 'api';
import { Decimal } from 'components';
import isNaN from 'lodash/isNaN';
import * as React from 'react';

const createOptions = (): RequestOptions => {
	return { apiVersion: 'sunshine' };
};

export const useConvertToUSD = (value = 0, symbol?: string, precision = 6, defaultValue = '0.00') => {
	const [exchangeRate, setExchangeRate] = React.useState<number>(0);
	const [prevSymbol, SetPrevSymbol] = React.useState<string>('');
	const refLoading = React.useRef<boolean>(false);

	React.useEffect(() => {
		// tslint:disable-next-line: no-floating-promises
		(async () => {
			try {
				if (symbol && (symbol !== prevSymbol || !exchangeRate) && !refLoading.current) {
					refLoading.current = true;
					const data = await API.get(createOptions())(
						`/public/convert/to-usd?amount=1&convert=USD&symbol=${symbol.toUpperCase()}`,
					);
					refLoading.current = false;
					SetPrevSymbol(symbol);
					setExchangeRate(data.price);
				}
				// tslint:disable-next-line: no-empty
			} catch (error) {
				// console.log(error);
			} finally {
				refLoading.current = false;
			}
		})();
	}, [value, symbol]);

	const price = value * exchangeRate;

	return isNaN(price) || !Boolean(price) ? defaultValue : Decimal.formatRemoveZero(price, precision);
};
