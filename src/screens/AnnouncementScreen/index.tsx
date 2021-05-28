import * as React  from "react";

import {  AnnouncementContainer } from '../../containers';

export const AnnouncementScreen: React.FC = () => {

  // const user = useSelector(selectUserInfo);
  // const role = user.role;


  const renderAnnouncementScreen = () => {
    return(
      <div>
        <AnnouncementContainer/>
      </div>
    );
  }

  return(
    <div>
      {renderAnnouncementScreen()}
    </div>
  )
}