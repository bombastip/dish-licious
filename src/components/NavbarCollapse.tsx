import { Navbar } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Notifications, SearchNavbarItem } from '.';

const NavbarCollapse = () => {
    return (
        <Navbar.Collapse>
            <Navbar.CollapseItem key={'add-post'}>
                <Link to={`add-post`}>Add Post</Link>
            </Navbar.CollapseItem>
            <Navbar.CollapseItem key={'favourites'}>
                <Link to={`favourites`}>Favourites</Link>
            </Navbar.CollapseItem>
            <Navbar.CollapseItem key={'search'}>
                <SearchNavbarItem />
            </Navbar.CollapseItem>
            <Navbar.CollapseItem key={'notifications'}>
                <Notifications />
            </Navbar.CollapseItem>
        </Navbar.Collapse>
    );
};

export default NavbarCollapse;
