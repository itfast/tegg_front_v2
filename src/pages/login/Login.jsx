import { useEffect, useState } from "react";
import {
  ContainerBodyLogin,
  ContainerFormLogin,
  ContainerImageLogin,
  ContainerImageText,
  ContainerLogin,
  FormLogin,
  InputLogin,
  InputPassSignUp,
} from "./Login.styles";
import "./font.css";
import ReactLoading from "react-loading";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { Button, ContainerMobile, ContainerWeb } from "../../../globalStyles";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { translateError } from "../../services/util";
import { toast } from "react-toastify";
import { NewClientExtern } from "../clients/new/NewClientExtern";
import ReactCardFlip from "react-card-flip";
// import { Avatar, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/loading/Loading";

const celular = '/assets/celulartegg1.webp'

export const Login = () => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [typePass, setTypePass] = useState("password");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [user, setUser] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  // const [singUp, setSingUp] = useState(false);
  const [flipped, setFlipped] = useState(true);
  // const [language, setLanguage] = useState();
  // const [anchorEl, setAnchorEl] = useState(null);

  // const userLocale = navigator?.languages?.length
  // ? navigator.languages[0]
  // : navigator.language;

  useEffect(() => {
    // setLanguage("pt");
    api.language.set("pt");
    // api.language
    //   .get()
    //   .then(l => {
    //     if (l) {
    //       setLanguage(l);
    //     } else if (userLocale) {
    //       api.language.set(userLocale.substring(0, 2));
    //       setLanguage(userLocale.substring(0, 2));
    //       window.location.reload();
    //     } else {
    //       setLanguage('pt');
    //     }
    //   })
    //   .catch(() => {
    //     setLanguage('pt');
    //   });
  }, []);

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    api.user
      .login(user, password)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    api.user
      .sendResetEmail(resetPassword)
      .then((res) => {
        toast.success(res.data.Message);
        setResetPassword("");
        setStep(0);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  // const handleMenu = event => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleLanguage = (lng) => {
  //   api.language.set(lng);
  //   // i18n.changeLanguage(lng);
  //   window.location.reload();
  //   handleClose();
  // };

  const returnStep = () => {
    switch (step) {
      case 0:
        return (
          <ContainerFormLogin>
            <h2
              className="login_welcome"
              style={{
                textAlign: "center",
              }}
            >
              {t("Welcome")}
            </h2>
            <FormLogin>
              <form onSubmit={handleLogin} style={{ width: "100%" }}>
                <InputLogin
                  type="text"
                  // id="user"
                  name="user"
                  placeholder={t("Login")}
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />

                <InputPassSignUp>
                  <input
                    type={typePass}
                    placeholder={t("Password")}
                    value={password}
                    // id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password &&
                    (typePass === "password" ? (
                      <LiaEyeSolid
                        className="eyes"
                        onClick={handleTypePass}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className="eyes"
                        onClick={handleTypePass}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
                <p
                  className="login_forgot"
                  style={{ cursor: "pointer", textAlign: "center" }}
                  onClick={() => setStep(1)}
                >
                  {t("Forgot")}
                </p>
                <Button
                  className="login_button"
                  // nothover={loading.toString()}
                  type="submit"
                  // onClick={handleLogin}
                  style={{ width: "100%" }}
                >
                  {loading ? (
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      onMouseEnter={() => {
                        setHovering(true);
                      }}
                      onMouseLeave={() => {
                        setHovering(false);
                      }}
                    >
                      <ReactLoading
                        type={"bars"}
                        color={!hovering ? "#fff" : "#00D959"}
                      />
                    </div>
                  ) : (
                    t("Enter")
                  )}
                </Button>
                <h5
                  onClick={() => {
                    // setSingUp(true);
                    setFlipped(false);
                  }}
                  style={{
                    marginTop: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {t("dontHaveAccount")}
                </h5>
              </form>
            </FormLogin>
          </ContainerFormLogin>
        );
      case 1:
        return (
          <ContainerFormLogin>
            <h2>{t("ForgotPassword.recover")}</h2>
            <FormLogin>
              <form onSubmit={handleReset} style={{ width: "100%" }}>
                <InputLogin
                  type="text"
                  id="resetPass"
                  name="resetPass"
                  placeholder={t("ForgotPassword.email")}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                />

                <Button
                  // nothover={loading.toString()}
                  type="submit"
                  // onClick={handleLogin}
                  style={{ width: "100%", marginTop: 10 }}
                >
                  {loading ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ReactLoading type={"bars"} color={"#fff"} />
                    </div>
                  ) : (
                    t("ForgotPassword.send")
                  )}
                </Button>
                <Button
                  style={{ width: "100%", marginTop: 10 }}
                  onClick={() => setStep(0)}
                >
                  {t("ForgotPassword.goback")}
                </Button>
              </form>
            </FormLogin>
          </ContainerFormLogin>
        );
    }
  };

  return (
    <>
      <ContainerWeb>
      <Loading open={loadingR} msg={t("LoadingMsgs.endRegister")} />
        <ContainerBodyLogin style={{height: flipped ? '100vh' : '100%'}}>
          {/* <div style={{ width: "100%", display: "flex", justifyContent: "end" }}> */}
          {/* {language === 'en' && (
            <Avatar
              alt="Remy Sharp"
              src="/eua.png"
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={handleMenu}
            />
          )}
          {language === 'es' && (
            <Avatar
              alt="Remy Sharp"
              src="/espanha.png"
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={handleMenu}
            />
          )}
          {language === 'pt' && (
            <Avatar
              alt="Remy Sharp"
              src="/brasil.png"
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={handleMenu}
            />
          )}
          {!language && (
            <Avatar
              alt="Remy Sharp"
              src="/brasil.png"
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={handleMenu}
            />
          )} */}
          {/* </div> */}
          <img
            src={"/assets/tegg-branco.png"}
            style={{
              width: "15%",
              marginTop: 12,
              marginBottom: 10,
            }}
          />
          <ContainerLogin
            style={{ maxWidth: "1000px"}}
          >
            <ReactCardFlip
              style={{ maxWidth: "1000px"}}
              isFlipped={flipped}
            >
              <div
                style={{
                  // display: 'flex',
                  // flexDirection: 'column',
                  backgroundColor: "white",
                  margin: "auto",
                  width: "100%",
                  padding: "0.5rem",
                }}
              >
                {/* <h5 style={{cursor: 'pointer'}} onClick={()=> setSingUp(false)}>Já tenho conta</h5> */}
                <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  {t("Register.register")}
                </h2>
                {!flipped &&<NewClientExtern setSingUp={setFlipped} setLoading={setLoadingR} loading={loadingR} />}
              </div>
              <div style={{ display: screen.width < 768 ? "block" : "flex" }}>
                <ContainerImageLogin>
                  <ContainerImageText>
                    <img
                      src={celular}
                      style={{
                        width: "70%",
                        // margin: 10,
                      }}
                    />
                    <h2
                      style={{
                        textAlign: "center",
                        // margin: 10,
                      }}
                    >
                      {t("Mkt")}
                    </h2>
                  </ContainerImageText>
                </ContainerImageLogin>
                {returnStep()}
              </div>
            </ReactCardFlip>
          </ContainerLogin>

          <h4
            className="copyright-text"
            style={{
              margin: 10,
              textAlign: "center",
              color: "white",
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h4>
        </ContainerBodyLogin>
      </ContainerWeb>
      <ContainerMobile style={{height: 'max-content'}}>
      <Loading open={loadingR} msg={t("LoadingMsgs.endRegister")} />
        <div style={{marginTop: '6rem'}}/>
        <ContainerLogin
          style={{ maxWidth: "1000px"/*, height: singUp && "550px"*/ }}
        >
          <ReactCardFlip
            style={{ maxWidth: "1000px"/*, height: singUp && "550px"*/ }}
            isFlipped={flipped}
          >
            <div
              style={{
                // display: 'flex',
                // flexDirection: 'column',
                backgroundColor: "white",
                margin: "auto",
                width: "100%",
                padding: "0.5rem",
                marginTop: '8rem'
              }}
            >
              {/* <h5 style={{cursor: 'pointer'}} onClick={()=> setSingUp(false)}>Já tenho conta</h5> */}
              <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                {t("Register.register")}
              </h2>
              {!flipped && <NewClientExtern setSingUp={setFlipped} setLoading={setLoadingR} loading={loadingR}/>}
            </div>
            <div style={{ display: screen.width < 768 ? "block" : "flex" }}>
              <ContainerImageLogin>
                <ContainerImageText>
                  <img
                    src={celular}
                    style={{
                      width: "70%",
                      // margin: 10,
                    }}
                  />
                  <h2
                    style={{
                      textAlign: "center",
                      // margin: 10,
                    }}
                  >
                    {t("Mkt")}
                  </h2>
                </ContainerImageText>
              </ContainerImageLogin>
              {returnStep()}
            </div>
          </ReactCardFlip>
          <h6
            className="copyright-text"
            style={{
              // margin: 10,
              textAlign: "center",
              color: "black",
            }}
          >
            Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 |{" "}
            {t("Rights")}
          </h6>
        </ContainerLogin>
      </ContainerMobile>
    </>
  );
};
