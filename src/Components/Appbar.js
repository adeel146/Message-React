import * as React from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./FireBase";
import { AppBar, Typography } from "@mui/material";
import { Button } from "@mui/material";

export default function TodoAppBar() {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <AppBar position="static">
      <Typography variant="h4" align="center" style={{ padding: "20px" }}>
        Group Messaging
        {auth?.currentUser && (
          <Button
            style={{ float: "right" }}
            color="inherit"
            variant="outlined"
            onClick={logout}
          >
            logout
          </Button>
        )}
      </Typography>
    </AppBar>
  );
}
