import axios from 'axios';
import { Decimal } from 'components';
import isNaN from 'lodash/isNaN';
import * as React from 'react';

const HOST_CONVERT = 'https://zozitech.herokuapp.com';

export const useConvertToUSD = (value = 0, symbol?: string, precision = 6, defaultValue = '0.00') => {
	const [exchangeRate, setExchangeRate] = React.useState<number>(0);

	React.useEffect(() => {
		// tslint:disable-next-line: no-floating-promises
		(async () => {
			try {
				if (value && symbol && !exchangeRate) {
					const response = await axios.get<{
						price: number;
					}>(`${HOST_CONVERT}/api/convert/to-usd?amount=1&convert=USD&symbol=${symbol.toUpperCase()}`);
					setExchangeRate(response.data.price);
				}
				// tslint:disable-next-line: no-empty
			} catch (error) {
				// console.log(error);
			}
		})();
	}, [value, symbol]);

	const price = value * exchangeRate;

	return isNaN(price) || !Boolean(price) ? defaultValue : Decimal.formatRemoveZero(price, precision);
};
