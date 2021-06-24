import * as React from 'react';
import { IEOItem } from './../../components';
// import { FiSearch } from 'react-icons/ai';
interface ListItemIEOProps {
	type: string;
}
export const ListItemIEO: React.FC<ListItemIEOProps> = props => {
	const listIEO = [
		{
			id: '1',
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
			type: 'ongoing',
		},
		{
			id: '2',
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
			id: '3',
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
			id: '4',
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
			type: 'ongoing',
		},
		{
			id: '5',
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
			id: '6',
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
			{listIEO.map((item, index) => {
				return props.type == 'all' || item.type == props.type ? (
					<div className="col-md-6 col-lg-4 col-xl-3" style={{ padding: '10px 10px' }}>
						<IEOItem
							type={item.type}
							currencyId={item.currency_id}
							startDate={item.start_date}
							endDate={item.end_date}
							currencyAvailable={item.currency_available}
							description={item.description}
							bonus={item.bonus}
							key={index}
							id={item.id}
						/>
					</div>
				) : (
					<></>
				);
			})}
		</div>
	);
};
