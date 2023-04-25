import { useState, useEffect } from "react";
import "firebase/auth";
import { auth } from "./firebase-config";
import { Input, Container, Card, Button, Spacer } from "@nextui-org/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Add an observer for changes to the user's authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    // Unsubscribe from the observer when the component unmounts
    return unsubscribe;
  }, []);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h1>You are logged in!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Container
          css={{ minHeight: "100vh" }}
          display="flex"
          alignItems="center"
          justify="center"
        >
          <Card>
            <Card.Body>
              Email:
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Spacer y={1} />
              Password:
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Spacer y={1} />
              <Button onClick={handleRegister}>Register</Button>
              <Spacer y={1} />
              <Button onClick={handleLogin}>Login</Button>
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default App;
