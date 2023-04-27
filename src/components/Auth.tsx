import { useState, useEffect, useMemo } from "react";
import "firebase/auth";
import { actionCodeSettings, auth } from "../config/firebase-config";
import {
  Input,
  Container,
  Card,
  Image,
  Button,
  Spacer,
} from "@nextui-org/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  //   sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
} from "firebase/auth";
import Logo from "../assets/logo.svg";
import { Helper } from "../interfaces/helper";
import { lightRetroTheme } from "../assets/themes";
import { createUserCollection } from "../database/firestore-db";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Add an observer for changes to the user's authentication state
    if (
      isSignInWithEmailLink(auth, window.location.href) &&
      auth.currentUser?.emailVerified
    ) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      const email = window.localStorage.getItem("emailForSignIn");
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email as string, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          if (result.user) {
            setLoggedIn(true);
          }
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode);
          console.log(errorMessage);
        });
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
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
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      createUserCollection(result.user);
      sendEmailVerification(result.user, actionCodeSettings);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = () => {
    // TODO: 2FA - fot later; uncomment when app is almost done

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (auth.currentUser?.emailVerified) {
          setLoggedIn(true);
        }
        // auth.updateCurrentUser(null);
        // sendSignInLinkToEmail(auth, email, actionCodeSettings)
        //   .then(() => {
        //     window.localStorage.setItem("emailForSignIn", email);
        //     console.log(window.localStorage.emailForSignIn);
        //   })
        //   .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.error(errorCode);
        //     console.log(errorMessage);
        //   });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode);
        console.log(errorMessage);
      });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  const validateEmail = (value: string) => {
    return value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i);
  };
  const helper: Helper = useMemo(() => {
    if (!email)
      return {
        text: "",
        color: "default",
      };
    const isValid = validateEmail(email);
    return {
      text: isValid ? "Correct email" : "Enter a valid email",
      color: isValid ? "success" : "error",
    };
  }, [email]);

  return (
    <div className={lightRetroTheme}>
      <Image
        showSkeleton
        width={300}
        height={250}
        maxDelay={10000}
        src={Logo}
        alt="logo"
      />
      {loggedIn ? (
        <div>
          <h1>You are logged in!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Container
          display="flex"
          alignItems="center"
          justify="center"
          css={{ mw: "600px" }}
        >
          <Card>
            <Card.Body>
              <Input
                clearable
                shadow={false}
                bordered
                fullWidth
                size="lg"
                status={helper.color}
                color={helper.color}
                helperColor={helper.color}
                helperText={helper.text}
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Spacer y={1} />
              <Input.Password
                label="Password"
                clearable
                bordered
                fullWidth
                color="default"
                size="lg"
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

export default Auth;
