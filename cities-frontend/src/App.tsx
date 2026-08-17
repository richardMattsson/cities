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
import RegionDetailView from "./views/RegionDetailView";
import RegionFormView from "./views/RegionFormView";
import ListView from "./views/ListView";
import SignInView from "./views/SignInView";
import SignUpView from "./views/SignUpView";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) =>
      setUser(firebaseUser),
    );

    return () => unsubscribe();
  }, []);

  const router = createHashRouter([
    {
      children: [
        { element: <HomeView />, path: "/" },
        { element: <ListView />, path: "/:options" },
        {
          element: <CityFormView />,
          path: "/city-form/:option/:id?",
        },
        { element: <RegionFormView />, path: "/region-form/:option/:id?" },
        { element: <CityDetailView />, path: "/city/:id" },
        { element: <RegionDetailView />, path: "/region/:id" },
        { element: <SignUpView />, path: "/signUp" },
        { element: <SignInView />, path: "/signIn" },
      ],
      element: (
        <div id="mainContainer">
          <nav id="navigation">
            <ul>
              <li>
                <Link to="/">Hem</Link>
              </li>
              {user ? (
                <li>
                  <Link
                    to="/"
                    onClick={() =>
                      signOut(auth)
                        .then(() => console.log("signed out"))
                        .catch((error) => {
                          console.log(error);
                        })
                    }
                  >
                    Logga ut
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/signUp">Skapa konto</Link>
                  </li>
                  <li>
                    <Link to="/signIn">Logga in</Link>
                  </li>
                </>
              )}
              <hr />
              <li>
                <Link to="/cities">Visa Städer</Link>
              </li>
              <li>
                <Link to="/regions">Visa Regioner</Link>
              </li>
              <hr />
              <li>
                <Link to="/city-form/add">Skapa ny stad</Link>
              </li>
              <li>
                <Link to="/region-form/add">Skapa ny region</Link>
              </li>
            </ul>
          </nav>
          <main id="mainContent">
            <Outlet />
          </main>
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
