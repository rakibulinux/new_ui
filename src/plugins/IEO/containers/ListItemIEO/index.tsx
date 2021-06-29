import * as React from 'react';
import { IEOItem } from './../../components';
import { SaleItem } from './../../../../modules';

interface ListItemIEOProps {
	IEOList: Array<SaleItem>;
}
export const ListItemIEO: React.FC<ListItemIEOProps> = props => {
	const { IEOList } = props;
	const EmptyComponent = () => {
		return (
			<div className="col-12 d-flex justify-content-center">
				<img
					src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
					style={{ marginTop: '3rem' }}
					alt="empty"
				/>
			</div>
		);
	};
	return (
		<div id="ioe-listing-screen-ieos" className="row mt-5">
			{!IEOList.length
				? EmptyComponent()
				: IEOList.map((item, index) => {
						return (
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
						);
				  })}
		</div>
	);
};
