import * as React  from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAnnouncement} from '../../modules';

export const HotAnnouncement: React.FC = () => {

  const announcements = useSelector(selectAnnouncement);

  const renderAnnouncementright = () => {
	return(
		<div className="article">
		<div className="hot-article-header">Hot List</div>
		{
			announcements.data.slice(0, 5).map((announcement, index) => {
			return (
				<div className="hot-article-item" key={index}>
				<div className="hot-article-item__title">
					<Link className="hot-article-item__title-link"
					to={'/announcement/detail/' + announcement.id}>
					{announcement.title}
					</Link>
				</div>
				</div>
			);
		})}
		</div>
	);
  };

  return(
	<React.Fragment>
		{renderAnnouncementright()}
	</React.Fragment>
  );
};
