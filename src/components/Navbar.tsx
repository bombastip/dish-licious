import { Navbar, Link, Text, Avatar, Dropdown } from '@nextui-org/react';
import { styled } from '@nextui-org/react';
import { auth, db } from '../config/firebase-config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const Box = styled('div', {
    boxSizing: 'border-box',
});

export const AcmeLogo = () => (
    <svg className="" fill="none" height="36" viewBox="0 0 32 32" width="36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="var(--secondary)" height="100%" rx="16" width="100%" />
        <path
            clipRule="evenodd"
            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
);

function NavbarF() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            console.log(`User is signed in: ${auth.currentUser}`)
            const docRef = doc(db, 'users', auth.currentUser.uid);
            getDoc(docRef).then(doc => {
                if (doc.exists()) {
                    setUsername(doc.data().username);
                    console.log(username);
                } else {
                    console.log(`User documentnot found`);
                }
            }).catch(error => {
                console.log(`Error retrieving user document: ${error}`);
            });
        }
    }, [auth.currentUser]);
    console.log('Rendering NavbarF', username);
    const collapseItems = [
        'Profile',
        'Dashboard',
        'Activity',
        'Deployments',
        'My Settings',
        'Log Out',
    ];

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
                        <AcmeLogo />
                        <Text b hideIn="xs">
                            ACME
                        </Text>
                    </Navbar.Brand>
                    <Navbar.Content
                        enableCursorHighlight
                        activeColor="secondary"
                        hideIn="xs"
                        variant="highlight-rounded"
                    >
                        <Navbar.Link href="#">Features</Navbar.Link>
                        <Navbar.Link isActive href="#">
                            Customers
                        </Navbar.Link>
                        <Navbar.Link href="#">Pricing</Navbar.Link>
                        <Navbar.Link href="#">Company</Navbar.Link>
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
                                    <Avatar
                                        bordered
                                        as="button"
                                        color="secondary"
                                        size="md"
                                        // doc(db, "users", currentUser.uid).photoURL as src
                                        src="https://icon-library.com/images/2693a2979d_91160.png"
                                    />
                                </Dropdown.Trigger>
                            </Navbar.Item>
                            <Dropdown.Menu
                                aria-label="User menu actions"
                                //color="secondary"
                                onAction={actionKey => console.log({ actionKey })}
                            >
                                <Dropdown.Item key="username" css={{ height: '$18' }}>
                                    <Text b color="#ec9127" css={{ d: 'flex' }}>
                                        Signed in as
                                    </Text>
                                    <>
                                        {username && (
                                            <Text b color="#ec9127" css={{ d: 'flex' }}>
                                                {username}
                                            </Text>
                                        )}
                                    </>
                                </Dropdown.Item>
                                <Dropdown.Item key="profile" withDivider>
                                    My Profile
                                </Dropdown.Item>
                                <Dropdown.Item key="saved_recepies" withDivider>
                                    Saved Recepies
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
                                    color="#fedebe"
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
            ;
        </div>
    );
}

export default NavbarF;
