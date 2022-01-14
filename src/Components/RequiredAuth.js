import * as React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";


const RequireAuth = () => {
const auth =getAuth()
  var user = auth.currentUser;
  return user ? <Outlet /> : <Navigate to="/" />;
};
export default RequireAuth;
