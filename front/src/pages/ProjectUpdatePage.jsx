import { useParams } from 'react-router-dom';
import { UpdateProject } from '../components/UpdateProject';
import useProject from '../hooks/useProject';

export const ProjectUpdatePage = () => {
    const { id } = useParams();
    const { updateProject, removeProject } = useProject(id);

    return <UpdateProject updateProject={updateProject} removeProject={removeProject} />;
};
