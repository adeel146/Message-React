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
  const [messagelocation, setmessagelocation] = useState();

  const dummy = useRef();
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

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

  useEffect(() => {
    addNewUser();

    onSnapshot(
      query(
        collection(db, "users"),
        where("id", "!=", `${auth.currentUser.uid}`)
      ),
      (snapshot) =>
        setlistusers(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
    );
  }, []);

  const groupRoom = () => {
    onSnapshot(
      query(collection(db, "group"), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };
  const privateRoom = () => {
    onSnapshot(
      query(collection(db, `${auth.currentUser.displayName+messagelocation }`), orderBy("timestamp")),
      (snapshot) =>
        setdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const sendMessage = async () => {
    const documentReference = collection(db, `${auth.currentUser.displayName+messagelocation}`);
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
      <div style={{ margin: "10px 25% 0 25%" }}>
        <Grid container>
          <Grid item md={4} lg={4}>
            <TableContainer sx={{ maxHeight: 550 }}>
              <Table
                sx={{
                  backgroundColor: "cornflowerblue",
                  borderRadius: "10px",
                  borderRight:"1px solid white"
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
                          setmessagelocation("group");
                          groupRoom();
                        }}
                      >
                        show group messages
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell>
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
                              setmessagelocation(id);
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
                  </TableCell>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={8} lg={8}>
            <TableContainer>
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
          </Grid>
        </Grid>

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
                sendMessage();
                setinput("");
              }
            }}
          >
            addDoc
          </Button>
        </div>
      </div>
    </>
  );
};
export default BasicTable;
