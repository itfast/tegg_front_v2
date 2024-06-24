/* eslint-disable react/prop-types */
import moment from 'moment';
import { useEffect, useState } from 'react';
import { IoMdMore } from 'react-icons/io';

import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Button } from '../../../globalStyles';
import { InputData } from '../orders/clientNew/NewOrder.styles';
import {
  cleanNumber,
  documentFormat,
  phoneFormat,
  translateError,
} from '../../services/util';
import { InputPassSignUp } from '../resetPassword/ResetPassword.styles';
import { LiaEyeSolid, LiaEyeSlash } from 'react-icons/lia';
import Select from 'react-select';
import api from '../../services/api';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
// import { Loading } from "../../components/loading/Loading";

export const StreamingManagementMobile = ({
  setLoading,
  setMsg,
  stream,
  search,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalActiv, setModalActiv] = useState(false);
  const [modalProducts, setModalProducts] = useState(false);
  const [modalDesactiv, setModalDesactiv] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  // const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState('');
  const [repeatPass, setRepeatPass] = useState('');
  const [typePassR, setTypePassR] = useState('password');
  const [typePass, setTypePass] = useState('password');

  const [cpf, setCpf] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState();
  const [phone, setPhone] = useState();
  // const [client, setClient] = useState();

  const [planOpt, setPlanOpt] = useState([]);
  const [planOptDes, setPlanOptDes] = useState([]);
  // const [planOptAct, setPlanOptAct] = useState([]);
  const [planOptAdd, setPlanOptAdd] = useState([]);
  // const [planAdd, setPlanAdd] = useState();
  const [planDes, setPlanDes] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

  const [qtdStandard, setQtdStandard] = useState();
  const [qtdPremium, setQtdPremium] = useState();

  const [planGeneral, setPlanGeneral] = useState();

  // const [plansForUser, setPlansForUser] = useState([]);

  useEffect(() => {
    if (stream) {
      setName(stream.Name);
      setEmail(stream.Email);
      setPassword(stream.Password);
      setRepeatPass(stream.Password);
      setUser(stream.Username);
      setPhone(phoneFormat(stream?.Mobile));
      setCpf(stream?.Document ? documentFormat(stream?.Document) : '');
    }
  }, [stream]);

  const generalProducts = () => {
    api.plans
      .getByBuy('client', null)
      .then((res) => {
        const filtered = res?.data.filter((f) =>
          f.Products.every((p) => p.Product.Technology === 'Streaming')
        );
        if (filtered) {
          const list = [];
          filtered.forEach((f) => {
            f.Products.forEach((p) => {
              if (p.Product.PlayHubId === 'Q') {
                list.push({
                  label: p.Product.Name,
                  value: p.Product.PlayHubId,
                  selected: false,
                });
              }
            });
          });
          filtered.forEach((f) => {
            f.Products.forEach((p) => {
              if (p.Product.PlayHubId === 'P') {
                list.push({
                  label: p.Product.Name,
                  value: p.Product.PlayHubId,
                  selected: false,
                });
              }
            });
          });
          console.log(list);
          setPlanGeneral(list);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    generalProducts();
    api.plans
      .getByBuy('client', null)
      .then((res) => {
        // const filtered = res?.data.filter((f) => f.Name?.includes("TV"));
        const filtered = res?.data.filter((f) =>
          f.Products.every((p) => p.Product.Technology === 'Streaming')
        );
        if (filtered) {
          const list = [];
          filtered.forEach((f) => {
            f.Products.forEach((p) => {
              if (p.Product.Technology === 'Streaming') {
                list.push({
                  label: p.Product.PlayHubId,
                  value: p.Product.PlayHubId,
                });
              }
            });
          });
          setPlanOptAdd(list);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const open = Boolean(anchorEl);

  const handleTypePass = () => {
    setTypePass(typePass === 'password' ? 'text' : 'password');
  };

  const handleTypePassR = () => {
    setTypePassR(typePassR === 'password' ? 'text' : 'password');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const actionProducts = async () => {
    let errors = 0;
    const orig = _.cloneDeep(originalProducts);
    if (planOpt.length > 0) {
      setMsg(t('StreamingManager.table.msgRemove'));
      setLoading(true);
    }

    for (let x = 0; x < planOpt.length; x++) {
      try {
        await api.streaming.removePlan(user, planOpt[x].value);
      } catch (err) {
        errors += 1;
        translateError(err);
      }
    }

    setMsg(t('StreamingManager.table.msgAdd'));
    setLoading(true);
    for (let x = 0; x < allProducts.length; x++) {
      try {
        if (allProducts[x].selected) {
          await api.streaming.addPlan(user, allProducts[x].label);

          orig[x].selected = allProducts[x].selected;
        }
      } catch (err) {
        errors += 1;
        translateError(err);
      }
    }
    if (errors === 0) {
      setModalProducts(false);
      toast.success(t('StreamingManager.table.endProcess'));
    } else {
      setAllProducts(orig);
    }
    setOriginalProducts(orig);
    const filtered = orig.filter((o) => o.selected);
    setPlanOpt(filtered);
    search();
    setLoading(false);
  };

  const actionActiv = async () => {
    console.log(planGeneral);
    if (qtdPremium || qtdStandard) {
      let errors = 0;
      setMsg(t('StreamingManager.table.associatePlanToUser'));
      setLoading(true);
      const qtdP = qtdPremium ? Number(qtdPremium) : 0;
      const qtdS = qtdStandard ? Number(qtdStandard) : 0;
      if (qtdP < 6 && qtdS < 11) {
        if (qtdP > 0) {
          try {
            await api.streaming.addPlan(
              user,
              `P${qtdP === 10 ? qtdP : `0${qtdP}`}`
            );
          } catch (err) {
            errors += 1;
            translateError(err);
          }
        }
        if (qtdS > 0) {
          try {
            await api.streaming.addPlan(
              user,
              `Q${qtdS === 10 ? qtdS : `0${qtdS}`}`
            );
          } catch (err) {
            errors += 1;
            translateError(err);
          }
        }
        if (errors === 0) {
          setModalActiv(false);
          toast.success(t('StreamingManager.table.endProcess'));
        }
        search();
        setLoading(false);
      } else {
        toast.error(t('StreamingManager.table.msgErrorQuantity'));
      }
    } else {
      toast.error(t('StreamingManager.table.msgErrorNotQuantity'));
    }
  };

  const actionDesactiv = async () => {
    let errors = 0;
    setMsg(t('StreamingManager.table.msgErrorNotQuantity'));
    setLoading(true);
    if (planDes) {
      if (planDes.length > 0) {
        setMsg(t('StreamingManager.table.removeProducts'));
        setLoading(true);
      }

      for (let x = 0; x < planDes.length; x++) {
        try {
          await api.streaming.removePlan(user, planDes[x].value);
        } catch (err) {
          errors += 1;
          translateError(err);
        }
      }

      if (errors === 0) {
        setPlanDes();
        setModalDesactiv(false);
        toast.success(t('StreamingManager.table.endProcess'));
      }
      search();
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(t('StreamingManager.table.selectOnePlan'));
    }
  };

  const actionEdit = () => {
    if (user) {
      if (phone) {
        if (password) {
          if (repeatPass) {
            if (password === repeatPass) {
              setMsg(t('StreamingManager.table.msgUpdating'));
              setLoading(true);
              api.streaming
                .updateUser(user, password, name, email, cleanNumber(phone))
                .then(() => {
                  toast.success(t('StreamingManager.table.msgUpdatingSuccess'));
                  setTypePass('password');
                  setTypePassR('password');
                  setModalEdit(false);
                  search();
                })
                .catch((err) => translateError(err))
                .finally(() => setLoading(false));
            } else {
              toast.error(t('StreamingManager.table.passwordNotMatch'));
            }
          } else {
            toast.error(t('StreamingManager.table.repeatPassword'));
          }
        } else {
          toast.error(t('StreamingManager.table.mustPassword'));
        }
      } else {
        toast.error(t('StreamingManager.table.mustPhone'));
      }
    } else {
      toast.error(t('StreamingManager.table.selectUser'));
    }
  };

  const searchUserPlans = (type) => {
    setMsg(t('StreamingManager.table.searchPlansForUser'));
    setLoading(true);
    api.streaming
      .userStreams(stream?.Username)
      .then((res) => {
        console.log(res);
        // setPlansForUser(res.data);
        if (type === 'active') {
          const list = [];
          res.data.forEach((d) => {
            list.push({ label: d.ProductId, value: d.ProductId });
          });
          const listFinal = [];
          const filteredNew = [];
          planOptAdd.forEach((a) => {
            const find = res.data.find((d) => d.ProductId === a.value);
            listFinal.push({
              label: a.label,
              value: a.value,
              selected: find ? true : false,
            });
            if (!find) {
              filteredNew.push({
                label: a.label,
                value: a.value,
                selected: find ? true : false,
              });
            }
          });

          // setAllProducts(listFinal);
          // setOriginalProducts(listFinal);
          // setPlanOpt(list);
          // setPlanOptAct(filteredNew);
          setModalActiv(true);
        } else {
          const list = [];
          res.data.forEach((d) => {
            list.push({ label: d.ProductId, value: d.ProductId });
          });
          console.log(list);
          const listFinal = [];
          const filteredNew = [];
          planOptAdd.forEach((a) => {
            const find = res.data.find((d) => d.ProductId === a.value);
            listFinal.push({
              label: a.label,
              value: a.value,
              selected: find ? true : false,
            });
            if (find) {
              filteredNew.push({
                label: a.label,
                value: a.value,
                selected: find ? true : false,
              });
            }
          });

          setAllProducts(listFinal);
          setOriginalProducts(listFinal);
          setPlanOpt(list);
          setPlanOptDes(list);
          setModalDesactiv(true);
        }

        // setModalProducts(true);
        handleClose();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const setQuantity = (quantity, type) => {
    const value = quantity.replace(/[/().\s-]+/g, "");
    if (type === 'Standard' && (value < 11 && value >= 0)) {
      setQtdStandard(value);
    }
    if (type === 'Premium' && value < 6 && value >= 0) {
      setQtdPremium(value);
    }
  };

  return (
    <>
      <div
        style={{
          width: '90%',
          backgroundColor: '#00D959',
          textAlign: 'center',
          // color: '#3d3d3d',
          padding: '0.5rem',
          margin: 'auto',
          borderRadius: '8px',
          marginTop: '0.2rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            marginTop: '-10px',
            marginBottom: '-10px',
          }}
        >
          {/* <MdSignalWifiStatusbarNotConnected
            style={{ color: 'red' }}
            size={25}
            onClick={() => getStatus(i)}
          /> */}
          <IconButton
            aria-label='more'
            id='long-button'
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleClick}
          >
            <IoMdMore />
          </IconButton>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
          }}
        >
          {/* <Checkbox
            // checked={checkedArray[index]}
            onChange={(e) => {
              handleCheck(e, i);
            }}
          /> */}
        </div>
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {stream?.Name}
        </h4>
        <h5><span style={{fontWeight: 'bold'}}>Login:</span> {stream?.Username}</h5>
        <h5>{stream?.Document ? documentFormat(stream.Document) : ''}</h5>
        {/* <h5> */}
          {stream?.PlayHubSubscriptions?.map((s) => (
            <>
            <h5><span style={{fontWeight: 'bold'}}>Plano: </span>{s.PlayHubId}</h5>
            <h5><span style={{fontWeight: 'bold'}}>Data contratado:</span> {moment(s.CreatedAt).format('DD/MM/YYYY')}</h5>
            <h5><span style={{fontWeight: 'bold'}}>Validade: {moment(s.EndDate).format('DD/MM/YYYY')}</span></h5>
            </>
          ))}
          {stream?.PlayHubSubscriptions?.length === 0 && <h5 style={{fontWeight: 'bold'}}>Sem planos ativos</h5>}
        {/* </h5> */}
        {/* <h4>{translateChipStatus(i.Status)}</h4> */}
      </div>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
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
            searchUserPlans('active');
            // setModalActiv(true);
            // handleClose();
          }}
        >
          {t('StreamingManager.table.buttonActive')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            searchUserPlans('desactive');
          }}
        >
          {t('StreamingManager.table.buttonDisable')}
        </MenuItem>
        {/* <MenuItem
                  onClick={() => {
                    searchUserPlans();
                  }}
                >
                  Produtos
                </MenuItem> */}
        <MenuItem
          onClick={() => {
            setModalEdit(true);
            handleClose();
          }}
        >
          {t('StreamingManager.table.buttonEdit')}
        </MenuItem>
        {/* <MenuItem
                  onClick={() => {setModalEdit(true)}}
                >
                  Excluir
                </MenuItem> */}
      </Menu>
      <Dialog
        open={modalActiv}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('StreamingManager.table.modal.titleActive')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('StreamingManager.table.modal.msgActive')}
            <div style={{ width: '100%' }}>
              <h5>{t('StreamingManager.table.modal.quantityStandard')}</h5>
              <InputData
                type='number'
                value={qtdStandard}
                style={{ width: '100%' }}
                onChange={(e) => setQuantity(e.target.value, 'Standard')}
              />
            </div>
            <div style={{ width: '100%' }}>
              <h5>{t('StreamingManager.table.modal.quantityPremium')}</h5>
              <InputData
                type='number'
                value={qtdPremium}
                style={{ width: '100%' }}
                onChange={(e) => setQuantity(e.target.value, 'Premium')}
              />
            </div>
            {/* </div> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalActiv(false)}>
            {t('StreamingManager.table.modal.buttonCancel')}
          </Button>
          <Button notHover onClick={actionActiv} autoFocus>
            {t('StreamingManager.table.modal.buttonActive')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalProducts}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>PRODUTOS</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deixe selecionado os produtos que deseja vincular ao usuário
            <div style={{ marginTop: 10 }}>
              <FormGroup>
                <div style={{ display: 'flex' }}>
                  {allProducts.map((p, idx) => (
                    <FormControlLabel
                      key={p.value}
                      control={
                        <Checkbox
                          sx={{
                            // color: pink[800],
                            '&.Mui-checked': {
                              color: 'green',
                            },
                          }}
                          checked={p.selected}
                          onChange={(e) => {
                            const orig = _.cloneDeep(allProducts);
                            orig[idx].selected = e.target.checked;
                            setAllProducts(orig);
                          }}
                        />
                      }
                      label={p.label}
                    />
                  ))}
                </div>
              </FormGroup>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalProducts(false)}>
            CANCELAR
          </Button>
          <Button notHover onClick={actionProducts} autoFocus>
            SALVAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalDesactiv}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('StreamingManager.table.modal.titleDisable')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('StreamingManager.table.modal.msgDisable')}
            <div style={{ marginTop: 10 }}>
              <Select
                isMulti
                closeMenuOnSelect={false}
                name='pages'
                id='page-select'
                options={planOptDes}
                style={{ minWidth: '100px' }}
                value={planDes}
                placeholder={t(
                  'StreamingManager.table.modal.selectPlanDisable'
                )}
                onChange={(e) => {
                  setPlanDes(e);
                }}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={'fixed'}
                noOptionsMessage={() =>
                  t('StreamingManager.table.modal.notPlans')
                }
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalDesactiv(false)}>
            {t('StreamingManager.table.modal.buttonCancel')}
          </Button>
          <Button notHover onClick={actionDesactiv} autoFocus>
            {t('StreamingManager.table.modal.buttonDisable')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalEdit}
        fullWidth
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('StreamingManager.table.modal.titleEdit')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div style={{ width: '100%', display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.userInput')}</h5>
                <InputData
                  disabled
                  value={user}
                  style={{ width: '100%' }}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.phoneInput')}</h5>
                <InputData
                  value={phone}
                  style={{ width: '100%' }}
                  onChange={(e) => setPhone(phoneFormat(e.target.value))}
                />
              </div>
            </div>

            <div style={{ width: '100%', display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.passwordInput')}</h5>
                <InputPassSignUp style={{ margin: '0px' }}>
                  <input
                    style={{
                      border: '1px solid #00D959',
                      background: 'transparent',
                      fontSize: '14px',
                    }}
                    type={typePass}
                    placeholder=''
                    value={password}
                    id='password'
                    name='password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password &&
                    (typePass === 'password' ? (
                      <LiaEyeSolid
                        className='eyes'
                        onClick={handleTypePass}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className='eyes'
                        onClick={handleTypePass}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
              </div>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.repeatPassword')}</h5>
                <InputPassSignUp style={{ margin: '0px' }}>
                  <input
                    style={{
                      border: '1px solid #00D959',
                      background: 'transparent',
                      fontSize: '14px',
                    }}
                    type={typePassR}
                    placeholder=''
                    value={repeatPass}
                    id='passwordr'
                    name='password'
                    onChange={(e) => setRepeatPass(e.target.value)}
                  />
                  {repeatPass &&
                    (typePassR === 'password' ? (
                      <LiaEyeSolid
                        className='eyes'
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className='eyes'
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
              </div>
            </div>
            <h5>{t('StreamingManager.nameInput')}</h5>
            <InputData
              value={name}
              style={{ width: '100%' }}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ width: '100%', display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.cpfInput')}</h5>
                <InputData
                  disabled
                  value={cpf}
                  style={{ width: '100%' }}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              <div style={{ width: '100%' }}>
                <h5>{t('StreamingManager.emailInput')}</h5>
                <InputData
                  value={email}
                  style={{ width: '100%' }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalEdit(false)}>
            {t('StreamingManager.table.modal.buttonCancel')}
          </Button>
          <Button notHover onClick={actionEdit} autoFocus>
            {t('StreamingManager.table.modal.buttonSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
