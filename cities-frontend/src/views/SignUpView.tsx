import { SignUpAuthScreen } from "@firebase-oss/ui-react";
import { useNavigate } from "react-router-dom";

function SignUpView() {
  const navigate = useNavigate();
  return (
    <SignUpAuthScreen
      onSignUp={() => {
        navigate("/signIn");
      }}
    />
  );
}
export default SignUpView;
