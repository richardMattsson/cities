import "./App.css";
import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import CityDetailView from "./views/CityDetailView";
import CityFormView from "./views/CityFormView";
import HomeView from "./views/HomeView";
import CitiesView from "./views/CitiesView";
import RegionsView from "./views/RegionsView";
import RegionDetailView from "./views/RegionDetailView";
import RegionFormView from "./views/RegionFormView";

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <HomeView />, path: "/" },
        { element: <CitiesView />, path: "/cities" },
        { element: <RegionsView />, path: "/regions" },
        { element: <CityFormView />, path: "/city-form/:option/:id?" },
        { element: <RegionFormView />, path: "/region-form/:option/:id?" },
        { element: <CityDetailView />, path: "/city/:id" },
        { element: <RegionDetailView />, path: "/region/:id" },
      ],
      element: (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/">Hem</Link>
              </li>
              <li>
                <Link to="/cities">Visa Städer</Link>
              </li>
              <li>
                <Link to="/regions">Visa Regioner</Link>
              </li>
              <li>
                <Link to="/city-form/add">Skapa ny stad</Link>
              </li>
              <li>
                <Link to="/region-form/add">Skapa ny region</Link>
              </li>
            </ul>
          </nav>
          <main>
            <Outlet />
          </main>
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
