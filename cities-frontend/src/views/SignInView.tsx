import { SignInAuthScreen } from "@firebase-oss/ui-react";
import { useNavigate } from "react-router-dom";

function AuthenticationView() {
  const navigate = useNavigate();
  return (
    <SignInAuthScreen
      onSignIn={() => {
        navigate("/");
      }}
    />
  );
}
export default AuthenticationView;
