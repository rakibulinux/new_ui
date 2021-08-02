import * as React from 'react';
import { IEOItemComponent } from './../../components';
import { IEOItem } from './../../../../modules';

interface ListItemIEOProps {
	IEOList: Array<IEOItem>;
}
export const ListItemIEO: React.FC<ListItemIEOProps> = props => {
	const { IEOList } = props;

	const EmptyComponent = () => {
		return (
			<div className="col-12">
				<div className="col-12 d-flex justify-content-center">
					<img
						src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
						style={{ marginTop: '3rem' }}
						alt="empty"
					/>
				</div>
				<p className="col-12 text-center text-white h5" style={{ padding: '1rem' }}>
					No Data
				</p>
			</div>
		);
	};
	return (
		<div id="ioe-listing-screen-ieos" className="row mt-5">
			{!IEOList.length
				? EmptyComponent()
				: IEOList.map((item, index) => {
						return (
							<div key={index} className="col-md-6 col-xl-4 mb-5">
								<IEOItemComponent
									type={item.type}
									currencyId={item.currency_id}
									startDate={item.start_date}
									endDate={item.end_date}
									currencyAvailable={item.currency_available}
									description={item.description}
									bonus={item.bonus}
									remains={Number(item.remains)}
									total={Number(item.total_ieo)}
									id={item.id}
									key={index}
									progress={item.progress}
								/>
							</div>
						);
				  })}
		</div>
	);
};
