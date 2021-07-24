import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface AirdropCoinListScreenProps {}

export const AirdropCoinListScreen: React.FC<AirdropCoinListScreenProps> = ({}) => {
	let data = [
		{
			airdrop_id: 1,
			airdrop_title: 'Proident consectetur id sint laboris non do esse pariatur magna dolore exercitation.',
			airdrop_img_src: 'http://unsplash.it/500/200?random',
			airdrop_link: 'https://t.me/MyCX123z_bot',
			created_at: '2021-07-24T05:14:14.000Z',
			updated_at: '2021-07-24T05:14:14.000Z',
		},
	];

	data = [...data, ...data, ...data];
	data = [...data, ...data, ...data];
	data = [...data, ...data, ...data];

	return (
		<div className="pg-airdrop-list-coin">
			<div className="container">
				<div className="pg-airdrop-list-coin__list">
					{data.map((item, i) => (
						<div className="pg-airdrop-list-coin__list__item" key={i}>
							<div className="pg-airdrop-list-coin__list__item__left">
								<img className="pg-airdrop-list-coin__list__item__img" src={item.airdrop_img_src} alt="img" />
							</div>
							<div className="pg-airdrop-list-coin__list__item__right">
								<div className="pg-airdrop-list-coin__list__item__right__inner">
									<div className="pg-airdrop-list-coin__list__item__right__top">
										<div className="pg-airdrop-list-coin__list__item__title">{item.airdrop_title}</div>
									</div>
									<div className="pg-airdrop-list-coin__list__item__right__bottom">
										<a
											className="pg-airdrop-list-coin__list__item__link"
											href={item.airdrop_link}
											target="_blank"
											rel="noopener noreferrer"
										>
											<button className="pg-airdrop-list-coin__list__item__link__button">
												Select Join
											</button>
										</a>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
