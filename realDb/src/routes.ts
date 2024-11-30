import {
  onValue,
  ref,
  getDatabase,
  set,
  update,
  push,
} from "firebase/database";
import { database, dbFirestore } from "./db";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore/lite";

const express = require("express");
const cors = require("cors");
const app = express();
const rtdb = getDatabase();
let idRoom = "";

app.use(cors());
app.use(express.json());


//Crear Room en caso de que no exista
app.post("/rooms", (req, res) => {
  const bodyData = req.body;
  
  const roomRefRTDB = ref(database, "rooms/");
  
  const newStarCountRef = push(roomRefRTDB);
  const rtdbId = newStarCountRef.key;
  console.log(rtdbId);
  
  bodyData.roomID = rtdbId;
  
  const shortId = 1000 + Math.floor(Math.random() * 999);
  const roomRefDb = doc(dbFirestore, "users", shortId.toString());
  
  setDoc(roomRefDb, {
    email: bodyData.email,
    owner: bodyData.name,
    id: rtdbId,
  }).then((i) => {
    return i;
  });
  set(newStarCountRef, { messages: { ownerId: shortId } });
  res.status(200).json(shortId)
});

//ingresar al room en caso de saber la ID
app.post("/rooms/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);

  const messages = req.body;

  //recibo el ID de sala e instancio ese DOC
  const docRef = doc(dbFirestore, `users/${id}`);

  //consigo el ID de mi doc
  const docSnap = getDoc(docRef).then((dRef) => {
    if (dRef.exists()) {
      console.log("Entraste al ROOM:", dRef.data().id);
      idRoom = dRef.data().id;

      //accedo al room de la rtdb con ese ID
    } else {
      console.log("El room indicado no existe", id);
    }

    res.status(200).json(id);
  });
});

//escribir en mi room una vez dentro
app.post("/rooms/chat/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const starCountRef = ref(database, `rooms/${id}/messages`);
  const newMessage = push(starCountRef);
  set(newMessage, body);

  res.status(200).json(newMessage);
});


app.listen("3000", () => {
  console.log("server ok");
});
