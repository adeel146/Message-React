import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ViewOneItem() {
  const navigate = useNavigate();
  const { name } = useParams();
  console.log(name);
  return (
    <div>
      <h2>Todo-Detail</h2>
      <h1>{name}</h1>
      <Button
        size="large"
        variant="contained"
        style={{ height: "55px" }}
        startIcon={<ArrowBackIcon />}
        onClick={() => {
          navigate("/home");
        }}
      >
        Back to Home
      </Button>
    </div>
  );
}

export default ViewOneItem;
