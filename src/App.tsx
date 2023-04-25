import { useState, useEffect } from 'react';
import 'firebase/auth';
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <div>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;