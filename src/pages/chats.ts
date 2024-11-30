import { onValue, ref, set } from "firebase/database";
import { state } from "../state/state";
import { database } from "../firebase.config";
const page = document.querySelector(".page");
const root = document.querySelector("#root") as HTMLElement;
const roomIdCont = document.querySelector(".roomId");
const chatBox = document.createElement("div");
const chatMessagesBox = document.createElement("div");
const chatForm = document.createElement("form");
const chatInputText = document.createElement("input");
const chatButtonSend = document.createElement("button");
const chatStyle = document.createElement("style");

const roomId = document.createElement("h2");

export const chatsPage = () => {
  root.textContent = "";
  chatForm.addEventListener("submit", (e) => {
    console.log(state.id);

    if (e) {
      chatEvent(e);
    }
  });
  createChatMessages();
  chatButtonSend.textContent = "Enviar";

  if (page) {
    createChatStyles();
    page.textContent = "";

    roomId.classList.add("roomId");
    roomId.textContent = `Room id:${state.id}`;
    root.appendChild(chatStyle);
    chatForm.appendChild(chatButtonSend);
    root.appendChild(chatMessagesBox);
    chatBox.appendChild(chatForm);
    chatForm.appendChild(chatInputText);
    chatBox.appendChild(chatStyle);
    page.appendChild(chatBox);
    roomIdCont?.appendChild(roomId);
  }
};

const chatEvent = (event: Event) => {
  event.preventDefault();
  fetch(`http://localhost:3000/rooms/chat/${state.id}`, {
    method: "POST",
    body: JSON.stringify({
      creator: state.myName,
      message: chatInputText.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log(res);
  });
};

const createChatStyles = () => {
  chatStyle.textContent = `
    
    .chatForm{
    display:flex;
    justify-content:center;
    width:100%;
    gap:15px;
    }


    .inputForm{
     border:solid 2px black;
      border-radius:5px;
      width:80%
   }

  .buttonForm{
  background-color:#9cbbe9;
  font-weight: bold;
  padding:5px;
  width:100px;
    border-radius:5px
    }

    .roomId{
      position: -webkit-sticky; // required for Safari
  position: sticky;
  top: 0; // required as well
    }

    `;
  chatBox.classList.add("chatBox");
  chatInputText.classList.add("inputForm");
  chatButtonSend.classList.add("buttonForm");
  chatForm.classList.add("chatForm");
};

const createChatMessages = () => {
  const dbRef = ref(database, `rooms/${state.id}/messages`);

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    // Limpia el contenedor antes de agregar nuevos mensajes
    chatMessagesBox.innerHTML = "";

    if (!data) {
      console.log("No hay mensajes disponibles.");
      return;
    }

    for (const key in data) {
      const messageData = data[key];
      if (!messageData || !messageData.message || !messageData.creator) {
        console.error("Datos del mensaje incompletos:", messageData);
        continue;
      }

      // Crear elementos nuevos en cada iteración
      const chatDiv = document.createElement("div");
      const chatMessageCreator = document.createElement("label");
      const chatMessage = document.createElement("p");
      const styles = document.createElement("style");

      styles.textContent = `
        .messageDiv {
          display: flex;
          flex-direction: column;
        }

        .messageText {
          background-color: #D8D8D8;
          border: solid 1px #d8d8d857;
          border-radius: 6px;
          padding: 8px;
          margin: 0px;
          width: max-content;
        }

        .messageTextGreen {
          background-color: green;
          border: solid 1px #d8d8d857;
          border-radius: 6px;
          padding: 8px;
          margin: 0px;
          width: max-content;
          align-self: flex-end;
        }

        .messageLabel {
          margin-left: 5px;
          font-size: 10px;
          color: gray;
        }
      `;

      // Asignar valores a los elementos
      if (messageData.creator === state.myName) {
        chatMessageCreator.innerText = "";
        chatMessage.classList.add("messageTextGreen");
      } else {
        chatMessageCreator.innerText = messageData.creator;
        chatMessageCreator.classList.add("messageLabel");
        chatMessage.classList.add("messageText");
      }

      chatMessage.innerText = messageData.message;

      // Agregar estilos y elementos al DOM
      chatDiv.classList.add("messageDiv");
      chatDiv.appendChild(styles);
      chatDiv.appendChild(chatMessageCreator);
      chatDiv.appendChild(chatMessage);
      chatMessagesBox.appendChild(chatDiv);
    }
    //limpio el chat
    chatInputText.value = "";
    
    console.log("Mensajes cargados:", data);
  });
};
