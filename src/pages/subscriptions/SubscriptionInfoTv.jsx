/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "../../../globalStyles";
import { toast } from "react-toastify";
// import { GiCancel } from 'react-icons/gi';
// import { GrUpdate } from 'react-icons/gr';
// import { GoArrowSwitch } from 'react-icons/go';
// import { MdOutlineEditCalendar } from 'react-icons/md';
import { useEffect, useState } from "react";
import api from "../../services/api";
import ReactLoading from "react-loading";
// import _ from 'lodash';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { translateError } from "../../services/util";
// import { IconButton, Menu, MenuItem } from "@mui/material";
// import { IoMdMore } from "react-icons/io";
import moment from "moment";
import { LiaEyeSlash, LiaEyeSolid } from "react-icons/lia";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { IoMdMore } from "react-icons/io";
import { Pgto } from "../streaming/Pgto";

export const SubscriptionInfoTv = ({
  subscription,
  getSubscriptions,
  setEdit,
  changeModal,
}) => {
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showCancelPlan, setShowCancelPlan] = useState(false);
  const [typePass, setTypePass] = useState("password");
  const [modalContract, setModalContract] = useState(false);
  const [email, setEmail] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  let qtdStandard = 0;
  let qtdPremium = 0;
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (api.currentUser) {
      setEmail(api.currentUser.Email);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeModalI = () => {
    setModalContract(false);
    changeModal();
  };

  const handleCancel = () => {
    setLoadingCancel(true);
    api.iccid
      .cancelSubscription(subscription?.PlayHubSubscriptions[0]?.SubscriptionId)
      .then((res) => {
        toast.success(res.data.Message);
        setShowCancel(false);
        getSubscriptions();
        changeModal()
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingCancel(false);
        getSubscriptions();
        // reload();
        // getSubscriptions(pageNum, pageSize);
      });
  };

  const handleCancelPlan = () => {
    setLoadingCancel(true);
    if (subscription?.PlayHubSubscriptions[0]?.SubscriptionId) {
      api.iccid
        .cancelSubscription(
          subscription?.PlayHubSubscriptions[0]?.SubscriptionId
        )
        .then(() => {
          toast.success("Plano cancelado com sucesso");
          setShowCancelPlan(false);
          getSubscriptions();
          changeModal()
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingCancel(false);
          getSubscriptions();
        });
    } else {
      setShowCancelPlan(false);
      toast.success("Plano cancelado com sucesso");
      setLoadingCancel(false);
      getSubscriptions();
      changeModal()
    }
  };

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const getProducts = () => {
    let premium = 0;
    let standard = 0;

    subscription?.PlayHubSubscriptions?.forEach((p) => {
      const has = p.PlayHubId?.includes("P");
      if (has) {
        premium += Number(p.PlayHubId?.substring(1, p.PlayHubId?.lenght));
      } else {
        standard += Number(p.PlayHubId?.substring(1, p.PlayHubId?.lenght));
      }
    });
    qtdStandard = standard;
    qtdPremium = premium;
    return (
      <div>
        {standard > 0 && <h5>Standard: {standard}</h5>}
        {premium > 0 && <h5>Premium: {premium} </h5>}
      </div>
    );
  };

  const getDates = () => {
    let premium;
    let standard;

    subscription?.PlayHubSubscriptions?.forEach((p) => {
      const has = p.PlayHubId?.includes("P");
      if (has) {
        premium = moment(p?.EndDate).format("DD/MM/YYYY");
      } else {
        standard = moment(p?.EndDate).format("DD/MM/YYYY");
      }
    });
    return (
      <div>
        {standard && <h5>Standard: {standard}</h5>}
        {premium && <h5>Premium: {premium} </h5>}
      </div>
    );
  };

  const getDate = (product) => {
    let myDate = "";
    subscription?.PlayHubSubscriptions?.forEach((p) => {
      const has = p.PlayHubId?.includes(product);
      if (has) {
        myDate = moment(p?.EndDate).format("DD/MM/YYYY");
      } else {
        return "";
      }
    });
    return myDate;
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        <td>{subscription?.Username}</td>
        <td>
          <a href="http://portaldoassinante.com/tegg">
            http://portaldoassinante.com/tegg
          </a>
        </td>
        <td>{getProducts()}</td>
        <td>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {typePass === "password" ? "*********" : subscription?.Password}
            </div>
            <div>
              {typePass === "password" ? (
                <LiaEyeSolid
                  className="eyes"
                  onClick={handleTypePass}
                  // size={25}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <LiaEyeSlash
                  className="eyes"
                  onClick={handleTypePass}
                  // size={25}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
        </td>
        <td>
          {subscription?.PlayHubSubscriptions[0]?.SubscriptionId
            ? "SIM"
            : "NÃO"}
        </td>
        <td>
          <h5 key={subscription?.PlayHubSubscriptions[0]?.Id}>
            {moment(subscription?.PlayHubSubscriptions[0]?.CreatedAt).format(
              "DD/MM/YYYY"
            )}
          </h5>
          <h5 key={subscription?.PlayHubSubscriptions[1]?.Id}>
            {moment(subscription?.PlayHubSubscriptions[1]?.CreatedAt).format(
              "DD/MM/YYYY"
            )}
          </h5>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {getDates()}
              {/* {moment(subscription?.PlayHubSubscriptions[0]?.EndDate).format(
                "DD/MM/YYYY"
              )} */}
            </div>
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
                      setEdit(true);
                      setAnchorEl();
                    }}
                  >
                    Renovar com edição
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setModalContract(true);
                      setAnchorEl();
                    }}
                  >
                    Renovar
                  </MenuItem>
                  <MenuItem
                    disabled={
                      !subscription?.PlayHubSubscriptions[0]?.SubscriptionId
                    }
                    onClick={() => {
                      setShowCancel(true);
                      setAnchorEl();
                    }}
                  >
                    Cancelar recorrência
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setShowCancelPlan(true);
                      setAnchorEl();
                    }}
                  >
                    Cancelar plano
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </td>
      </tr>

      <Dialog open={modalContract} maxWidth="md" fullWidth>
        {/* <DialogTitle>Pagamento</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            <Pgto
              changeModal={changeModalI}
              email={email}
              products={{ standard: qtdStandard, premium: qtdPremium }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalContract(false)}>
            CANCELAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showCancelPlan}
        onClose={() => {
          setShowCancelPlan(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente cancelar o plano? Ao cancelar o plano os produtos
            ainda ainda serão visualizados em seu painel até a data de expiração
            de cada um, sendo:
            <br />
            {getDate("P") !== "" && `Premium: ${getDate("P")}`}
            <br />
            {getDate("Q") !== "" && `Standard: ${getDate("Q")}`}
            <br />
            Essa operação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCancelPlan(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleCancelPlan()}>
            {loadingCancel ? (
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
              "CONTINUAR"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente cancelar a recorrencia? Essa operação não poderá
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCancel(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleCancel()}>
            {loadingCancel ? (
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
              "CONTINUAR"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
