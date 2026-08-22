import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../css/Navbar.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) =>
      setUser(firebaseUser),
    );

    return () => unsubscribe();
  }, []);

  return (
    <nav className="Navbar-nav">
      <ul className="Navbar-ul first-ul">
        <CustomLink to="/">Hem</CustomLink>

        {user ? (
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
            <li>Logga ut</li>
          </Link>
        ) : (
          <>
            <CustomLink to="/signUp">Skapa konto</CustomLink>
            <CustomLink to="/signIn">Logga in</CustomLink>
          </>
        )}
      </ul>
      <ul className="Navbar-ul">
        <CustomLink to="/regions">Visa Regioner</CustomLink>
        <CustomLink to="/municipalities">Visa Kommuner</CustomLink>
        <CustomLink to="/cities">Visa Städer</CustomLink>
      </ul>
      <ul className="Navbar-ul">
        <CustomLink to="/form/region/add">Skapa ny region</CustomLink>
        <CustomLink to="/form/municipality/add">Skapa ny kommun</CustomLink>
        <CustomLink to="/form/city/add">Skapa ny stad</CustomLink>
      </ul>
    </nav>
  );
}

type CustomLinkProps = {
  to: string;
  children: React.ReactNode;
};

function CustomLink({ to, children }: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link to={to}>
      <li className={isActive ? "active" : ""}>{children}</li>
    </Link>
  );
}

export default Navbar;
