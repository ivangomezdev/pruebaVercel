import { goTo } from "../routes";
import { state } from "../state/state";


const CREATE_ROOM = "http://localhost:3000/rooms";

const nameForm = document.createElement("form") as HTMLFormElement;
const style = document.createElement("style");
const pageEl = document.querySelector(".page") as HTMLElement;
const button = document.createElement("button");
export let globalResponse = null

const formText = [
  {
    text: "Email",
    className: "emailLabel",
    id: "email",
    type: "input",
  },
  {
    text: "Nombre",
    className: "nombreLabel",
    id: "nombre",
    type: "input",
  },
  {
    text: "Room",
    className: "roomLabel",
    id: "room",
    type: "option",
    option: ["Nuevo room", "Existente"],
  },
  {
    text: "Room ID",
    className: "roomIdLabel",
    id: "roomId",
    type: "input",
  },
];

const createHomeStructure = () => {
  style.textContent = `
  .formName{
    display: flex;
    flex-direction: column; /* Asegura que los campos se muestren de arriba hacia abajo */
    padding: 20px;

  }
  .labelForm{
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    text-align:start
  }
  .inputForm{
    border: solid 2px black;
    border-radius: 5px;
    padding: 8px;
  
  }
  .buttonForm{
    background-color:#9cbbe9;
    font-weight: bold;
    padding: 5px;
    width: 150px;
    border-radius: 5px;
    cursor: pointer;
  }
  .optionForm{
  width:163px;
  }
  `;

  button.textContent = "Enviar";
  button.classList.add("buttonForm");

  formText.forEach((obj) => {
    const labelDiv = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const select = document.createElement("select");

    label.textContent = obj.text;
    labelDiv.classList.add("labelForm");
    labelDiv.appendChild(label);
    nameForm.classList.add("formName");
    select.classList.add("optionForm")
    if (obj.type === "option" && obj.option) {
      obj.option.forEach((element) => {
        const option = document.createElement("option");
        option.textContent = element;
        select.appendChild(option);
      });
      select.classList.add("inputForm");
      labelDiv.appendChild(select);
    }

    if (obj.type === "input") {
      input.id = obj.id;
      input.classList.add("inputForm");
      labelDiv.appendChild(input);
    }

    nameForm.appendChild(labelDiv);
  });

  nameForm.appendChild(button);
  pageEl.appendChild(style);
  pageEl.appendChild(nameForm);
};

export const inicioWindow = () => {
  createHomeStructure();
  if (!pageEl) return;

  const inputRoom = nameForm.querySelector(".optionForm") as HTMLInputElement;
  const inputRoomId = nameForm.querySelector("#roomId") as HTMLInputElement;
  inputRoomId.disabled = true

  //desactivo el input en caso de que el room sea nuevo
  inputRoom.addEventListener("input",(e)=>{
    if (inputRoom.value == "Nuevo room") {
      inputRoomId.disabled = true
      
    } else {
      inputRoomId.disabled = false
    }
  })
  
  // Registra el evento `submit` después de agregar el formulario al DOM
  nameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputEmail = nameForm.querySelector("#email") as HTMLInputElement;
    const inputName = nameForm.querySelector("#nombre") as HTMLInputElement;



    const inputEmailVal = inputEmail.value;
    const inputNameVal = inputName.value;
    const inputRoomVal = inputRoom.value;
   
    const inputRoomIdVal = inputRoomId.value;
    const JOIN_ROOM = `http://localhost:3000/rooms/${inputRoomIdVal}`;
    state.myName = inputNameVal;

  

    // Envía la solicitud POST // Creo nuevo ROOM si no existe.
    if (inputRoomVal == "Nuevo room") {
      
      
    
    fetch(CREATE_ROOM, {
      method: "POST",
      body: JSON.stringify({
        email: inputEmailVal,
        name: inputNameVal,
        room: inputRoomVal,
        
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) =>  res.json())
      .then((data) => {
        state.id = data;
        
        // Navega a otra página
          goTo("/chat");
      })
      .catch((err) => {
        console.error("Error en la solicitud:", err);
      });
    
    }else{

      fetch(JOIN_ROOM, {
        method: "POST",
        body: JSON.stringify({
          email: inputEmailVal,
          name: inputNameVal,
          room: inputRoomVal,
          roomID: inputRoomIdVal,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          state.id = data;
          console.log("Respuesta del servidor:", data)
            // Navega a otra página
           goTo(`/chat`);
          
          
        })
        .catch((err) => {
          console.error("Error en la solicitud:", err);
        });
      
        

    }
  })
};


