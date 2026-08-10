import "./App.css";
import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import AllCities from "./views/AllCities";
import CityDetailView from "./views/CityDetailView";
import FormView from "./views/FormView";

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <AllCities />, path: "/" },
        { element: <FormView />, path: "/form/:option/:id?" },
        { element: <CityDetailView />, path: "/city/:id" },
      ],
      element: (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/">Visa Städer</Link>
              </li>
              <li>
                <Link to="/form/add">Skapa ny stad</Link>
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
