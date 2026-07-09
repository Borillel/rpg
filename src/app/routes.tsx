import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { UserArea } from "./components/UserArea";
import { LoginScreen } from "./components/LoginScreen";
import { GMView } from "./components/GMView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/entrar",
    Component: LoginScreen,
  },
  {
    path: "/area-usuario",
    Component: UserArea,
  },
  {
    path: "/mestre",
    Component: GMView,
  },
]);
