/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { Button } from "../../../globalStyles";
import ReactLoading from "react-loading";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { InputPassSignUp } from "../login/Login.styles";
import api from "../../services/api";
import { translateError, translateStatus } from "../../services/util";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const ResaleInfo = ({ dealer, getDealers, setLoading, setMsg, loading }) => {
  const { t } = useTranslation();
  // const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [typePass, setTypePass] = useState("password");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [excludClient, setExcludClient] = useState(false);
  const [disableClient, setDisableClient] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const action = () => {
    setMsg('Resetando a senha...')
    setLoading(true);
    api.user
      .updatePassword(dealer.CompanyEmail, password)
      .then((res) => {
        toast.success(res.data.Message);
        setShowModal(false);
        setPassword();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
    // api.user.updatePassword(dealer.CompanyEmail || dealer.Email, password)
    // .then((res) => {
    // 	toast.success(res.data.Message);
    // 	setShowModal(false)
    // 	setPassword()
    // })
    // .catch((err) => {
    // 	translateError(err)
    // })
    // .finally(()=> setLoading(false))
  };

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };
  const getNewSession = () => {
    api.user
      .getUserSession(dealer?.UserId)
      .then((res) => {
        window.open(
          `https://tegg.app/?token=${res.data?.AccessToken}`,
          "_black"
        );
        // window.open(`http://192.168.15.29:3000/?token=${res.data?.AccessToken}`, '_black');
        setAnchorEl();
      })
      .catch((err) => translateError(err));
  };

  const disableAction = () => {
    setMsg(`${ dealer.Status === "Active" ? "Desativando" : "Ativando"} revenda...`);
    setLoading(true);
    api.dealer
      .blockUnblock(
        dealer.Status === "Active" ? "Blocked" : "Active",
        dealer.Id
      )
      .then((res) => {
        toast.success(res.data.Message);
        setDisableClient(false);
        getDealers()
        
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const excludAction = () => {
    // setMsg("Excluindo cliente...");
    setLoading(true);
    // api.user
    //   .updatePassword(client.Email, password)
    //   .then((res) => {
    //     toast.success(res.data.Message);
    //     setShowModalReset(false);
    //     setPassword();
    //   })
    //   .catch((err) => {
    //     translateError(err);
    //   })
    //   .finally(() => setLoading(false));
  };

  return (
    // <tbody>
    <>
      <tr>
        <td>{dealer.CompanyName || dealer.Name}</td>
        <td>{translateStatus(dealer.Status)}</td>
        <td>{dealer.Cnpj || dealer.Cpf}</td>
        <td>{dealer.Name}</td>
        <td>{dealer.Email || dealer.CompanyEmail}</td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{dealer.CompanyEmail || dealer.Email}</div>
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
              >
                <MenuItem
                  onClick={() =>
                    navigate("/salesforce/details", {
                      state: { dealer: dealer },
                    })
                  }
                >
                  {t("Resales.table.buttonDetails")}
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/salesforce/edit/${dealer.Cnpj ? "pj" : "pf"}`, {
                      state: { dealer: dealer },
                    })
                  }
                >
                  {t("Resales.table.buttonEdit")}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowModal(true);
                    handleClose();
                  }}
                >
                  {t("Resales.table.buttonPassword")}
                </MenuItem>
                {api.currentUser?.Type === "TEGG" && (
                  <>
                    <MenuItem onClick={getNewSession}>Acessar Painel</MenuItem>
                    {/* <MenuItem
                      onClick={() => {
                        setAnchorEl();
                        setExcludClient(true);
                      }}
                    >
                      Excluir
                    </MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        setDisableClient(true), setAnchorEl();
                      }}
                    >
                       {dealer.Status === "Active" ? "Desativar" : "Ativar"}
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </td>
      </tr>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Resales.table.modalPassword.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <InputPassSignUp style={{ fontSize: "10px" }}>
              <input
                style={{
                  border: "1px solid #00D959",
                  background: "transparent",
                  fontSize: "14px",
                }}
                type={typePass}
                placeholder={t("Resales.table.modalPassword.new")}
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModal(false)}>
            {t("Resales.table.modalPassword.buttonCancel")}
          </Button>
          <Button notHover={loading} onClick={action} autoFocus>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <ReactLoading type={"bars"} color={"#fff"} />
              </div>
            ) : (
              t("Resales.table.modalPassword.buttonReset")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={disableClient}>
        <DialogTitle>
          {dealer.Status === "Active" ? "Desativar" : "Ativar"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente{" "}
            {dealer.Status === "Active" ? "desativar" : "ativar"} a revenda{" "}
            {dealer.Name}?{" "}
            {dealer.Status === "Active"
              ? "Se a revenda for desativada, ela não conseguirá mais acessar o sistema."
              : "Se a revenda for ativada, ela voltara a ter acesso ao sistema."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setDisableClient(false)}>
            Cancelar
          </Button>
          <Button notHover onClick={disableAction} autoFocus>
          {dealer.Status === "Active" ? "Desativar" : "Ativar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={excludClient}>
        <DialogTitle>Excluir</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente Excluir a revenda {dealer.Name}? Com a exclusão da
            revenda do sistema todo o seu histórico de pedidos e transações no
            sistema serão perdidos!
            <div
              style={{
                border: "2px dashed red",
                padding: "0.5rem",
                textAlign: "center",
              }}
            >
              ESTA AÇÃO É IRREVERSÍVEL
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setExcludClient(false)}>
            Cancelar
          </Button>
          <Button notHover onClick={excludAction} autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
    // </tbody>
  );
};
