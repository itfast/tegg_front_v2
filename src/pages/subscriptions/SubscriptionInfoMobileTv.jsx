/* eslint-disable react/prop-types */
import moment from "moment";
import { translateError } from "../../services/util";
import { Button, CardInfo } from "../../../globalStyles";
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
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { LiaEyeSlash, LiaEyeSolid } from "react-icons/lia";
import { IoMdMore } from "react-icons/io";
import { Pgto } from "../streaming/Pgto";

export const SubscriptionInfoMobileTv = ({
  n,
  reload,
  setEdit,
  changeModal,
}) => {
  const [showCancel, setShowCancel] = useState(false);
  const [showCancelPlan, setShowCancelPlan] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [typePass, setTypePass] = useState("password");
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalContract, setModalContract] = useState(false);
  const [email, setEmail] = useState();
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

  let qtdStandard = 0;
  let qtdPremium = 0;

  const handleCancel = () => {
    setLoadingCancel(true);
    console.log(n);
    api.iccid
      .cancelSubscription(n?.PlayHubSubscriptions[0]?.SubscriptionId)
      .then((res) => {
        toast.success(res.data.Message);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingCancel(false);
        reload();
      });
  };

  const handleCancelPlan = () => {
    setLoadingCancel(true);
    if (n?.PlayHubSubscriptions[0]?.SubscriptionId) {
      api.iccid
        .cancelSubscription(n?.PlayHubSubscriptions[0]?.SubscriptionId)
        .then(() => {
          toast.success("Plano cancelado com sucesso");
          setShowCancelPlan(false);
          changeModal();
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingCancel(false);
          reload();
        });
    } else {
      setShowCancelPlan(false);
      toast.success("Plano cancelado com sucesso");
      setLoadingCancel(false);
    }
  };

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const getProducts = () => {
    let premium = 0;
    let standard = 0;

    n?.PlayHubSubscriptions?.forEach((p) => {
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

    n?.PlayHubSubscriptions?.forEach((p) => {
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
    n?.PlayHubSubscriptions?.forEach((p) => {
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
      <CardInfo style={{ padding: "1rem", color: "#3d3d3d" }}>
        <div
          style={{
            position: "absolute",
            top: "0px",
            right: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              disabled={!n?.PlayHubSubscriptions[0]?.SubscriptionId}
              onClick={() => {
                setShowCancel(true);
                setAnchorEl();
              }}
            >
              Cancelar recorrência
            </MenuItem>
            <MenuItem
              // disabled={!n?.PlayHubSubscriptions[0]?.SubscriptionId}
              onClick={() => {
                setShowCancelPlan(true);
                setAnchorEl();
              }}
            >
              Cancelar plano
            </MenuItem>
          </Menu>
        </div>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "yellow",
          }}
        ></div>
        <h4>{typePass === "password" ? "*********" : n?.Password}</h4>
        <a href="http://portaldoassinante.com/tegg">
          http://portaldoassinante.com/tegg
        </a>
        <h3 style={{ overflow: "hidden" }}>{n?.Username}</h3>
        {getProducts()}
        <h4>
          Pagamento recorrente:{" "}
          {n?.PlayHubSubscriptions[0]?.SubscriptionId ? "SIM" : "NÃO"}
        </h4>
        <h4>Expira em</h4>
        <h5>{getDates()}</h5>
      </CardInfo>

      <Dialog open={modalContract} maxWidth="md" fullWidth>
        <DialogContent>
          <DialogContentText>
            <Pgto
              changeModal={() => {
                setModalContract(false);
                changeModal();
              }}
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
          <Button notHover onClick={() => handleCancelPlan()}>
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
          <Button notHover onClick={() => handleCancel()}>
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
