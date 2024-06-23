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
import api from "../../services/api";
import {
  documentFormat,
  formatPhone,
  phoneFormat,
  translateError,
  translateStatus,
} from "../../services/util";
import { IoMdMore } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { InputPassSignUp } from "../login/Login.styles";
import { toast } from "react-toastify";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { Button } from "../../../globalStyles";
import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */
export const ClientCardMobile = ({
  client,
  setLoading,
  setMsg,
  getClients,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const ITEM_HEIGHT = 48;
  const [userDetails, setUserDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalReset, setShowModalReset] = useState(false);
  const [password, setPassword] = useState("");
  const [typePass, setTypePass] = useState("password");
  const [anchorEl, setAnchorEl] = useState(null);
  const [excludClient, setExcludClient] = useState(false);
  const [disableClient, setDisableClient] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDetails = () => {
    setAnchorEl(null);
    setShowModal(true);
  };

  const getInfo = () => {
    setMsg(t("Clients.table.searchDetails"));
    setLoading(true);
    api.client
      .getInfo(client.Id)
      .then((res) => {
        console.log(res);
        setUserDetails(res.data);
        handleDetails();
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
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

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const getNewSession = () => {
    api.user
      .getUserSession(client?.UserId)
      .then((res) => {
        window.open(
          `https://tegg.app/?token=${res.data?.AccessToken}`,
          "_black"
        );
        setAnchorEl();
      })
      .catch((err) => translateError(err));
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
        getClients();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const excludAction = () => {
    setMsg("Excluindo cliente...");
    setLoading(true);
  };

  return (
    <>
      <div
        style={{
          width: "90%",
          backgroundColor: "#00D959",
          textAlign: "center",
          // color: '#3d3d3d',
          padding: "0.5rem",
          margin: "auto",
          borderRadius: "8px",
          marginTop: "0.2rem",
          position: "relative",
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            marginTop: '-10px',
            marginBottom: '-10px'
          }}
        >
          {/* <MdSignalWifiStatusbarNotConnected
            style={{ color: 'red' }}
            size={25}
            onClick={() => getStatus(i)}
          /> */}
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <IoMdMore />
          </IconButton>
        </div>
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
        >
          {/* <Checkbox
            // checked={checkedArray[index]}
            onChange={(e) => {
              handleCheck(e, i);
            }}
          /> */}
        </div>
        <h4 style={{ padding: "0.2rem", fontWeight: "bold" }}>
          {client.CompanyName || client.Name}
        </h4>
        <h5>{translateStatus(client?.Status)}</h5>
        <h5>
          {client.Cnpj
            ? documentFormat(client.Cnpj)
            : documentFormat(client.Cpf)}
        </h5>
        <h5>{client?.Mobile}</h5>
        <h5>{client?.SecondEmail}</h5>
        <h5 style={{ wordWrap: "anywhere" }}>
          Acesso ao sistema: {client.Email || client.SecondEmail}
        </h5>
        {api.currentUser.AccessTypes[0] === "TEGG" && (
          <h5>
            {/* <div> */}
            <span style={{ fontWeight: "bold" }}>
              {t("Clients.table.resale")}:{" "}
            </span>
            {client?.DealerId
              ? client?.Dealer?.CompanyName !== ""
                ? client?.Dealer?.CompanyName
                : client?.Dealer?.Name
              : "TEGG"}
            {/* </div> */}
          </h5>
        )}
        {/* <h4>{translateChipStatus(i.Status)}</h4> */}
      </div>

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
              {client.Status === "Active" ? "Desativar" : "Ativar"}
            </MenuItem>
          </>
        )}
      </Menu>

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
          <div>
            <div>
              <div className="info_title">
                <p className="bold">
                  {userDetails?.Type === "PF"
                    ? t("Clients.modalDetails.typePf")
                    : t("Clients.modalDetails.typePj")}
                </p>
                <p
                  // className="bold"
                  style={{
                    color: userDetails?.Status === "Active" ? "green" : "red", fontWeight: 'bold'
                  }}
                >
                  {userDetails?.Status === "Active"
                    ? t("Clients.modalDetails.active")
                    : t("Clients.modalDetails.disabled")}
                </p>
              </div>
              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.name")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Name}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.userLegacy")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.UserLegacySystem?.nome}</p>
                  <p></p>
                </div>
              </div>
              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.email")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Email}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.secondMail")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.SecondEmail}</p>
                </div>
              </div>
              {userDetails?.Type === "PF" ? (
                <div className="info_line">
                  <div>
                    <label className="bold">
                      {t("Clients.modalDetails.cpf")}
                    </label>
                    <p style={{ wordWrap: 'anywhere' }}>
                      {userDetails?.Cpf && documentFormat(userDetails?.Cpf)}
                    </p>
                  </div>
                  <div>
                    <label className="bold">
                      {t("Clients.modalDetails.rg")}
                    </label>
                    <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Rg}</p>
                  </div>
                </div>
              ) : (
                <div className="info_line">
                  <div>
                    <label className="bold">
                      {t("Clients.modalDetails.cnpj")}
                    </label>
                    <p style={{ wordWrap: 'anywhere' }}>
                      {userDetails?.Cnpj && documentFormat(userDetails?.Cnpj)}
                    </p>
                  </div>
                  <div>
                    <label className="bold">
                      {t("Clients.modalDetails.ie")}
                    </label>
                    <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Ie}</p>
                  </div>
                </div>
              )}

              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.phone")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>
                    {userDetails?.Mobile && phoneFormat(userDetails.Mobile)}
                  </p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.whatsapp")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>
                    {userDetails?.Whatsapp && phoneFormat(userDetails.Whatsapp)}
                  </p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line">
                <p className="bold">{t("Clients.modalDetails.address")}</p>
              </div>
              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.street")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.StreetName}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.number")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Number}</p>
                </div>
              </div>

              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.complement")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.Complement}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.postalCode")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.PostalCode}</p>
                </div>
              </div>

              <div className="info_line">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.neighborhood")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.District}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.city")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.City}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.state")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>{userDetails?.State}</p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line space_between">
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.dateRegister")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>
                    {userDetails?.CreatedAt &&
                      moment(userDetails?.CreatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <label className="bold">
                    {t("Clients.modalDetails.youResale")}
                  </label>
                  <p style={{ wordWrap: 'anywhere' }}>
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
                  <ul style={{ marginLeft: 5 }}>
                    {userDetails?.Plans?.map((p, i) => (
                      <li key={i} style={{ marginBottom: 15 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                          }}
                        >
                          <p style={{ wordWrap: 'anywhere' }}>
                            <span
                              style={{ fontWeight: "bold", marginRight: 10 }}
                            >
                              {t("Clients.modalDetails.line")}:
                            </span>
                            {formatPhone(p.Phone)}
                          </p>
                          <p style={{ wordWrap: 'anywhere' }}>
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
                    <p style={{ fontWeight: "bold",  wordWrap: 'anywhere' }}>
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
            {/* {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : ( */}
            {t("Clients.modalPassword.buttonReset")}
            {/* // )} */}
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
            Deseja realmente Excluir o cliente {client.Name}? Com a exclusão do
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
