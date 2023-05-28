import { Link, Navbar } from '@nextui-org/react';

const NavbarCollapse = () => {
    const collapseItems = ['Add Post', 'Feed', 'Favorites', 'Notifications', 'Search'];

    return (
        <Navbar.Collapse>
            {collapseItems.map((item, index) => (
                <Navbar.CollapseItem
                    key={item}
                    activeColor="#fedebe"
                    css={{
                        color: index === collapseItems.length - 1 ? '$error' : '',
                    }}
                    isActive={index === 2}
                >
                    <Link
                        color="secondary"
                        css={{
                            minWidth: '100%',
                        }}
                        href="#"
                    >
                        {item}
                    </Link>
                </Navbar.CollapseItem>
            ))}
        </Navbar.Collapse>
    );
};

export default NavbarCollapse;
