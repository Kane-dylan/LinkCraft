import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import RedirectLink from "./pages/RedirectLink";
import LinkPage from "./pages/LinkPage";
import UrlProvider from "./context";
import RequireAuth from "./components/require-auth";
import Dashboard from "./pages/Dashboard";


const router = createBrowserRouter([  
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLink />,
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
