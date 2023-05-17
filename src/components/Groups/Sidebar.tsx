import { Container } from '@nextui-org/react';

interface SidebarProps {
    groupID: string;
}
const Sidebar = ({ groupID }: SidebarProps) => {
    return <Container>Sidebar {groupID} members with option to remove from admin</Container>;
};

export default Sidebar;
