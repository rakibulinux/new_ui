import * as React from 'react';
import { IEOItem } from './../../components';

export const ListItemIEO = () => {
	const listIEO = [
		{
			id: 1,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'usd',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-09T00:00:00.000Z',
			end_date: '2021-06-20T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'running',
		},
		{
			id: 2,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'lkt',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-20T00:00:00.000Z',
			end_date: '2021-06-30T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'upcoming',
		},
		{
			id: 3,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'usd',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-09T00:00:00.000Z',
			end_date: '2021-06-20T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'ended',
		},
		{
			id: 1,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'usd',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-09T00:00:00.000Z',
			end_date: '2021-06-20T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'running',
		},
		{
			id: 2,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'lkt',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-20T00:00:00.000Z',
			end_date: '2021-06-30T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'upcoming',
		},
		{
			id: 3,
			description: 'Listing ConfirmedBonus 10%',
			image_link: 'shorturl.at/yFHU1',
			currency_id: 'usd',
			currency_available: ['btc', 'eth', 'USDT', 'PROB', 'XRP'],
			total_ieo: 100000,
			remains: '100000',
			price: 100,
			min_buy: 50,
			start_date: '2021-06-09T00:00:00.000Z',
			end_date: '2021-06-20T00:00:00.000Z',
			bonus: '10',
			social: null,
			uniswap_link: null,
			type: 'ended',
		},
	];
	return (
		<div id="ioe-listing-screen-ieos" className="row">
			{listIEO.map(item => (
				<div className="col-4" style={{ padding: '10px 10px 10px 10px' }}>
					<IEOItem
						type={item.type}
						currencyId={item.currency_id}
						startDate={item.start_date}
						endDate={item.end_date}
						currencyAvailable={item.currency_available}
						description={item.description}
						bonus={item.bonus}
					/>
				</div>
			))}
		</div>
	);
};
