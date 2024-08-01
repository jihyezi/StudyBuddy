import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import styles from "./GoogleLoginButton.module.css";
import googleimg from "assets/icons/Home/googleimg.png";

const GoogleLoginButton = () => {
  const clientId =
    "658359587436-jmr17rs0jqlvjmceujdk8mchkn8amd1n.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(res) => {
          console.log(res);
        }}
        onFailure={(err) => {
          console.log(err);
        }}
        render={(renderProps) => (
          <button
            className={styles.googleButton}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <img src={googleimg} alt="Google Logo" className={styles.icon} />
            Google 로그인
          </button>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
