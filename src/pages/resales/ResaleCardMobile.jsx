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
import { documentFormat, translateError, translateStatus } from "../../services/util";
import { IoMdMore } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputPassSignUp } from "../login/Login.styles";
import { toast } from "react-toastify";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { Button } from "../../../globalStyles";

/* eslint-disable react/prop-types */
export const ResaleCardMobile = ({ resale, setLoading, getDealers, setMsg }) => {
  const navigate = useNavigate();
  // const ITEM_HEIGHT = 48;
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

  const action = () => {
    setLoading(true);
    api.user
      .updatePassword(resale.CompanyEmail || resale.Email, password)
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
      .getUserSession(resale?.UserId)
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
    setMsg(`${ resale.Status === "Active" ? "Desativando" : "Ativando"} revenda...`);
    setLoading(true);
    api.dealer
      .blockUnblock(
        resale.Status === "Active" ? "Blocked" : "Active",
        resale.Id
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
            {/* <MoreVertIcon /> */}
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
        <h4
          style={{
            padding: "0.2rem",
            fontWeight: "bold",
            wordWrap: "anywhere",
          }}
        >
          {resale.CompanyName || resale.Name}
        </h4>
        <h5 style={{ wordWrap: "anywhere" }}>
          {resale.Status && translateStatus(resale?.Status)}
        </h5>
        <h5 style={{ wordWrap: "anywhere" }}>
          {resale.Cnpj
            ? documentFormat(resale.Cnpj)
            : documentFormat(resale.Cpf)}
        </h5>
        {resale.CompanyName && (
          <h5 style={{ wordWrap: "anywhere" }}>{resale.Name}</h5>
        )}
        <h5 style={{ wordWrap: "anywhere" }}>{resale?.Mobile}</h5>
        <h5 style={{ wordWrap: "anywhere" }}>
          {resale.CompanyEmail || resale.Email}
        </h5>
        {/* {resale.CompanyEmail != resale.Email && ( */}
        <h5 style={{ wordWrap: "anywhere" }}>
          Acesso ao sistema: {resale.Email || resale.CompanyEmail}
        </h5>
        {/* )} */}
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
          onClick={() =>
            navigate("/salesforce/details", {
              state: { dealer: resale },
            })
          }
        >
          Detalhes
        </MenuItem>
        <MenuItem
          onClick={() =>
            navigate(`/salesforce/edit/${resale.Cnpj ? "pj" : "pf"}`, {
              state: { dealer: resale },
            })
          }
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowModalReset(true);
            handleClose();
          }}
        >
          Senha
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
              {resale.Status === "Active" ? "Desativar" : "Ativar"}
            </MenuItem>
          </>
        )}
      </Menu>

      <Dialog
        open={showModalReset}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">SENHA</DialogTitle>
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
                placeholder="NOVA SENHA"
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
            CANCELAR
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
            RESETAR
            {/* // )} */}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={disableClient}>
        <DialogTitle>
          {resale.Status === "Active" ? "Desativar" : "Ativar"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente{" "}
            {resale.Status === "Active" ? "desativar" : "ativar"} a revenda{" "}
            {resale.Name}?{" "}
            {resale.Status === "Active"
              ? "Se a revenda for desativada, ela não conseguirá mais acessar o sistema."
              : "Se a revenda for ativada, ela voltara a ter acesso ao sistema."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setDisableClient(false)}>
            Cancelar
          </Button>
          <Button notHover onClick={disableAction} autoFocus>
          {resale.Status === "Active" ? "Desativar" : "Ativar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={excludClient}>
        <DialogTitle>Excluir</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente Excluir a revenda {resale.Name}? Com a exclusão da
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
  );
};
