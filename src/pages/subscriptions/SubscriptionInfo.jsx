/* eslint-disable react/prop-types */
import { Button } from '../../../globalStyles';
import { toast } from 'react-toastify';
// import { GiCancel } from 'react-icons/gi';
// import { GrUpdate } from 'react-icons/gr';
// import { GoArrowSwitch } from 'react-icons/go';
// import { MdOutlineEditCalendar } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import api from '../../services/api';
import ReactLoading from 'react-loading';
// import _ from 'lodash';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { translateError } from '../../services/util';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { IoMdMore } from 'react-icons/io';
import { RechargeCard } from '../recharges/RechargeCard';

export const SubscriptionInfo = ({
  subscription,
  getSubscriptions,
  // pageNum,
  // pageSize,
}) => {
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // const [loadingStatus, setLoadingStatus] = useState(false);
  // const [showStatus, setShowStatus] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dueDate, setDueDate] = useState();

  const translateName = (plan) => {
    switch (plan) {
      case '4533':
        return 'Promo';
      case '4534':
        return 'Basic';
      case '4535':
        return 'Start';
      case '4536':
        return 'Gold';
      case '4537':
        return 'Plus';
      case '4511':
        return 'Family';
      case '4512':
        return 'Ultra';
      default:
        return plan;
    }
  };
  const [planOpt, setPlanOpt] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selected, setSelected] = useState();

  const returnPlans = () => {
    // const array = [];
    // for (let i = 0; i < planOptions.length; i++) {
    //   if (planOptions[i].value !== subscription.SurfPlan) {
    //     array.push(planOptions[i]);
    //   }
    // }

    // api.plans
    //   .get()
    //   .then((res) => {
    //     const pArray = res.data.filter(
    //       (plan) =>
    //         plan.Products.length === 1 && plan.Products[0].Product.SurfId
    //     );
    //     pArray.sort((a, b) => {
    //       return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
    //     });
    //     setPlanOpt(pArray);
    //   })
    //   .catch((err) => {
    //     translateError(err);
    //   });
    api.plans
      .getByRecharge()
      .then((res) => {
        res.data.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        const filtered = res.data.filter((p) => !p?.OnlyInFirstRecharge)
        setPlanOpt(filtered);
      })
      .catch((err) => {
        translateError(err);
      });

    // setPlanOpt(array);
    // return array;
  };

  useEffect(() => {
    returnPlans();
  }, []);

  const translateStatus = (str) => {
    let status = '';
    str == 'ACTIVE'
      ? (status = 'Ativa')
      : str == 'EXPIRED'
      ? (status = 'Vencida')
      : str == 'CANCELED'
      ? (status = 'Cancelada')
      : 'Desconhecido';

    return status;
  };

  const findMonth = () => {
    const date = new Date();
    const day = date.getDate();
    let month = date.getMonth() + 1;

    if (day >= subscription.DueDate) {
      month++;
      if (month > 12) {
        month = 1;
      }
    }

    return month.toString().padStart(2, '0');
  };

  const translatePlan = (planType) => {
    let translated = '';
    planType === '4533'
      ? (translated = 'Plano 4GB')
      : planType === '4534'
      ? (translated = 'Basic 7GB')
      : planType === '4535'
      ? (translated = 'Start 13GB')
      : planType === '4536'
      ? (translated = 'Gold 21GB')
      : planType === '4537'
      ? (translated = 'Plus 44GB')
      : planType === '4511'
      ? (translated = 'Family 80GB')
      : planType === '4512'
      ? (translated = 'Ultra 100GB')
      : (translated = 'Desconhecido');

    return translated;
  };

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      return `(${area}) ${number1}-${number2}`;
    }
  };

  // const handleStatus = () => {
  //   setShowStatus(false);
  //   setLoadingStatus(true);
  //   api.iccid
  //     .updateSubscriptionStatus(subscription.Id)
  //     .then((res) => {
  //       toast.success(res.data.Message);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       translateError(err);
  //     })
  //     .finally(() => {
  //       setLoadingStatus(false);
  //       getSubscriptions(pageNum, pageSize);
  //     });
  // };

  const handleEdit = () => {
    setLoadingEdit(true);
    api.iccid
      .updateSubscription(
        subscription.Id,
        dueDate?.value,
        selected?.value?.Amount,
        selected?.value?.Products[0]?.Product?.SurfId
      )
      .then((res) => {
        toast.success(res?.data?.Message);
        setShowEdit(false);
        // reload()
        getSubscriptions();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingEdit(false);
      });
  };

  const handleCancel = () => {
    setLoadingCancel(true);
    api.iccid
      .cancelSubscription(subscription.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setShowCancel(false);
        getSubscriptions();
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

  const returnDays = () => {
    const date = new Date();
    const day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day > subscription.DueDate) {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    const array = [];
    const date2 = new Date(year, month, 0);
    for (let i = 1; i <= date2.getDate(); i++) {
      array.push({
        label: i,
        value: i.toString(),
      });
    }
    return array;
  };

  const handleClick = (event) => {
    console.log(subscription?.SurfPlan);
    console.log(planOpt);
    setDueDate({ label: subscription?.DueDate, value: subscription?.DueDate });
    const find = planOpt.find(
      (p) => p?.Products[0]?.Product?.SurfId === subscription?.SurfPlan
    );
    // planOpt.forEach((p) => console.log(p.value));
    console.log(find);
    if (find) {
      setSelected({ label: translateName(subscription.SurfPlan), value: find });
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        {/* <td></td> */}
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && (
          <td>{subscription.FinalClient.Name}</td>
        )}
        <td>{translateStatus(subscription.Status)}</td>
        <td>{formatPhone(subscription.Iccid?.IccidHistoric[0]?.SurfMsisdn)}</td>
        <td>{translatePlan(subscription.SurfPlan)}</td>
        <td>
          {subscription.Status !== 'CANCELED' ? (
            `${subscription.DueDate.toString().padStart(2, '0')}/${findMonth()}`
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </td>
        <td>
          <div>
            <IconButton
              aria-label='more'
              id='long-button'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleClick}
            >
              {/* <MoreVertIcon /> */}
              <IoMdMore />
            </IconButton>
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
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setShowEdit(true);
                  handleClose();
                }}
              >
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setShowCancel(true);
                  handleClose();
                }}
              >
                Cancelar
              </MenuItem>
            </Menu>
          </div>
        </td>
        {/* <td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{!loadingStatus ? (
								subscription.Status !== "CANCELED" ? (
									<GrUpdate
										style={{ cursor: "pointer" }}
										size={20}
										onClick={() => {
											setShowStatus(true);
										}}
									/>
								) : (
									"-"
								)
							) : (
								<div className="loading">
									<ReactLoading type={"bars"} color={"#000"} />
								</div>
							)}
						</div>
					</td> */}
        {/* <td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{!loadingPlan ? (
								subscription.Status !== "CANCELED" ? (
									<GoArrowSwitch
										style={{ cursor: "pointer" }}
										size={20}
										onClick={() => {
											setPlan({});
											setShowPlan(true);
										}}
									/>
								) : (
									"-"
								)
							) : (
								<div className="loading">
									<ReactLoading type={"bars"} color={"#000"} />
								</div>
							)}
						</div>
					</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{!loadingDate ? (
								subscription.Status !== "CANCELED" ? (
									<MdOutlineEditCalendar
										style={{ cursor: "pointer" }}
										size={20}
										onClick={() => {
											setDate({});
											setShowDate(true);
										}}
									/>
								) : (
									"-"
								)
							) : (
								<div className="loading">
									<ReactLoading type={"bars"} color={"#000"} />
								</div>
							)}
						</div>
					</td>
					<td>
						<div style={{ display: "flex", justifyContent: "center" }}>
							{!loadingCancel ? (
								subscription.Status !== "CANCELED" ? (
									<GiCancel
										style={{ cursor: "pointer" }}
										size={20}
										onClick={() => {
											setShowCancel(true);
										}}
									/>
								) : (
									"-"
								)
							) : (
								<div className="loading">
									<ReactLoading type={"bars"} color={"#000"} />
								</div>
							)}
						</div>
					</td> */}
      </tr>
      {/* </tbody> */}
      {/* <Dialog
        open={showStatus}
        onClose={() => {
          setShowStatus(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Checar status da assinatura
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Ao clicar em continuar o status da assinatura será checado e
            atualizado. Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowStatus(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleStatus()}>CONTINUAR</Button>
        </DialogActions>
      </Dialog> */}
      {/* novo editar */}
      <Dialog
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>EDITAR ASSINATURA</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {/* <div className='input_row_2'> */}
            <div className='input'>
              <label>DIA DO VENCIMENTO</label>
              <Select
                isSearchable={false}
                options={returnDays()}
                placeholder='Dia *'
                // menuPortalTarget={document.body}
                menuPosition='fixed'
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
            {/* </div> */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  marginTop: 40,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  gap: 10,
                }}
              >
                {planOpt?.map((p) => (
                  <RechargeCard
                    key={p.Id}
                    disabled
                    plan={p}
                    name={p?.Name}
                    size={p?.Size}
                    internet={p?.Internet}
                    extra={p?.Extra}
                    extraPortIn={p?.ExtraPortIn}
                    free={p?.Free?.split(' ')}
                    price={p?.Amount}
                    comments={p?.Comments}
                    selected={selected?.label === p?.Name}
                    onClick={() => setSelected({ label: p?.Name, value: p })}
                  />
                ))}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowEdit(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleEdit()}>
            {loadingEdit ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#00D959'} />
              </div>
            ) : (
              'ATUALIZAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* fim novo editar */}
      {/* <Dialog
        open={showPlan}
        onClose={() => {
          setShowPlan(false);
          setPlan({});
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Trocar plano da linha</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              Selecione um novo plano abaixo. O plano de sua linha será trocado
              na data de vencimento da próxima fatura da assinatura. Essa ação
              não pode ser desfeita.
            </p>
            <br />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Select
                isSearchable={false}
                options={returnPlans()}
                placeholder='Plano'
                // menuPortalTarget={document.body}
                menuPosition='fixed'
                onChange={(e) => {
                  setPlan(e);
                }}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowPlan(false);
              setPlan({});
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              if (Object.keys(plan).length === 0) {
                toast.error('Escolha um plano novo.');
              } else {
                handlePlan();
              }
            }}
          >
            CONTINUAR
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* <Dialog
        open={showDate}
        onClose={() => {
          setShowDate(false);
          setDate({});
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Trocar dia do vencimento da fatura
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              Selecione abaixo um novo dia para o vencimento da fatura. Caso a
              fatura desse mês já tenha vencido/sido paga a nova data será
              aplicada na fatura seguinte. Essa ação não pode ser desfeita.
            </p>
            <br />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Select
                isSearchable={false}
                options={returnDays()}
                placeholder='Dia'
                // menuPortalTarget={document.body}
                menuPosition='fixed'
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowDate(false);
              setDate({});
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              if (Object.keys(date).length === 0) {
                toast.error('Escolha um novo dia.');
              } else {
                handleDate();
              }
            }}
          >
            CONTINUAR
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo cancelar a assinatura? Essa operação não poderá ser
            desfeita.
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo cancelar a assinatura? Essa operação não poderá ser
            desfeita.
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
          <Button onClick={() => handleCancel()}>CONTINUAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
