import { Navbar, Link, Text, Avatar, Dropdown, Image } from '@nextui-org/react';
import { styled } from '@nextui-org/react';
import { db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import Logo from '../assets/icon.png';
import { AuthContext } from '../context';
import { redirect, useNavigate } from 'react-router-dom';
import { auth } from '../config';
import { useLocation } from 'react-router-dom';

export const Box = styled('div', {
    boxSizing: 'border-box',
});

function NavbarF() {
    const location = useLocation();
    const { user, userLoading } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading || !user) {
            setUsername('');
            setPhotoURL('');
            return;
        }
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef)
            .then(doc => {
                if (doc.exists()) {
                    setUsername(doc.data().username);
                    setPhotoURL(doc.data().photoURL);
                    console.log(username);
                } else {
                    console.log(`User documentnot found`);
                }
            })
            .catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
    }, [user, username, userLoading]);
    console.log('Rendering NavbarF', username);
    const collapseItems = ['Add Post', 'Feed', 'Favorites', 'Notifications', 'Search'];

    const handleLogOut = async () => {
        try {
            await auth.signOut();
            await auth.updateCurrentUser(null);
            redirect('/login');
        } catch (error) {
            alert(error);
        }
    };

    const handleAction = (actionKey: string) => {
        if (actionKey === 'logout') {
            handleLogOut();
        } else {
            navigate(`/${actionKey}`);
        }
    };

    return (
        <div>
            {
                <Navbar isBordered variant="sticky">
                    <Navbar.Toggle showIn="xs" />
                    <Navbar.Brand
                        css={{
                            '@xs': {
                                w: '12%',
                            },
                        }}
                    >
                        <Image src={Logo} height={70} />
                        <Text b hideIn="xs">
                            Dish-licious
                        </Text>
                    </Navbar.Brand>
                    <Navbar.Content
                        enableCursorHighlight
                        activeColor="secondary"
                        hideIn="xs"
                        variant="highlight-rounded"
                    >
                        <Navbar.Link isActive={location.pathname === '/'} href="/">
                            Feed
                        </Navbar.Link>
                        <Navbar.Link isActive={location.pathname === '/add-post'} href="/add-post">
                            Add post
                        </Navbar.Link>
                        <Navbar.Link isActive={location.pathname === '/favourites'} href="/favourites">
                            Favourites
                        </Navbar.Link>
                        <Navbar.Link isActive={location.pathname === '/notifications'} href="/notifications">
                            Notifications
                        </Navbar.Link>
                        <Navbar.Link isActive={location.pathname === '/search'} href="/search">
                            Search
                        </Navbar.Link>
                    </Navbar.Content>
                    <Navbar.Content
                        css={{
                            '@xs': {
                                w: '12%',
                                jc: 'flex-end',
                            },
                        }}
                    >
                        <Dropdown placement="bottom-right">
                            <Navbar.Item>
                                <Dropdown.Trigger>
                                    <Avatar bordered as="button" color="secondary" size="md" src={photoURL} />
                                </Dropdown.Trigger>
                            </Navbar.Item>
                            <Dropdown.Menu
                                aria-label="User menu actions"
                                onAction={actionKey => handleAction(actionKey as string)}
                                disabledKeys={['username']}
                            >
                                <Dropdown.Item key="username" css={{ height: '$18' }}>
                                    <Text b color="#ec9127" css={{ d: 'flex' }}>
                                        Signed in as {username}
                                    </Text>
                                </Dropdown.Item>
                                <Dropdown.Item key="profile" withDivider>
                                    My Profile
                                </Dropdown.Item>
                                <Dropdown.Item key="groups" withDivider>
                                    Groups
                                </Dropdown.Item>
                                <Dropdown.Item key="settings" withDivider>
                                    Settings
                                </Dropdown.Item>
                                <Dropdown.Item key="logout" withDivider color="error">
                                    Log Out
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Content>
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
                </Navbar>
            }
        </div>
    );
}

export default NavbarF;
