import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import db from "./FireBase";
import { getAuth } from "firebase/auth";
import { useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const BasicTable = () => {
  const auth = getAuth();
  const [data, setdata] = useState([]);
  const [input, setinput] = useState("");

  const dummy = useRef();
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "messages"), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  }, []);

  console.log("data", data);

  const addtodo = async () => {
    const documentReference = collection(db, "messages");
    const payload = {
      messsage: input,
      name: auth.currentUser.displayName,
      image: auth.currentUser.photoURL,
      timestamp: serverTimestamp(),
    };
    await addDoc(documentReference, payload);
  };

  return (
    <>
      <div style={{ margin: "10px 25% 0 25%" }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table
            sx={{
              Width: 650,
              height: "500px",
              backgroundColor: "cornflowerblue",
              borderRadius: "10px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow></TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align={`${auth.currentUser.displayName ===row.name? "right" : "left"}`}
                  >
                    <img
                      src={row.image}
                      alt="reload"
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        float:`${auth.currentUser.displayName===row.name? "right" :"left"}`
                      }}
                    />
                    <span
                      style={{
                        backgroundColor: "white",
                        borderRadius: "15px",
                        padding: "15px",
                        margin: "10px 5px 5px 5px",
                      }}
                    >
                      {row.messsage}
                    </span>
                    <span ref={dummy} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <TextField
          placeholder="Add ToDo"
          onChange={(e) => setinput(e.target.value)}
          value={input}
        ></TextField>

        <Button
          size="large"
          variant="contained"
          style={{ height: "55px" }}
          endIcon={<SendIcon />}
          onClick={() => {
            if (input.length > 0) {
              addtodo();
              setinput("");
            }
          }}
        >
          addDoc
        </Button>
      </div>
    </>
  );
};
export default BasicTable;
