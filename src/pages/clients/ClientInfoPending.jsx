/* eslint-disable react/prop-types */
import { Button } from "../../../globalStyles";
import { useEffect, useState } from "react";
import api from "../../services/api";
// import { toast } from 'react-toastify';
// import ReactLoading from 'react-loading';
import { IoMdMore } from "react-icons/io";
import "./client_info.css";
import {
  // cnpjFormat,
  cpfBancFormat,
  documentFormat,
  phoneFormat,
  translateError,
} from "../../services/util";
import ReactLoading from "react-loading";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import { DialogContentText, IconButton, Menu, MenuItem } from "@mui/material";
import { InputData, MultiLineInputData } from "../resales/Resales.styles";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const ClientInfoPending = ({
  client,
  setLoading,
  setMsg,
  getClients,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [loadingResendEmail, setLoadingResendEmail] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [justify, setJustify] = useState("");
  const [email, setEmail] = useState("");
  // const [infoLoading, setInfoLoading] = useState(false);

  // const [loading, setLoading] = useState(false);
  const [showModalAprov, setShowModalAprov] = useState(false);
  const [showModalReprov, setShowModalReprov] = useState(false);
  // const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const action = () => {
    setMsg(t("ClientsPending.actionApprovMsg"));
    setLoading(true);
    api.client
      .updateStatusPreregistration(userDetails?.Id, "APPROVED", null)
      .then((res) => {
        setUserDetails({});
        toast.success(res?.data?.Message);
        setShowModal(false);
        setShowModalAprov(false);
        getClients();
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
        setMsg(t("ClientsPending.searchMsg"));
      });
  };

  const actionReprov = () => {
    if (justify === "") {
      toast.error(t("ClientsPending.errorMsgRepprov"));
    } else {
      setMsg(t("ClientsPending.actionRepprovMsg"));
      setLoading(true);
      api.client
        .updateStatusPreregistration(userDetails?.Id, "REPPROVED", justify)
        .then((res) => {
          setUserDetails({});
          toast.success(res?.data?.Message);
          setShowModal(false);
          setShowModalReprov(false);
          getClients();
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
          setMsg(t("ClientsPending.searchMsg"));
        });
    }
  };

  const getInfo = () => {
    setMsg(t("ClientsPending.searchDetailsClient"));
    setLoading(true);
    api.client
      .getPreregistrationId(client.Id)
      .then((res) => {
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

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return t("ClientsPending.status.pending");
      case "PENDING_PLAN":
        return t("ClientsPending.status.pendingPlan");
      case "REPPROVED":
        return t("ClientsPending.status.repproved");
      case "APPROVED":
        return t("ClientsPending.status.approved");
      default:
        return status;
    }
  };

  const sendEmail = () => {
    setLoadingResendEmail(true);
    console.log(client.Id);

    api.client
      .resendEmailPreregistration(email, client.Id)
      .then((res) => {
        toast.info(res.data?.Message);
        setShowResendEmail(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoadingResendEmail(false));
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        {/* {console.log(client)} */}
        <td>{client.Name}</td>
        <td>
          {(client.Cpf && documentFormat(client.Cpf)) ||
            (client.Cnpj && documentFormat(client.Cnpj))}
        </td>
        <td>{client.Name}</td>
        <td>{client.Email}</td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{translateStatus(client.Status)}</div>
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
                      // maxHeight: ITEM_HEIGHT * 4.5,
                      // width: "10ch",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      getInfo();
                    }}
                  >
                    {t("ClientsPending.buttonDetails")}
                  </MenuItem>
                  {client.Status === "PENDING_PLAN" && (
                    <MenuItem
                      onClick={() => {
                        setEmail(client.Email);
                        setShowResendEmail(true);
                      }}
                    >
                      {t("ClientsPending.resendMail")}
                    </MenuItem>
                  )}
                </Menu>
              </div>
            </div>
          </div>{" "}
        </td>
      </tr>

      <Dialog
        open={showResendEmail}
        onClose={() => {
          setShowResendEmail(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {t("ClientsPending.modalResend.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <InputData
              id="email"
              type="text"
              // disabled={searched}
              placeholder="Email"
              style={{ width: 250 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowResendEmail(false);
            }}
          >
            {t("ClientsPending.modalResend.buttonClose")}
          </Button>
          <Button onClick={() => sendEmail()}>
            {loadingResendEmail ? (
              <div className="loading">
                <ReactLoading type={"bars"} color={"#000"} />
              </div>
            ) : (
              t("ClientsPending.modalResend.buttonSend")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showModal}
        // onClose={() => console.log('fechar')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("ClientsPending.modalDetails.title")}
        </DialogTitle>
        <DialogContent>
          <div className="info_container">
            <div>
              <div className="info_title">
                <p className="bold">
                  {userDetails?.Type === "DEALER"
                    ? t("ClientsPending.modalDetails.embassador")
                    : t("ClientsPending.modalDetails.client")}
                </p>
              </div>

              {userDetails?.Cnpj !== "" && userDetails?.Type === "DEALER" && (
                <>
                  <div className="info_line">
                    <p className="bold">
                      {t("ClientsPending.modalDetails.company")}
                    </p>
                  </div>
                  <div className="info_line">
                    <div className="info_item_45">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.companyName")}
                      </label>
                      <p>{userDetails?.CompanyName}</p>
                    </div>
                    <div className="info_item_40">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.cnpj")}
                      </label>
                      <p>{userDetails?.Cnpj}</p>
                    </div>
                    <div className="info_item_20">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.ie")}
                      </label>
                      <p>{userDetails?.Ie}</p>
                    </div>
                  </div>
                  <div className="info_line">
                    <div className="info_line">
                      <div className="info_item_2">
                        <label className="bold">
                          {t("ClientsPending.modalDetails.email")}
                        </label>
                        <p>{userDetails?.CompanyEmail}</p>
                      </div>
                    </div>
                    <div className="info_line">
                      <div className="info_item_2">
                        <label className="bold">
                          {t("ClientsPending.modalDetails.phone")}
                        </label>
                        <p>{userDetails?.CompanyMobile}</p>
                      </div>
                    </div>
                  </div>
                  {/* ENDEREçO empresa */}
                  <hr className="margin_half" />
                  <div className="info_line">
                    <p className="bold">
                      {t("ClientsPending.modalDetails.address")}
                    </p>
                  </div>
                  <div className="info_line">
                    <div className="info_item_80">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.street")}
                      </label>
                      <p>{userDetails?.CompanyStreetName}</p>
                    </div>
                    <div className="info_item_20">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.number")}
                      </label>
                      <p>{userDetails?.CompanyNumber}</p>
                    </div>
                  </div>

                  <div className="info_line">
                    <div className="info_item_80">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.complement")}
                      </label>
                      <p>{userDetails?.CompanyComplement}</p>
                    </div>
                    <div className="info_item_20">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.postalCode")}
                      </label>
                      <p>{userDetails?.CompanyPostalCode}</p>
                    </div>
                  </div>

                  <div className="info_line">
                    <div className="info_item_45">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.neighborhood")}
                      </label>
                      <p>{userDetails?.CompanyDistrict}</p>
                    </div>
                    <div className="info_item_40">
                      <label className="bold">
                        {t("ClientsPending.modalDetails.city")}
                      </label>
                      <p>{userDetails?.CompanyCity}</p>
                    </div>
                    <div>
                      <label className="bold">
                        {t("ClientsPending.modalDetails.state")}
                      </label>
                      <p>{userDetails?.CompanyState}</p>
                    </div>
                  </div>
                  <hr className="margin_half" />
                </>
              )}

              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.name")}
                  </label>
                  <p>{userDetails?.Name}</p>
                </div>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.email")}
                  </label>
                  <p>{userDetails?.Email}</p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.secondMail")}
                  </label>
                  <p>{userDetails?.SecondEmail}</p>
                </div>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  {console.log(userDetails?.Cnpj)}
                  <label className="bold">
                    {userDetails?.Cpf
                      ? t("ClientsPending.modalDetails.cpf")
                      : t("ClientsPending.modalDetails.cnpj")}
                  </label>
                  <p>
                    {userDetails?.Cpf !== ""
                      ? userDetails?.Cpf && cpfBancFormat(userDetails?.Cpf)
                      : userDetails?.Cnpj && documentFormat(userDetails?.Cnpj)}
                  </p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {userDetails?.Rg
                      ? t("ClientsPending.modalDetails.rg")
                      : t("ClientsPending.modalDetails.ie")}
                  </label>
                  <p>
                    {userDetails?.Rg !== "" ? userDetails?.Rg : userDetails?.Ie}
                  </p>
                </div>
              </div>

              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.phone")}
                  </label>
                  <p>
                    {userDetails?.Mobile && phoneFormat(userDetails.Mobile)}
                  </p>
                </div>
                <div className="info_item_2">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.whatsapp")}
                  </label>
                  <p>
                    {userDetails?.Whatsapp && phoneFormat(userDetails.Whatsapp)}
                  </p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_line">
                <p className="bold">
                  {t("ClientsPending.modalDetails.address")}
                </p>
              </div>
              <div className="info_line">
                <div className="info_item_80">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.street")}
                  </label>
                  <p>{userDetails?.StreetName}</p>
                </div>
                <div className="info_item_20">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.number")}
                  </label>
                  <p>{userDetails?.Number}</p>
                </div>
              </div>

              <div className="info_line">
                <div className="info_item_80">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.complement")}
                  </label>
                  <p>{userDetails?.Complement}</p>
                </div>
                <div className="info_item_20">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.postalCode")}
                  </label>
                  <p>{userDetails?.PostalCode}</p>
                </div>
              </div>

              <div className="info_line">
                <div className="info_item_45">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.neighborhood")}
                  </label>
                  <p>{userDetails?.District}</p>
                </div>
                <div className="info_item_40">
                  <label className="bold">
                    {t("ClientsPending.modalDetails.city")}
                  </label>
                  <p>{userDetails?.City}</p>
                </div>
                <div>
                  <label className="bold">
                    {t("ClientsPending.modalDetails.state")}
                  </label>
                  <p>{userDetails?.State}</p>
                </div>
              </div>
              {userDetails?.Status === "REPPROVED" && (
                <>
                  <hr className="margin_half" />
                  <div className="info_line space_between">
                    <div>
                      <label className="bold">
                        {t("ClientsPending.modalDetails.repprovMsg")}
                      </label>
                      <p>{userDetails?.Comments}</p>
                    </div>
                  </div>
                </>
              )}
              <hr className="margin_half" />
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div>
                  <label className="bold">
                    {t("ClientsPending.modalDetails.registerDate")}
                  </label>
                  <p>
                    {userDetails?.CreatedAt &&
                      moment(userDetails?.CreatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setUserDetails({});
              setShowModal(false);
            }}
          >
            {t("ClientsPending.modalDetails.buttonClose")}
          </Button>
          <Button
            disabled={userDetails?.Status !== "PENDING"}
            style={{
              backgroundColor: userDetails?.Status === "PENDING" && "red",
            }}
            notHover={userDetails?.Status === "PENDING"}
            onClick={() => setShowModalReprov(true)}
          >
            {t("ClientsPending.modalDetails.buttonRepprov")}
          </Button>
          <Button
            disabled={userDetails?.Status !== "PENDING"}
            onClick={() => setShowModalAprov(true)}
          >
            {t("ClientsPending.modalDetails.buttonApprov")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showModalAprov}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("ClientsPending.modalApprov.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("ClientsPending.modalApprov.msg")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModalAprov(false)}>
            {t("ClientsPending.modalApprov.buttonCancel")}
          </Button>
          <Button notHover onClick={action} autoFocus>
            {t("ClientsPending.modalApprov.buttonApprov")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showModalReprov}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("ClientsPending.modalRepprov.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("ClientsPending.modalRepprov.msg1")} <br />{" "}
            {t("ClientsPending.modalRepprov.msg2")} &#40;
            {t("ClientsPending.modalRepprov.msg3")}&#41;:
            <MultiLineInputData
              placeholder= {t("ClientsPending.modalRepprov.justifyRepprov")}
              rows={3}
              className="input"
              style={{ textAlign: "start" }}
              value={justify}
              onChange={(e) => {
                setJustify(e.target.value);
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowModalReprov(false);
              setJustify("");
            }}
          >
            {t("ClientsPending.modalRepprov.buttonCancel")}
          </Button>
          <Button
            style={{ backgroundColor: "red" }}
            notHover
            onClick={actionReprov}
            autoFocus
          >
            {t("ClientsPending.modalRepprov.buttonRepprov")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
