import React from "react";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignIn() {
  const [error, seterror] = useState();
  const auth = getAuth();
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        seterror(errorMessage);
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });
  }, []);

  console.log("auth", auth.currentUser);
  return (
    <div style={{ textAlign: "center" ,marginTop:"20px"}}>
      <Button color="inherit" variant="outlined" onClick={signInWithGoogle}>
        Sign in with
        <GoogleIcon />
      </Button>
      {error}
    </div>
  );
}

export default SignIn;
