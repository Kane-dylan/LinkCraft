import { Button } from "@/components/ui/button";
import "./App.css";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Applayout from "./layouts/Applayout";
import Landing from "./pages/Landing";
import Dashbord from "./pages/Dashbord";
import Auth from "./pages/Auth";
import RedirectLink from "./pages/RedirectLink";
import LinkPage from "./pages/LinkPage";



const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/Dashbord",
        element: <Dashbord />
      },
      {
        path: "/Auth",
        element: <Auth />
      },
      {
        path: "/LinkPage/:id",
        element: <LinkPage/>
      },
      {
        path: "/:id",
        element: <RedirectLink />
      },
    ]
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
