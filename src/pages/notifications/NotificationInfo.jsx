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
import { useState, useEffect } from "react";
import { Button } from "../../../globalStyles";
import ReactLoading from "react-loading";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { InputPassSignUp } from "../login/Login.styles";
import api from "../../services/api";
import { translateError, translateStatus } from "../../services/util";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const NotificationInfo = ({
  notification,
  getNotification,
  setLoading,
  setMsg,
}) => {
  const { t } = useTranslation();
  // const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalReset, setShowModalReset] = useState(false);
  const [password, setPassword] = useState("");
  const [typePass, setTypePass] = useState("password");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [excludClient, setExcludClient] = useState(false);
  const [disableClient, setDisableClient] = useState(false);
  const [recipientsClient, setRecipientsClient] = useState([]);
  const [recipientsDealer, setRecipientsDealer] = useState([]);
  const [notificationDetails, setNotificationDetails] = useState({});

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

  let finalClients = [];
  let agents = [];
  let dealers = [];
  const getInfo = () => {
    setMsg("Buscando detalhes");
    setLoading(true);
    api.notification
      .getInfo(notification.Id)
      .then((res) => {
        console.log("detalheeees", res);
        res.data.NotificationsRecipients.map((r) => {
          if (r.FinalClient) {
            finalClients.push(r.FinalClient.Name);
          } else if (r.Dealer) {
            dealers.push(r.Dealer.Name);
          }
        });
        setRecipientsClient(finalClients);
        setRecipientsDealer(dealers);
        setNotificationDetails(res.data);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Object.keys(notificationDetails).length !== 0) {
      handleDetails();
    }
  }, [notificationDetails]);

  const recipientsArray = (recipients) => {
    return recipients.map((r, index) => (
      <span key={index}>
        {r.FinalClient ? r.FinalClient.Name : r.Dealer ? r.Dealer.Name : ""}

        {index < recipients.length - 1 && ", "}
      </span>
    ));
  };

  return (
    <>
      <tr>
        <td>{notification.Subject}</td>
        <td>{recipientsArray(notification.NotificationsRecipients)}</td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{new Date(notification.CreatedAt).toLocaleDateString()}</div>
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
                >
                  <MenuItem
                    onClick={() => {
                      if (Object.keys(notificationDetails).length !== 0) {
                        handleDetails();
                      } else {
                        getInfo();
                      }
                      console.log(notificationDetails);
                    }}
                  >
                    Detalhes
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <Dialog
        open={showModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogContent>
          {console.log(notificationDetails)}
          <div className="info_container">
            <div>
              <div className="info_title">
                <p className="bold">DETALHES DA NOTIFICAÇÃO</p>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">Assunto</label>
                  <p>{notificationDetails?.Subject}</p>
                </div>
                <div className="info_item_2">
                  <label className="bold">Data de envio</label>
                  <p>
                    {new Date(
                      notificationDetails?.CreatedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="info_line">
                <div className="info_item_2">
                  <label className="bold">Clientes</label>
                  <p>{recipientsClient}</p>
                </div>
                <div className="info_item_2">
                  <label className="bold">Vendedores</label>
                  <p>{recipientsDealer}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
