/* eslint-disable react/prop-types */
import moment from "moment";
import { useState } from "react";
import { IoMdMore } from "react-icons/io";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Button } from "../../../globalStyles";
import { InputData } from "../orders/clientNew/NewOrder.styles";
import { phoneFormat, translateError } from "../../services/util";
import { InputPassSignUp } from "../resetPassword/ResetPassword.styles";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import Select from "react-select";
import api from "../../services/api";
// import { Loading } from "../../components/loading/Loading";

export const StreamingManagementTable = ({setLoading, setMsg}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalActiv, setModalActiv] = useState(false);
  const [modalDesactiv, setModalDesactiv] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  // const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [typePassR, setTypePassR] = useState("password");
  const [typePass, setTypePass] = useState("password");

  const [cpf, setCpf] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState();
  const [phone, setPhone] = useState();
  // const [client, setClient] = useState();

  const [planOpt, setPlanOpt] = useState([])

  const open = Boolean(anchorEl);

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const handleTypePassR = () => {
    setTypePassR(typePassR === "password" ? "text" : "password");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const actionActiv = () => {
    alert("Ativar usuario");
  };

  const actionDesactiv = () => {
    alert("Desativar usuario");
  };

  const actionEdit = () => {
    alert("Editar usuario");
  };

  const searchUserPlans = () => {
    setMsg('Buscando planos do usuário')
    setLoading(true)
    api.streaming
      .userStreams("willian@itfast.com.br")
      .then((res) => {
        console.log(res);
        const list = []
        res.data.forEach((d)=>{
          list.push({label: d.ProductId, value: d.ProductId})
        })
        setPlanOpt(list)
        setModalDesactiv(true);
        handleClose();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false))
  };
  return (
    <>
      <tr>
        <td>Glaydson Bertozzi Lima</td>
        <td>glaydson@itfast.com.br</td>
        <td>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(41.9)}
        </td>
        <td>{moment(new Date()).format("DD/MM/YYYY")}</td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>19/05/2024</div>
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                {/* <MoreVertIcon /> */}
                <IoMdMore />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    // maxHeight: ITEM_HEIGHT * 4.5,
                    // width: "20ch",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setModalActiv(true);
                    handleClose();
                  }}
                >
                  Ativar
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    searchUserPlans();
                  }}
                >
                  Desativar
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setModalEdit(true);
                    handleClose();
                  }}
                >
                  Editar
                </MenuItem>
                {/* <MenuItem
                  onClick={() => {setModalEdit(true)}}
                >
                  Excluir
                </MenuItem> */}
              </Menu>
            </div>
          </div>
        </td>
      </tr>
      <Dialog
        open={modalActiv}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ATIVAR</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente ativar o usuário para ter acesso serviço de
            streaming?
            <div style={{ marginTop: 10 }}>
              <Select
                name="pages"
                id="page-select"
                options={[
                  { label: "Plano A", value: "1" },
                  { label: "Plano B", value: "2" },
                  { label: "Plano C", value: "3" },
                ]}
                style={{ minWidth: "100px" }}
                // value={esim}
                placeholder="Selecione o Plano"
                // onChange={(e) => {
                //   setEsim(e);
                // }}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={"fixed"}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalActiv(false)}>
            CANCELAR
          </Button>
          <Button notHover onClick={actionActiv} autoFocus>
            ATIVAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalDesactiv}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">DESATIVAR</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente desativar o acesso do usuário ao serviço de
            streaming?
            <div style={{ marginTop: 10 }}>
              <Select
                name="pages"
                id="page-select"
                options={planOpt}
                style={{ minWidth: "100px" }}
                // value={esim}
                placeholder="Selecione o Plano"
                // onChange={(e) => {
                //   setEsim(e);
                // }}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={"fixed"}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalDesactiv(false)}>
            CANCELAR
          </Button>
          <Button notHover onClick={actionDesactiv} autoFocus>
            DESATIVAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalEdit}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">EDITAR</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ width: "100%", display: "flex", gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>Usuário (de acesso ao sistema)</h5>
                <InputData
                  disabled
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
                    id="passwordConfirm"
                    name="passwordConfirm"
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
            <h5>Nome</h5>
            <InputData
              value={name}
              style={{ width: "100%" }}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ width: "100%", display: "flex", gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>CPF</h5>
                <InputData
                  disabled
                  value={cpf}
                  style={{ width: "100%" }}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>Email</h5>
                <InputData
                  value={email}
                  style={{ width: "100%" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalEdit(false)}>
            CANCELAR
          </Button>
          <Button notHover onClick={actionEdit} autoFocus>
            SALVAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
