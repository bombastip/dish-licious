import { Navbar, Link, Text, Avatar, Dropdown, Image } from "@nextui-org/react";
import { styled } from "@nextui-org/react";
import { auth, db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Logo from "../assets/icon.png";

export const Box = styled("div", {
  boxSizing: "border-box",
});

function NavbarF() {
  const [user, setUser] = useState(null as User | null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user as User);
    });

    return () => unsubscribe();
  }, []);
  const [username, setUsername] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(`User is signed in: ${user}`);
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUsername(doc.data().username);
            setPhotoURL(doc.data().photoURL);
            console.log(username);
          } else {
            console.log(`User documentnot found`);
          }
        })
        .catch((error) => {
          console.log(`Error retrieving user document: ${error}`);
        });
    }
  }, [auth.currentUser, username]);
  console.log("Rendering NavbarF", username);
  const collapseItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "My Settings",
    "Log Out",
  ];

  return (
    <div>
      {
        <Navbar isBordered variant="sticky">
          <Navbar.Toggle showIn="xs" />
          <Navbar.Brand
            css={{
              "@xs": {
                w: "12%",
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
            <Navbar.Link isActive href="#">
              Feed
            </Navbar.Link>
            <Navbar.Link href="#">Add post</Navbar.Link>
            <Navbar.Link href="#">Favourites</Navbar.Link>
            <Navbar.Link href="#">Notifications</Navbar.Link>
            <Navbar.Link href="#">Search</Navbar.Link>
          </Navbar.Content>
          <Navbar.Content
            css={{
              "@xs": {
                w: "12%",
                jc: "flex-end",
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
                    src={photoURL}
                  />
                </Dropdown.Trigger>
              </Navbar.Item>
              <Dropdown.Menu
                aria-label="User menu actions"
                onAction={(actionKey) => console.log({ actionKey })}
                disabledKeys={["username"]}
              >
                <Dropdown.Item key="username" css={{ height: "$18" }}>
                  <Text b color="#ec9127" css={{ d: "flex" }}>
                    Signed in as
                  </Text>
                  <>
                    {username && (
                      <Text b color="#ec9127" css={{ d: "flex" }}>
                        {username}
                      </Text>
                    )}
                  </>
                </Dropdown.Item>
                <Dropdown.Item key="profile" withDivider>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item key="followers" withDivider>
                  Followers
                </Dropdown.Item>
                <Dropdown.Item key="following" withDivider>
                  Following
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
                  color: index === collapseItems.length - 1 ? "$error" : "",
                }}
                isActive={index === 2}
              >
                <Link
                  color="#fedebe"
                  css={{
                    minWidth: "100%",
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
