import * as React from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import { selectAnnouncement } from "../../modules";

import { useDispatch, useSelector, } from "react-redux";
import { announcementUpdate } from "../../modules/info/announcement/actions";

import { useParams, useHistory, } from "react-router-dom";


const InpuStyle = styled.input`
width: 100%;
height: 42px;
margin-bottom: 20px;
outline: none;
border: 1px solid #666;
border-radius: 2px;
background: #fff;

`;

const AdminAnnounStyle = styled.div`
  padding: 20px;
`;

const ButtonStyle = styled.button`
  outline: none;
  border-radius: 2px;
  border: 1px solid #2a9d8f;
  color: #fff;
  background-color: #2a9d8f;
  margin-top: 40px;
  padding: 8px 20px;
  :focus{
    outline: none;
  }
  :hover {
    background-color: #74c69d;
  }
`;

interface AnnouncementType {
  title: string;
  content: string;
  announcement_img_pc: string;
  id: any;
}

export const AnnouncementEdit: React.FC = (props) => {

  const dispatch = useDispatch();
  const { id }  = useParams<any>(); // id announcement
  
  const announcements = useSelector(selectAnnouncement);

  //state
  const [postAnnouncementUpdate, setPostAnnouncementUpdate] = React.useState<AnnouncementType>({
    title: '',
    content: '',
	announcement_img_pc: '',
    id: id,
  });

  React.useEffect(() => {
	const announcementEdit = announcements.data.find(item => item.id === Number(id));
	announcementEdit && setPostAnnouncementUpdate(announcementEdit)
	
  },[id])

  const handleHeading = (e: any) => {
    e.persist();
    setPostAnnouncementUpdate((prev) => ({
      ...prev,
      title: e.target.value
    }))
  }
  const handleUrlImage =(e: any) => {
	e.persist();
	setPostAnnouncementUpdate((prev) => ({
		...prev,
		announcement_img_pc: e.target.value
	  }))
  }

  const history = useHistory();

  const handleEditAnnouncement: React.DOMAttributes<HTMLFormElement>["onSubmit"] = async (e) => {
    e.preventDefault();
    await dispatch(announcementUpdate(postAnnouncementUpdate));

	history.push("/announcement");
  }

  const renderAdminAnnouncement = () => {

    return (
      <div className="container">
        <AdminAnnounStyle>
          <form onSubmit={handleEditAnnouncement}>

            <InpuStyle type="text" placeholder="Enter heading..." onChange={handleHeading} value={postAnnouncementUpdate.title}/>
			<InpuStyle type="text" placeholder="url image..." onChange={handleUrlImage} value={postAnnouncementUpdate.announcement_img_pc}/>
            <CKEditor
			  data={postAnnouncementUpdate.content}
              editor={ClassicEditor}
              onChange={(_event, editor: any) => {

                setPostAnnouncementUpdate((prev) => ({
                  ...prev,
                  content: editor.getData()
                }))
              }}
            />
            <ButtonStyle type="submit">Edit</ButtonStyle>

          </form>
        </AdminAnnounStyle>
      </div>
    )
  }

  return (
    <div>
      {renderAdminAnnouncement()}
    </div>
  )
}
