import { Button, PageLayout } from "../../../globalStyles";
import { ContainerStreaming } from "./StreamingStyles";
import { FaCheck } from "react-icons/fa6";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { InputData } from "../orders/new/NewOrder.styles";
import { InputPassSignUp } from "../login/Login.styles";
import api from "../../services/api";
import { Pgto } from "./Pgto";
import { cleanNumber, phoneFormat, translateError } from "../../services/util";
import { Loading } from "../../components/loading/Loading";

export const Streaming = () => {
  const [open, setOpen] = useState(false);
  const [modalContract, setModalContract] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [typePassR, setTypePassR] = useState("password");
  const [typePass, setTypePass] = useState("password");

  const [document, setDocument] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState();
  const [phone, setPhone] = useState();

  const [loading, setLoading] = useState(false)

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const handleTypePassR = () => {
    setTypePassR(typePassR === "password" ? "text" : "password");
  };

  useEffect(() => {
    if (api.currentUser) {
      setDocument(api.currentUser.MyDocument);
      setName(api.currentUser.Name);
      setEmail(api.currentUser.Email);
      let myPhone = cleanNumber(api.currentUser?.MyMobile)
      setPhone(phoneFormat(myPhone))
    }
  }, []);

  const createAccess = () => {
    if (user) {
      if (phone) {
        if (password) {
          if (repeatPass) {
            if (password === repeatPass) {
              setLoading(true)
              api.streaming
                .newUser(user, document, password, name, email, cleanNumber(phone))
                .then(() => {
                  toast.success('Acesso criado com sucesso')
                  setOpen(false)
                  setUser()
                  setPassword()
                  setRepeatPass()
                  setTypePass('password')
                  setTypePassR('password')
                })
                .catch((err) => translateError(err))
                .finally(() => setLoading(false))
            } else {
              toast.error("As senhas informadas devem ser iguais");
            }
          } else {
            toast.error("Repita a senha");
          }
        } else {
          toast.error("Informe uma senha para acessar o streaming");
        }
      } else {
        toast.error("Celular deve ser informado");
      }
    } else {
      toast.error("Informe um nome de usuário para acessar o streaming");
    }
  };

  const changeModal = () => {
    setModalContract(false);
    // setOpen(true);
  };
  return (
    <>
      <ContainerStreaming>
        <Loading open={loading} msg={'Criando acesso'} />
        <PageLayout>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <img
                style={{ maxWidth: 400, minWidth: 200, width: "100%" }}
                src="/assets/tv/MaxLogo.svg"
                alt="tv"
              />
            </div>
            {/* <div>
              <h1 style={{ color: "white" }}>
                <em style={{ fontWeight: "bold" }}>TEGG TV Streams</em>
              </h1>
            </div> */}
            <div style={{ margin: "1rem" }}>
              <h2
                style={{
                  color: "white",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                R${" "}
                <span style={{ fontSize: "3.5rem", marginTop: "-0.5rem" }}>
                  {" "}
                  41.90
                </span>
              </h2>
            </div>
            <div
              style={{
                marginBottom: "1.5rem",
                backgroundColor: "rgba(255, 255, 255, 1)",
                minWidth: "6rem",
                borderRadius: "4px",
                padding: "1rem",
              }}
            >
              <h4 style={{ margin: "0.5rem", display: "flex" }}>
                <FaCheck color="#00D959" style={{ marginRight: "0.2rem" }} />
                Disponibilidade de clássicos e lançamentos do cinema
              </h4>
              <h4 style={{ margin: "0.5rem", display: "flex" }}>
                <FaCheck color="#00D959" style={{ marginRight: "0.2rem" }} />
                Criação de até 5 perfis
              </h4>
              <h4 style={{ margin: "0.5rem", display: "flex" }}>
                <FaCheck color="#00D959" style={{ marginRight: "0.2rem" }} />
                Acesso em até 3 telas simultaneamente
              </h4>
              <h4 style={{ margin: "0.5rem", display: "flex" }}>
                <FaCheck color="#00D959" style={{ marginRight: "0.2rem" }} />
                Download de filmes e séries para assistir offline
              </h4>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <Button
                notHover
                style={{ color: "#000", minWidth: 180 }}
                onClick={() => setModalContract(true)}
              >
                CONTRATAR AGORA
              </Button>
              {/* <Button
                notHover
                style={{ color: "#000", minWidth: 180 }}
                onClick={() => setOpen(true)}
              >
                CRIAR ACESSO
              </Button> */}
            </div>
          </div>
        </PageLayout>
      </ContainerStreaming>
      <Dialog open={open} fullWidth>
        <DialogTitle>Acesso MAX</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div style={{ width: "100%", display: "flex", gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>Usuário (de acesso ao sistema)</h5>
                <InputData
                  value={user}
                  style={{ width: "100%" }}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>Celular (duplo fator de autenticação)</h5>
                <InputData
                  value={phone}
                  style={{ width: "100%" }}
                  onChange={(e) => setPhone(phoneFormat(e.target.value))}
                />
              </div>
            </div>

            <div style={{ width: "100%", display: "flex", gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>Senha</h5>
                <InputPassSignUp style={{ margin: "0px" }}>
                  <input
                    style={{
                      border: "1px solid #00D959",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                    type={typePass}
                    placeholder=""
                    value={password}
                    id="password"
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
              </div>
              <div style={{ width: "100%" }}>
                <h5>Repita a senha</h5>
                <InputPassSignUp style={{ margin: "0px" }}>
                  <input
                    style={{
                      border: "1px solid #00D959",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                    type={typePassR}
                    placeholder=""
                    value={repeatPass}
                    id="passwordr"
                    name="password"
                    onChange={(e) => setRepeatPass(e.target.value)}
                  />
                  {repeatPass &&
                    (typePassR === "password" ? (
                      <LiaEyeSolid
                        className="eyes"
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className="eyes"
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
                
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setOpen(false)}>
            CANCELAR
          </Button>
          <Button
            onClick={createAccess}
            style={{ color: "#000", minWidth: 140 }}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modalContract} maxWidth="md" fullWidth>
        <DialogTitle>Assinar MAX</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Pgto changeModal={changeModal} email={email} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalContract(false)}>
            CANCELAR
          </Button>
          {/* <Button
            onClick={createOrder}
            style={{ color: "#000", minWidth: 140 }}
          >
            Criar
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};
