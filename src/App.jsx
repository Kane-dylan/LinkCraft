import "./App.css";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Applayout from "./layouts/app-layout";
import Landing from "./pages/landing";
import Dashbord from "./pages/dashbord";
import Auth from "./pages/auth";
import RedirectLink from "./pages/redirect-link";
import LinkPage from "./pages/link";
import UrlProvider from "./context";



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
    <UrlProvider>
      <RouterProvider router={router}/>
    </UrlProvider>
  );
}

export default App;
