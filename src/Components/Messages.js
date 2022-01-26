import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import db from "./FireBase";
import { getAuth } from "firebase/auth";
import { useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

const BasicTable = () => {
  const auth = getAuth();
  const [data, setdata] = useState([]);
  const [input, setinput] = useState("");
  const [listusers, setlistusers] = useState();
  const [messagelocation, setmessagelocation] = useState("group");

  const dummy = useRef();
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {

    addNewUser();
    onSnapshot(
      query(collection(db, "group"), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
    onSnapshot(
      query(
        collection(db, "users"),
        where("id", "!=", `${auth.currentUser.uid}`)
      ),
      (snapshot) =>
        setlistusers(snapshot.docs.map((doc) => ({ ...doc.data() })))
    );
  }, []);

  const addNewUser = async () => {
    const documentReference = doc(
      db,
      "users",
      `${auth.currentUser.displayName}`
    );
    const payload = {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      image: auth.currentUser.photoURL,
      timestamp: serverTimestamp(),
    };
    await setDoc(documentReference, payload);
  };

  const groupRoom = () => {
    setmessagelocation("group")
    onSnapshot(
      query(collection(db, "group"), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const sortAlphabet = (str) => {
    return [...str].sort((a, b) => a.localeCompare(b)).join("");
  };
  const Ref = sortAlphabet(auth.currentUser.uid + messagelocation);

  const privateRoom = (id) => {
    setmessagelocation(id)
    onSnapshot(
      query(collection(db, `${sortAlphabet(auth.currentUser.uid + id)}`), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };
  console.log("data", data);
  const sendMessage = async () => {
    const documentReference = collection(
      db,
      `${messagelocation === "group" ? messagelocation : Ref}`
    );
    const payload = {
      messsage: input,
      name: auth.currentUser.displayName,
      image: auth.currentUser.photoURL,
      timestamp: serverTimestamp(),
      id: auth.currentUser.uid,
    };
    await addDoc(documentReference, payload);
  };

  return (
    <>
      <div style={{ margin: "10px 20% 0 20%" }}>
        <Grid container>
          <Grid item md={4} lg={4}>
            <TableContainer sx={{ maxHeight: 550 }}>
              <Table
                sx={{
                  backgroundColor: "cornflowerblue",
                  borderRadius: "10px",
                  borderRight: "1px solid white",
                }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="inherit"
                        onClick={() => {
                          groupRoom();
                        }}
                      >
                        show group messages
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listusers &&
                    listusers.map(({ id, image, name }) => (
                      <TableRow
                        key={id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          align={"left"}
                          onClick={() => {
                            privateRoom(id);
                          }}
                        >
                          <Button>
                            <img
                              src={image}
                              alt="reload"
                              style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                float: "left",
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
                              {name}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={8} lg={8}>
            <TableContainer>
              <Table
                sx={{
                  Width: 650,
                  height: 500,
                  backgroundColor: "cornflowerblue",
                  borderRadius: "10px",
                }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow></TableRow>
                </TableHead>
                <TableBody>
                  { data && data.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align={`${
                          auth.currentUser.displayName === row.name
                            ? "right"
                            : "left"
                        }`}
                      >
                        <img
                          src={row.image}
                          alt="reload"
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            float: `${
                              auth.currentUser.displayName === row.name
                                ? "right"
                                : "left"
                            }`,
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
            <div style={{ textAlign: "center" ,width:650}}>
          <TextField
            placeholder="Add ToDo"
            style={{width:500}}
            onChange={(e) => setinput(e.target.value)}
            value={input}
          ></TextField>

          <Button
          type="submit"
            size="large"
            variant="contained"
            style={{ height: "55px",}}
            endIcon={<SendIcon />}
            onClick={() => {
              if (input.length > 0) {
                sendMessage();
                setinput("");
              }
            }}
          >
            send
          </Button>
        </div>
          </Grid>
          
        </Grid>
      </div>
    </>
  );
};
export default BasicTable;
