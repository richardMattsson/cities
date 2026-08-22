import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import HomeView from "./views/HomeView";
import ListView from "./views/ListView";
import SignUpView from "./views/SignUpView";
import SignInView from "./views/SignInView";
import Navbar from "./components/Navbar";
import DetailView from "./views/DetailView";
import FormView from "./views/FormView";

function Router() {
  const router = createHashRouter([
    {
      children: [
        { element: <HomeView />, path: "/" },
        { element: <ListView />, path: "/:type" },
        { element: <DetailView />, path: "/detail/:type/:id" },
        { element: <FormView />, path: "/form/:type/:option/:id?" },
        { element: <SignUpView />, path: "/signUp" },
        { element: <SignInView />, path: "/signIn" },
      ],
      element: (
        <>
          <h1 className="main-title">Sveriges geografi</h1>
          <Navbar />
          <hr style={{ margin: 0 }} />
          <main>
            <Outlet />
          </main>
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
