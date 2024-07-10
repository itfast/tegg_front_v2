/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "../../../globalStyles";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
// import ReactLoading from 'react-loading';
import { IoMdMore } from "react-icons/io";
import "./client_info.css";
import {
  cnpjBancFormat,
  cpfBancFormat,
  documentFormat,
  phoneFormat,
  translateError,
  translateStatus,
  translateTypeClient,
} from "../../services/util";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import { DialogContentText, IconButton, Menu, MenuItem } from "@mui/material";
import { InputPassSignUp } from "../login/Login.styles";
import { useTranslation } from "react-i18next";

export const ClientInfo = ({ client, setLoading, setMsg, getClients }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  // const [infoLoading, setInfoLoading] = useState(false);
  const [excludClient, setExcludClient] = useState(false);
  const [disableClient, setDisableClient] = useState(false);

  // const [loading, setLoading] = useState(false);
  const [showModalReset, setShowModalReset] = useState(false);
  const [password, setPassword] = useState("");
  const [typePass, setTypePass] = useState("password");
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const action = () => {
    setLoading(true);
    api.user
      .updatePassword(client.Email, password)
      .then((res) => {
        toast.success(res.data.Message);
        setShowModalReset(false);
        setPassword();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const disableAction = () => {
    setMsg(`${ client.Status === "Active" ? "Desativando" : "Ativando"} cliente...`);
    setLoading(true);
    api.user
      .blockUnblock(
        client.Status === "Active" ? "Blocked" : "Active",
        client.Id
      )
      .then((res) => {
        toast.success(res.data.Message);
        setDisableClient(false);
        getClients()
        
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const excludAction = () => {
    setMsg("Excluindo cliente...");
    setLoading(true);
    api.client.delete(client.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setExcludClient(false);
        getClients()
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      const country = fullNumber.slice(0, 2);
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      // console.log(fullNumber, country, area, number1, number2);
      return `+${country} (${area}) ${number1}-${number2}`;
    }
  };

  const getInfo = () => {
    setMsg(t("Clients.table.searchDetails"));
    setLoading(true);
    api.client
      .getInfo(client.Id)
      .then((res) => {
        console.log(res);
        setUserDetails(res.data);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Object.keys(userDetails).length !== 0) {
      handleDetails();
    }
    // console.log("cliente", client);
    // getInfo();
  }, [userDetails]);

  const handleDetails = () => {
    setAnchorEl(null);
    setShowModal(true);
  };

  const getNewSession = () => {
    api.user
      .getUserSession(client?.UserId)
      .then((res) => {
        // window.open(`http://localhost:5173/?token=${res.data?.AccessToken}`, '_black');
        window.open(
          `https://tegg.app/?token=${res.data?.AccessToken}`,
          "_black"
        );
        setAnchorEl();
      })
      .catch((err) => translateError(err));
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        <td>{client.CompanyName || client.Name}</td>
        <td>{translateTypeClient(client?.User?.Type)}</td>
        <td>{translateStatus(client.Status)}</td>
        {/* <td>{client.Cnpj || client.Cpf}</td> */}
        <td>
          {(client.Type === "PJ" && documentFormat(client.Cnpj)) ||
            documentFormat(client.Cpf)}
        </td>
        <td>{client.Name}</td>
        {api.currentUser.AccessTypes[0] === "TEGG" && (
          <td>
            <div>
              {client?.DealerId
                ? client?.Dealer?.CompanyName !== "" &&
                  client?.Dealer?.CompanyName !== null
                  ? client?.Dealer?.CompanyName
                  : client?.Dealer?.Name
                : "TEGG"}
            </div>
          </td>
        )}
        <td>{client.SecondEmail}</td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{client.Email}</div>
            <div>
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
                      maxHeight: ITEM_HEIGHT * 4.5,
                      // width: '10ch',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      if (Object.keys(userDetails).length !== 0) {
                        handleDetails();
                      } else {
                        getInfo();
                      }
                    }}
                  >
                    {t("Clients.table.buttonDetails")}
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate("/clients/edit", {
                        state: { clients: client },
                      })
                    }
                  >
                    {t("Clients.table.buttonEdit")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setShowModalReset(true);
                      handleClose();
                    }}
                  >
                    {t("Clients.table.buttonPassword")}
                  </MenuItem>
                  {api.currentUser?.Type === "TEGG" && (
                    <>
                      <MenuItem onClick={getNewSession}>
                        Acessar Painel
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setAnchorEl();
                          setExcludClient(true);
                        }}
                      >
                        Excluir
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setDisableClient(true), setAnchorEl();
                        }}
                      >
                        {client.Status === "Active" ? "Desativar" : "Ativar"}
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <Dialog
        open={showModal}
        // onClose={() => console.log('fechar')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        {/* <DialogTitle id="alert-dialog-title">
          {t("Clients.modalDetails.title")}
        </DialogTitle> */}
        <DialogContent>
          {console.log(userDetails)}
          <div className="info_container">
            <div>
              <div className="info_title">
                <p className="bold">
                  {userDetails?.Type === "PF"
                    ? t("Clients.modalDetails.typePf")
                    : t("Clients.modalDetails.typePj")}
                </p>
                <p
                  className="bold"
                  style={{
                    color: userDetails?.Status === "Active" ? "green" : "red",
                  }}
                >
                  {userDetails?.Status === "Active"
                    ? t("Clients.modalDetails.active")
                    : t("Clients.modalDetails.disabled")}
                </p>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.name")}
                  </label>
                  <p>{userDetails?.Name}</p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.userLegacy")}
                  </label>
                  <p>{userDetails?.UserLegacySystem?.nome}</p>
                  <p></p>
                </div>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.email")}
                  </label>
                  <p>{userDetails?.Email}</p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.secondMail")}
                  </label>
                  <p>{userDetails?.SecondEmail}</p>
                </div>
              </div>
              {userDetails?.Type === "PF" ? (
                <div className="info_line">
                  <div className="info_item_2">
                    <label className="bold">
                      {t("Clients.modalDetails.cpf")}
                    </label>
                    <p>{userDetails?.Cpf && cpfBancFormat(userDetails?.Cpf)}</p>
                  </div>
                  <div className="info_item_2">
                    <label className="bold">
                      {t("Clients.modalDetails.rg")}
                    </label>
                    <p>{userDetails?.Rg}</p>
                  </div>
                </div>
              ) : (
                <div className="info_line">
                  <div className="info_item_2">
                    <label className="bold">
                      {t("Clients.modalDetails.cnpj")}
                    </label>
                    <p>
                      {userDetails?.Cnpj && cnpjBancFormat(userDetails?.Cnpj)}
                    </p>
                  </div>
                  <div className="info_item_2">
                    <label className="bold">
                      {t("Clients.modalDetails.ie")}
                    </label>
                    <p>{userDetails?.Ie}</p>
                  </div>
                </div>
              )}

              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.phone")}
                  </label>
                  <p>
                    {userDetails?.Mobile && phoneFormat(userDetails.Mobile)}
                  </p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {t("Clients.modalDetails.whatsapp")}
                  </label>
                  <p>
                    {userDetails?.Whatsapp && phoneFormat(userDetails.Whatsapp)}
                  </p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line">
                <p className="bold">{t("Clients.modalDetails.address")}</p>
              </div>
              <div className="info_line">
                <div className="info_item_80">
                  <label className="bold">
                    {t("Clients.modalDetails.street")}
                  </label>
                  <p>{userDetails?.StreetName}</p>
                </div>
                <div className="info_item_20">
                  <label className="bold">
                    {t("Clients.modalDetails.number")}
                  </label>
                  <p>{userDetails?.Number}</p>
                </div>
              </div>

              <div className="info_line">
                <div className="info_item_80">
                  <label className="bold">
                    {t("Clients.modalDetails.complement")}
                  </label>
                  <p>{userDetails?.Complement}</p>
                </div>
                <div className="info_item_20">
                  <label className="bold">
                    {t("Clients.modalDetails.postalCode")}
                  </label>
                  <p>{userDetails?.PostalCode}</p>
                </div>
              </div>

              <div className="info_line">
                <div className="info_item_45">
                  <label className="bold">
                    {t("Clients.modalDetails.neighborhood")}
                  </label>
                  <p>{userDetails?.District}</p>
                </div>
                <div className="info_item_40">
                  <label className="bold">
                    {t("Clients.modalDetails.city")}
                  </label>
                  <p>{userDetails?.City}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.state")}
                  </label>
                  <p>{userDetails?.State}</p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line space_between">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.dateRegister")}
                  </label>
                  <p>
                    {userDetails?.CreatedAt &&
                      moment(userDetails?.CreatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.youResale")}
                  </label>
                  <p>
                    {userDetails?.DealerId
                      ? userDetails?.Dealer?.CompanyName !== ""
                        ? userDetails?.Dealer?.CompanyName
                        : userDetails?.Dealer?.Name
                      : "TEGG"}
                  </p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.linesRegistered")}
                  </label>
                </div>
              </div>
              <div className="info_line">
                {userDetails?.Plans?.length > 0 ? (
                  <ul style={{ marginLeft: 30 }}>
                    {userDetails?.Plans?.map((p, i) => (
                      <li key={i} style={{ marginBottom: 15 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                          }}
                        >
                          <p>
                            <span
                              style={{ fontWeight: "bold", marginRight: 10 }}
                            >
                              {t("Clients.modalDetails.line")}:
                            </span>
                            {formatPhone(p.Phone)}
                          </p>
                          <p>
                            <span
                              style={{ fontWeight: "bold", marginRight: 10 }}
                            >
                              {t("Clients.modalDetails.plan")}:
                            </span>{" "}
                            {p.Plan}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      {t("Clients.modalDetails.notHaveLine")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModal(false)}>
            {t("Clients.modalDetails.buttonClose")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showModalReset}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Clients.modalPassword.title")}
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
                placeholder={t("Clients.modalPassword.new")}
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
          <Button invert onClick={() => setShowModalReset(false)}>
            {t("Clients.modalPassword.buttonCancel")}
          </Button>
          <Button notHover onClick={action} autoFocus>
            {t("Clients.modalPassword.buttonReset")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={disableClient}>
        <DialogTitle>
          {client.Status === "Active" ? "Desativar" : "Ativar"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente{" "}
            {client.Status === "Active" ? "desativar" : "ativar"} o cliente{" "}
            {client.Name}?{" "}
            {client.Status === "Active"
              ? "Se o cliente for desativado ele não conseguirá mais acessar o sistema."
              : "Se o cliente for ativado ele voltara a ter acesso ao sistema."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setDisableClient(false)}>
            Cancelar
          </Button>
          <Button notHover onClick={disableAction} autoFocus>
          {client.Status === "Active" ? "Desativar" : "Ativar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={excludClient}>
        <DialogTitle>Excluir</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente Excluír o cliente {client.Name}? Com a exclusão do
            cliente do sistema todo o seu histórico de pedidos e transações no
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
  );
};
