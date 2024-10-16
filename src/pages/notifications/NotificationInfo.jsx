import { IoMdMore } from "react-icons/io";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Button } from "../../../globalStyles";
import api from "../../services/api";
import { translateError } from "../../services/util";

export const NotificationInfo = ({
  notification,
  setLoading,
  setMsg,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [recipientsClient, setRecipientsClient] = useState([]);
  const [recipientsAgent, setRecipientsAgent] = useState([]);
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
          if (r?.FinalClient) {
            if (r?.FinalClient?.User?.Type == "AGENT") {
              agents.push({name: r?.FinalClient?.Name, email: r?.FinalClient?.Email});
            } else {
              finalClients.push({name: r?.FinalClient?.Name, email: r?.FinalClient?.Email});
            }
          } else if (r?.Dealer) {
            dealers.push({name: r?.Dealer?.Name, email: r?.Dealer?.Email});
          }
        });
        setRecipientsClient(finalClients);
        setRecipientsAgent(agents);
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
              <hr className="margin_half" />
              <div className="info_title">
                <p className="bold">DESTINATÁRIOS</p>
              </div>
              <div className="info_line">
                <div className="info_item_2" style={{width:"100%"}}>
                  <label className="bold">Clientes</label>
                  <p>
                    {recipientsClient.length >= 1
                      ? recipientsClient.map((client) => (
                          <div>
                            {client.name}
                            {` <${client.email}>`}
                          </div>
                        ))
                      : "Nenhum"}
                  </p>
                </div>
              </div>
              <br />
              <div className="info_line">
                <div className="info_item_2" style={{width:"100%"}}>
                  <label className="bold">Representantes</label>
                  <p>
                    {recipientsAgent.length >= 1
                      ? recipientsAgent.map((agent) => (
                          <div>
                            {agent.name}
                            {` <${agent.email}>`}
                          </div>
                        ))
                      : "Nenhum"}
                  </p>
                </div>
              </div>
              <br />
              <div className="info_line">
                <div className="info_item_2" style={{width:"100%"}}>
                  <label className="bold">Vendedores</label>
                  <p>
                    {recipientsDealer.length >= 1
                      ? recipientsDealer.map((dealer) => (
                          <div>
                            {dealer.name}
                            {` <${dealer.email}>`}
                          </div>
                        ))
                      : "Nenhum"}
                  </p>
                </div>
              </div>
              <hr className="margin_half" />
              <div className="info_title">
                <p className="bold">MENSAGEM</p>
              </div>
              <div className="info_line">
                <div
                  className="info_item_2"
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{ marginLeft: "20px" }}
                    dangerouslySetInnerHTML={{
                      __html: notificationDetails?.Message,
                    }}
                  ></div>
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
