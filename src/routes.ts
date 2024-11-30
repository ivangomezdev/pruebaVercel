import { chatsPage } from "./pages/chats";
import { inicioWindow } from "./pages/inicio";

export const goTo = (path: string) => {
    history.pushState({}, "", path);
    handleRoute(path);
  };
  
  const handleRoute = (path: string) => {
    const routes = [
      { route: "/", handle: () => handleInit() },
      { route: "/chat", handle: () => chatsPage() },
    ];
  
    for (const r of routes) {
      if (r.route === path) {
        r.handle();
        return;
      }
    }
  
    console.log("Ruta no encontrada:", path);
  };

 const handleInit = () =>{

    inicioWindow()
  }
  
  // Inicia el manejo de rutas
  handleRoute(location.pathname);