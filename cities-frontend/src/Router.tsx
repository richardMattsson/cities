import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import HomeView from "./views/HomeView";
import ListView from "./views/ListView";
import CityFormView from "./views/CityFormView";
import MunicipalityFormView from "./views/MunicipalityFormView";
import RegionFormView from "./views/RegionFormView";
import CityDetailView from "./views/CityDetailView";
import MunicipalityDetailView from "./views/MunicipalityDetailsView";
import RegionDetailView from "./views/RegionDetailView";
import SignUpView from "./views/SignUpView";
import SignInView from "./views/SignInView";
import Navbar from "./components/Navbar";

function Router() {
  const router = createHashRouter([
    {
      children: [
        { element: <HomeView />, path: "/" },
        { element: <ListView />, path: "/:options" },
        {
          element: <CityFormView />,
          path: "/city-form/:option/:id?",
        },
        {
          element: <MunicipalityFormView />,
          path: "/municipality-form/:option/:id?",
        },
        { element: <RegionFormView />, path: "/region-form/:option/:id?" },
        { element: <CityDetailView />, path: "/city/:id" },
        { element: <MunicipalityDetailView />, path: "/municipality/:id" },
        { element: <RegionDetailView />, path: "/region/:id" },
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
