import { useAnnouncementFetch } from 'hooks';
import { ListIcon, SpeakIcon } from 'mobile/assets/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';

// tslint:disable-next-line: no-empty-interface
interface AnnouncmentProps {}

const settings: Settings = {
	dots: false,
	infinite: true,
	speed: 2500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 4000,
	arrows: false,
};

export const Announcment: React.FC<AnnouncmentProps> = ({}) => {
	const announcements = useAnnouncementFetch().slice(0, 4);

	return (
		<div className="td-mobile-screen-home__announcment">
			<SpeakIcon />
			<div className="td-mobile-screen-home__announcment__slider">
				<div className="td-mobile-screen-home__announcment__slider__inner">
					<Slider {...settings}>
						{announcements.map((announcement, i) => (
							<Link
								key={i}
								className="td-mobile-screen-home__announcment__to-post"
								to={`/announcement/detail/${announcement.id}`}
							>
								{announcement.title}
							</Link>
						))}
					</Slider>
				</div>
			</div>
			<Link to="/announcement">
				<ListIcon />
			</Link>
		</div>
	);
};
