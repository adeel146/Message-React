import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState,memo } from "react";
import db from "./FireBase";
import { TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
const AlertDialog = ({ id, name, alert, }) => {
  const [open, setOpen] = useState(false);
  const [value, setvalue] = useState(name);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const DeleteDoc = async () => {
    const docref = doc(db, "messages", id);
    await deleteDoc(docref);
  };
  const editDoc = async () => {
    const docref =await  doc(db, "messages", id);
    const payload = { name: value };
    await updateDoc(docref, payload);
  };
  return (
    <div>
      {id && alert ? (
        <DeleteIcon
          onClick={() => {
            handleClickOpen();
          }}
        />
      ) : (
        <EditIcon
          onClick={() => {
            handleClickOpen();
          }}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {id && alert ? "Are you Sure" : "Edit Task"}
        </DialogTitle>
        <DialogContent>
          {id && alert ? (
            <DialogContentText id="alert-dialog-description">
              This task will be deleted permanently .
            </DialogContentText>
          ) : (
            <TextField
              value={value}
              onChange={(e) => setvalue(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          {id && alert ? (
            <Button
              onClick={() => {
                handleClose();
                DeleteDoc();
              }}
              autoFocus
            >
              Agree
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleClose();
                editDoc();
              }}
              autoFocus
            >
              Agree
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default memo(AlertDialog);
