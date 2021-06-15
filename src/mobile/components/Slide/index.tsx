import * as React from 'react';
import { useSelector } from 'react-redux';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { EventItem, selectEvents } from '../../../modules';

const settings: Settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2500,
};

const SlideComponent: React.FC = () => {
	const eventsData = useSelector(selectEvents).payload;

	const renderElms = (paramsEventsDat: EventItem[]) =>
		paramsEventsDat.map((event, i) => (
			<a rel="noopener noreferrer" href={event.ref_link} target="_blank" key={i}>
				<img src={event.image_link} alt={event.description} />
			</a>
		));

	if (!eventsData.length) {
		return (
			<div className="cr-mobile-slide">
				<div className="cr-mobile-slide__placeholder">
					<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="cr-mobile-slide">
			<Slider {...settings}>{renderElms(eventsData)}</Slider>
		</div>
	);
};

export const Slide = React.memo(SlideComponent);
