import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import {
  PageLayout,
  Button,
  ContainerWeb,
  ContainerMobile,
} from '../../../globalStyles';
import api from '../../services/api';
import {
  cepFormat,
  cnpjStringFormat,
  translateError,
  getCEP,
  UFS,
} from '../../services/util';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
  CardData,
  MultiLineInputData,
  SelectUfs,
} from '../resales/Resales.styles';
import { AiFillEdit } from 'react-icons/ai';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import axios from 'axios';
import { InputData } from '../resales/Resales.styles';
// import { Extract } from '../../components/Extract/Extract';
import { InfoSettings } from '../../components/InfoSettings/InfoSettings';
import { InfoSettingsAssas } from '../../components/InfoSettingsAssas/InfoSettingsAssas';
import { InfoSettingsSpeedFlow } from '../../components/InfoSettingsSpeedFlow/InfoSettingsSpeedFlow';
import { InputPassSignUp } from '../login/Login.styles';
import { LiaEyeSolid, LiaEyeSlash } from 'react-icons/lia';
import { PerfilSettings } from '../../components/perfilSettings/PerfilSettings';
import { PerfilSettingsDealer } from '../../components/perfilSettings/PerfilSettingsDealer';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#fb6802',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 0,
  },
}));

export const Profile = () => {
  const [nfeInfo, setNfeInfo] = useState({});
  const [settingsInfo, setSettingsInfo] = useState({});
  const [tmpSeep, setTmpSeep] = useState({});
  const [tmpAssas, setTmpAssas] = useState({});

  const [nfeLoading, setNfeLoading] = useState(true);

  const [showNumberInfo, setShowNumberInfo] = useState(false);
  const [numberLoading, setNumberLoading] = useState(false);
  const [nfeGroup, setNfeGroup] = useState('');
  const [nfeNumber, setNfeNumber] = useState('');

  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [showAssasInfo, setShowAssasInfo] = useState(false);
  const [showSpeedInfo, setShowSpeedInfo] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [ie, setIe] = useState('');
  const [im, setIm] = useState('');
  const [cnae, setCnae] = useState('');
  const [crt, setCrt] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [UF, setUF] = useState('');
  const [UFCode, setUFCode] = useState('');
  const [partnerKey, setPartnerKey] = useState('');
  const [commKey, setCommKey] = useState('');

  // const [ufs, setUfs] = useState([]);

  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loadingEditEmail, setLoadingEditEmail] = useState(false);
  const [loadingEditPass, setLoadingEditPass] = useState(false);
  const [assasLoading, setAssasLoading] = useState(false);
  const [speedLoading, setSpeedLoading] = useState(false);
  const [typePass, setTypePass] = useState('password');
  const [typePassConfirm, setTypePassConfirm] = useState('password');
  const [data, setData] = useState({});
  const [dataDealer, setDataDealer] = useState({});
  const [profile, setProfile] = useState(
    api.currentUser.Type === 'CLIENT' ? 'CLIENT' : 'AGENT'
  );

  // const [orders, setOrders] = useState([]);
  // const [loadingOrders, setLoadingOrders] = useState(true);

  const handleTypePass = () => {
    setTypePass(typePass === 'password' ? 'text' : 'password');
  };

  const handleTypePassConfirm = () => {
    setTypePassConfirm(typePassConfirm === 'password' ? 'text' : 'password');
  };

  const translateType = (str) => {
    let type = '';
    str === 'TEGG'
      ? (type = 'Tegg')
      : str === 'DEALER'
      ? (type = 'Revenda')
      : str === 'AGENT'
      ? (type = 'Representante')
      : (type = 'Cliente');
    return type;
  };

  // const getOrders = () => {
  //   api.order
  //     .getAll(1, 20)
  //     .then((res) => {
  //       // console.log(res.data.orders);
  //       setOrders(res.data.orders);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       translateError(err);
  //     })
  //     .finally(() => {
  //       setLoadingOrders(false);
  //     });
  // };

  const getNFeInfo = () => {
    setNfeLoading(true);
    api.nfe
      .getNFeInfo()
      .then((res) => {
        // console.log(res.data);
        setNfeInfo(res.data);
        setName(res.data.Name);
        setCnpj(cnpjStringFormat(res.data.CNPJ));
        setIe(res.data.IE);
        setIm(res.data.IM);
        setCnae(res.data.CNAE);
        setCrt(res.data.CRT);
        setCep(cepFormat(res.data.CEP));
        setAddress(res.data.Address);
        setAddressNumber(res.data.AddressNumber);
        setDistrict(res.data.District);
        setCity(res.data.City);
        setCityCode(res.data.CityCode);
        setUF(res.data.UF);
        setUFCode(res.data.UFCode);
        setPartnerKey(res.data.PartnerKeyMigrate);
        setCommKey(res.data.CommunicationKeyMigrate);
        setNfeGroup(res.data.NFeGroup);
        setNfeNumber(res.data.NFeNumber);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => {
        setNfeLoading(false);
      });
  };

  const getSettings = () => {
    api.settings
      .get()
      .then((res) => {
        let list = {};
        res.data.forEach((s) => {
          list[s.SettingKey] = s.SettingValue;
        });
        setSettingsInfo(list);
        console.log(res);
      })
      .catch((err) => {
        translateError(err);
      });
  };

  const handleNumberInfo = () => {
    if (nfeGroup === '' || nfeNumber === '') {
      toast.error('Ambas informações são necessárias');
    } else {
      setNumberLoading(true);
      api.nfe
        .updateNFeInfo(nfeGroup, Number(nfeNumber))
        .then((res) => {
          getNFeInfo();
          toast.success(res.data.Message);
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setNumberLoading(false);
          setShowNumberInfo(false);
          setNfeGroup('');
          setNfeNumber('');
        });
    }
  };

  const handleUFChange = (string) => {
    const uf = UFS.filter((u) => u.value === string);
    setUF(uf[0].value);
    setUFCode(uf[0].code);
  };

  const handleCompanyInfo = () => {
    if (
      name === '' &&
      cnpj === '' &&
      ie === '' &&
      im === '' &&
      cnae === '' &&
      crt === '' &&
      cep === '' &&
      address === '' &&
      addressNumber === '' &&
      district === '' &&
      city === '' &&
      cityCode === '' &&
      UF === '' &&
      UFCode === '' &&
      partnerKey === '' &&
      commKey === ''
    ) {
      toast.error('Altere ao menos uma informação para continuar');
    } else if (cnpj !== '' && cnpj.replace(/\D+/g, '').length !== 14) {
      toast.error('Insira um CNPJ válido');
    } else if (cep !== '' && cep.replace(/\D+/g, '').length !== 8) {
      toast.error('Insira um CEP válido');
    } else {
      setCompanyLoading(true);
      api.nfe
        .updateNFeCompanyInfo(
          name,
          cnpj.replace(/\D+/g, ''),
          ie,
          im,
          cnae,
          Number(crt),
          Number(cep.replace(/\D+/g, '')),
          address,
          addressNumber,
          district,
          city,
          Number(cityCode),
          UF,
          Number(UFCode),
          partnerKey,
          commKey,
          nfeGroup,
          nfeNumber
        )
        .then((res) => {
          getNFeInfo();
          toast.success(res.data.Message);
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setCompanyLoading(false);
          setShowCompanyInfo(false);
        });
    }
  };

  const handleCep = async (e) => {
    setCep(cepFormat(e.target.value));

    if (e.target.value.length === 0) {
      setDistrict('');
      setCity('');
      setCityCode('');
      setAddress('');
    } else {
      const res = await getCEP(e);
      if (res) {
        setDistrict(res.bairro);
        setCity(res.localidade);
        setCityCode(res.ibge);
        setAddress(res.logradouro);
      }
    }
  };

  const handleChangeEmail = () => {
    if (newEmail !== '') {
      if (confirmNewEmail !== '') {
        if (newEmail === confirmNewEmail) {
          setLoadingEditEmail(true);
          api.user
            .updateEmail(api.currentUser.Email, newEmail)
            .then((res) => {
              toast.success(res.data.Message);
            })
            .catch((err) => {
              console.log(err);
              toast.error('Não foi possível atualizar o e-mail');
            })
            .finally(() => {
              setLoadingEditEmail(false);
              setShowEditEmail(false);
              setNewEmail('');
              setConfirmNewEmail('');
            });
        } else {
          toast.error('Os e-mails devem ser iguais');
        }
      } else {
        toast.error('Confirme o novo e-mail');
      }
    } else {
      toast.error('Insira um novo e-mail');
    }
  };

  const handleChangePass = () => {
    if (newPass !== '') {
      if (confirmNewPass !== '') {
        if (newPass === confirmNewPass) {
          setLoadingEditPass(true);
          api.user
            .updatePassword(api.currentUser.Email, newPass)
            .then((res) => {
              toast.success(res.data.Message);
              setShowEditPassword(false);
            })
            .catch((err) => {
              translateError(err);
            })
            .finally(() => {
              setLoadingEditPass(false);
              setNewPass('');
              setConfirmNewPass('');
            });
        } else {
          toast.error('As duas senhas devem ser iguais');
        }
      } else {
        toast.error('Confirme a nova senha');
      }
    } else {
      toast.error('Insira uma nova senha');
    }
  };

  const handleChangeProfile = () => {
    setLoadingEditPass(true);
    api.user
      .updateProfile(api.currentUser.UserId, profile)
      .then(async(res) => {
        toast.success(`${res.data.Message}. A página será recarregada para aplicar o novo perfil.`);
        // toast.success('A página será recarregada para aplicar o novo perfil')
        setLoadingEditPass(false);
        setShowEditProfile(false);
        await new Promise(r => setTimeout(r, 4000));
        
        window.location.reload();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingEditPass(false);
      });
  };

  // const getUFs = async () => {
  //   const res = await axios.get(
  //     `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
  //   );
  //   if (res.status === 200) {
  //     const array = [];
  //     res.data.forEach((uf) => {
  //       array.push({
  //         label: uf.sigla,
  //         value: uf.id,
  //       });
  //     });
  //     setUfs(array);
  //   }
  // };

  const getMyData = async () => {
    if (api.currentUser?.Type === 'DEALER') {
      api.dealer
        .getById(api.currentUser?.DealerId)
        .then((res) => {
          setDataDealer(res.data);
        })
        .catch((err) => translateError(err));
    } else {
      api.client
        .getById(api.currentUser.MyFinalClientId)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => translateError(err));
    }
  };

  useEffect(() => {
    // getOrders();
    if (api.currentUser.AccessTypes[0] !== 'TEGG') {
      getMyData();
    }
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      getNFeInfo();
      getSettings();
      // getUFs();
    }
  }, []);

  const handleAssasInfo = async () => {
    const keys = Object.keys(tmpAssas);
    let musSearch = false;
    setAssasLoading(true);

    for (let i = 0; i < keys.length; i++) {
      let myKey = keys[i];
      if (tmpAssas[myKey] !== settingsInfo[myKey]) {
        musSearch = true;
        try {
          const res = await api.settings.update(myKey, tmpAssas[myKey]);
          toast.success(`${myKey} ${res.data.Message}`);
        } catch (err) {
          translateError(err);
        }
      }
    }
    if (musSearch) {
      getSettings();
    }
    setShowAssasInfo(false);
    setAssasLoading(false);
  };

  const handleSpeedInfo = async () => {
    const keys = Object.keys(tmpSeep);
    let musSearch = false;
    setSpeedLoading(true);

    for (let i = 0; i < keys.length; i++) {
      let myKey = keys[i];
      if (tmpSeep[myKey] !== settingsInfo[myKey]) {
        musSearch = true;
        try {
          const res = await api.settings.update(myKey, tmpSeep[myKey]);
          toast.success(`${myKey} ${res.data.Message}`);
        } catch (err) {
          translateError(err);
        }
      }
    }
    if (musSearch) {
      getSettings();
    }
    setShowSpeedInfo(false);
    setSpeedLoading(false);
  };

  const handleEditAssas = () => {
    setTmpAssas({
      WALLET_ID_ASSAS: settingsInfo.WALLET_ID_ASSAS,
      URL_ASSAS: settingsInfo.URL_ASSAS,
      API_KEY_ASSAS: settingsInfo.API_KEY_ASSAS,
    });
    setShowAssasInfo(true);
  };

  const handleEditSpeed = () => {
    setTmpSeep({
      PWD_FTP_SPEEDFLOW: settingsInfo.PWD_FTP_SPEEDFLOW,
      URL_FTP_SPEEDFLOW: settingsInfo.URL_FTP_SPEEDFLOW,
      USR_FTP_SPEEDFLOW: settingsInfo.USR_FTP_SPEEDFLOW,
      API_KEY_SPEEDFLOW: settingsInfo.API_KEY_SPEEDFLOW,
    });
    setShowSpeedInfo(true);
  };

  // const teste = 'www.hotmaillasçfdjalksjdklasjdkljasdkasjlkj.com.br_#@meiaduzia.com.br'

  return (
    <>
      <PageLayout>
        <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
          <div
            style={{
              display: screen.width > 767 && 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* <div style={{ width: screen.width < 767 ? '100%' : '35%' }} /> */}
            <h2
              style={{
                color: '#7c7c7c',
                textAlign: 'center',
                // width: screen.width < 767 ? '100%' : '35%',
                wordWrap: 'anywhere',
              }}
            >
              {api.currentUser.Name}
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                width: screen.width < 767 ? '100%' : '35%',
                justifyContent: 'end',
                gap: 10,
              }}
            >
              <Button
                style={{ width: screen.width < 767 && '100%' }}
                onClick={() => setShowEditPassword(true)}
              >
                Atualizar senha
              </Button>
              {(api.currentUser.Type === 'CLIENT' ||
                api.currentUser.Type === 'AGENT') && (
                <Button
                  style={{ width: screen.width < 767 && '100%' }}
                  onClick={() => setShowEditProfile(true)}
                >
                  Mudar perfil
                </Button>
              )}
            </div>
          </div>
          <ContainerWeb>
            <Table style={{ marginTop: 25 }}>
              <TableBody>
                <TableRow>
                  <StyledTableCell>E-mail:</StyledTableCell>
                  <StyledTableCell align='right'>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'end' }}>
                        {api.currentUser.Email}
                      </div>
                    </div>
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>Perfil do Cadastro:</StyledTableCell>
                  <StyledTableCell align='right'>
                    {translateType(api.currentUser.Type)}
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ContainerWeb>
          <ContainerMobile style={{ height: '100%', width: '100%' }}>
            <div style={{ marginTop: 25, marginBottom: -25 }}>
              <h5>E-mail</h5>
              <h5 style={{ wordWrap: 'anywhere' }}>{api.currentUser.Email}</h5>
              <br />
              <h5>Perfil do Cadastro</h5>
              <h5>{translateType(api.currentUser.Type)}</h5>
            </div>
          </ContainerMobile>
          <br />
          <br />
          <br />
          <br />
          {nfeLoading
            ? api.currentUser.AccessTypes[0] === 'TEGG' && (
                <div className='loading'>
                  <ReactLoading type={'bars'} color={'#000'} />
                </div>
              )
            : api.currentUser.AccessTypes[0] === 'TEGG' && (
                <>
                  <div
                    style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                  >
                    {/* <h2>Informações da empresa</h2> */}
                    <h2>Configurações da NF-e</h2>
                    <AiFillEdit
                      size={20}
                      color='green'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setShowCompanyInfo(true);
                      }}
                    />
                  </div>
                  <InfoSettings nfeInfo={nfeInfo} />

                  <br />
                  <div
                    style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                  >
                    <h2>Configurações da ASSAS</h2>
                    <AiFillEdit
                      size={20}
                      color='green'
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditAssas}
                    />
                  </div>
                  <InfoSettingsAssas
                    assas={{
                      WALLET_ID_ASSAS: settingsInfo.WALLET_ID_ASSAS,
                      API_KEY_ASSAS: settingsInfo.API_KEY_ASSAS,
                      URL_ASSAS: settingsInfo.URL_ASSAS,
                    }}
                  />
                  <br />
                  <div
                    style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                  >
                    {/* <h2>Informações da empresa</h2> */}
                    <h2>Configurações da SpeedFlow</h2>
                    <AiFillEdit
                      size={20}
                      color='green'
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditSpeed}
                    />
                  </div>
                  <InfoSettingsSpeedFlow
                    speed={{
                      PWD_FTP_SPEEDFLOW: settingsInfo.PWD_FTP_SPEEDFLOW,
                      USR_FTP_SPEEDFLOW: settingsInfo.USR_FTP_SPEEDFLOW,
                      URL_FTP_SPEEDFLOW: settingsInfo.URL_FTP_SPEEDFLOW,
                      API_KEY_SPEEDFLOW: settingsInfo.API_KEY_SPEEDFLOW,
                    }}
                  />
                  <br />
                </>
              )}
          {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
            api.currentUser.AccessTypes[0] === 'AGENT') && (
            <>
              <PerfilSettings data={data} search={getMyData} />
              <br />
              <br />
              <br />
            </>
          )}

          {api.currentUser.AccessTypes[0] === 'DEALER' && (
            <>
              <PerfilSettingsDealer data={dataDealer} search={getMyData} />
              <br />
              <br />
              <br />
            </>
          )}
        </CardData>
        {/* <Extract orders={orders} loadingOrders={loadingOrders} /> */}
      </PageLayout>

      <Dialog
        open={showNumberInfo}
        onClose={() => {
          setShowNumberInfo(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Alterar informações de NF-e
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Série
              </label>
              <InputData
                type='number'
                placeholder='Série*'
                className='input'
                value={nfeGroup}
                onChange={(e) => {
                  setNfeGroup(e.target.value);
                }}
              />
            </div>
            <br />
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Número inicial da série
              </label>
              <InputData
                type='number'
                placeholder='Número inicial*'
                className='input'
                value={nfeNumber}
                onChange={(e) => setNfeNumber(e.target.value)}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowNumberInfo(false);
              setNfeGroup(nfeInfo.NFeGroup);
              setNfeNumber(nfeInfo.NFeNumber);
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleNumberInfo();
            }}
          >
            {numberLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showCompanyInfo}
        onClose={() => {
          setShowCompanyInfo(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>NFe</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <h5 className='bold'>Nome</h5>
              <InputData
                placeholder='Nome'
                className='input'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input'>
                <h5 className='bold'>CNPJ</h5>
                <InputData
                  placeholder='CNPJ'
                  className='input'
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>IE</h5>
                <InputData
                  type='number'
                  placeholder='IE'
                  className='input'
                  value={ie}
                  onChange={(e) => setIe(e.target.value)}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>IM</h5>
                <InputData
                  type='number'
                  placeholder='IM'
                  className='input'
                  value={im}
                  onChange={(e) => setIm(e.target.value)}
                />
              </div>
            </div>
            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input'>
                <h5 className='bold'>CNAE</h5>
                <InputData
                  type='number'
                  placeholder='CNAE'
                  className='input'
                  value={cnae}
                  onChange={(e) => setCnae(e.target.value)}
                />
              </div>
              {/* <br /> */}
              <div className='input'>
                <h5 className='bold'>CRT</h5>
                <InputData
                  type='number'
                  placeholder='CRT'
                  className='input'
                  value={crt}
                  onChange={(e) => setCrt(e.target.value)}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>Série NF</h5>
                <InputData
                  type='number'
                  placeholder='Série*'
                  className='input'
                  value={nfeGroup}
                  onChange={(e) => {
                    setNfeGroup(e.target.value);
                  }}
                />
              </div>
              {/* <br /> */}
              <div className='input'>
                <h5 className='bold'>Número NF</h5>
                <InputData
                  type='number'
                  placeholder='Número inicial*'
                  className='input'
                  value={nfeNumber}
                  onChange={(e) => setNfeNumber(e.target.value)}
                />
              </div>
            </div>
            <div className='input'>
              <h5 className='bold'>Partner Key</h5>
              <InputData
                placeholder='Partner Key'
                className='input'
                value={partnerKey}
                onChange={(e) => setPartnerKey(e.target.value)}
              />
            </div>
            <div className='input'>
              <h5 className='bold'>Communication Key</h5>
              <InputData
                placeholder='Communication Key'
                className='input'
                value={commKey}
                onChange={(e) => setCommKey(e.target.value)}
              />
            </div>
            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input' style={{ width: '85%' }}>
                <h5 className='bold'>Endereço</h5>
                <InputData
                  disabled={true}
                  placeholder='Endereço'
                  className='input'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className='input' style={{ width: '15%' }}>
                <h5 className='bold'>Número</h5>
                <InputData
                  type='number'
                  placeholder='Número'
                  className='input'
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                />
              </div>
            </div>
            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input'>
                <h5 className='bold'>Bairro</h5>
                <InputData
                  disabled={true}
                  placeholder='Bairro'
                  className='input'
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>Cidade</h5>
                <InputData
                  disabled={true}
                  placeholder='Cidade'
                  className='input'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input'>
                <h5 className='bold'>CEP</h5>
                <InputData
                  placeholder='CEP'
                  className='input'
                  value={cep}
                  onChange={(e) => handleCep(e)}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>Estado</h5>
                <SelectUfs
                  placeholder='Estado'
                  menuPosition='fixed'
                  className='input'
                  value={UF}
                  onChange={(e) => {
                    handleUFChange(e.target.value);
                  }}
                >
                  {UFS.map((m) => (
                    <option key={m.value} code={m.code} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </SelectUfs>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCompanyInfo(false);
              setName(nfeInfo.Name);
              setCnpj(cnpjStringFormat(nfeInfo.CNPJ));
              setIe(nfeInfo.IE);
              setIm(nfeInfo.IM);
              setCnae(nfeInfo.CNAE);
              setCrt(nfeInfo.CRT);
              setCep(cepFormat(nfeInfo.CEP));
              setAddress(nfeInfo.Address);
              setAddressNumber(nfeInfo.AddressNumber);
              setDistrict(nfeInfo.District);
              setCity(nfeInfo.City);
              setCityCode(nfeInfo.CityCode);
              setUF(nfeInfo.UF);
              setUFCode(nfeInfo.UFCode);
              setPartnerKey(nfeInfo.PartnerKeyMigrate);
              setCommKey(nfeInfo.CommunicationKeyMigrate);
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleCompanyInfo();
            }}
          >
            {companyLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'SALVAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* ASSAS */}
      <Dialog
        open={showAssasInfo}
        onClose={() => {
          setShowAssasInfo(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>ASSAS</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input' style={{ width: '100%' }}>
              <h5 className='bold'>URL</h5>
              <InputData
                placeholder='URL'
                className='input'
                value={tmpAssas.URL_ASSAS}
                onChange={(e) => {
                  setTmpAssas({
                    ...tmpAssas,
                    URL_ASSAS: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <h5 className='bold'>KEY</h5>
              {/* <InputData
                placeholder='Nome'
                className='input'
                value={settingsInfo.API_KEY_ASSAS}
                onChange={(e) => {
                  setSettingsInfo({...settingsInfo, API_KEY_ASSAS: e.target.value});
                }}
              /> */}
              <MultiLineInputData
                placeholder='API KEY'
                rows={5}
                className='input'
                value={tmpAssas.API_KEY_ASSAS}
                onChange={(e) => {
                  setTmpAssas({
                    ...tmpAssas,
                    API_KEY_ASSAS: e.target.value,
                  });
                }}
              />
            </div>
            <div className='input'>
              <h5 className='bold'>WALLET ID</h5>
              <InputData
                placeholder='WALLET ID ASSAS'
                className='input'
                value={tmpAssas.WALLET_ID_ASSAS}
                onChange={(e) => {
                  setTmpAssas({
                    ...tmpAssas,
                    WALLET_ID_ASSAS: e.target.value,
                  });
                }}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setTmpAssas({});
              setShowAssasInfo(false);
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleAssasInfo();
            }}
          >
            {assasLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'SALVAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* SPEED */}
      <Dialog
        open={showSpeedInfo}
        onClose={() => {
          setShowSpeedInfo(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>SPEED-FLOW</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <h5 className='bold'>API KEY</h5>
              <MultiLineInputData
                rows={9}
                placeholder='API KEY'
                className='input'
                value={tmpSeep.API_KEY_SPEEDFLOW}
                onChange={(e) => {
                  setTmpSeep({
                    ...tmpSeep,
                    API_KEY_SPEEDFLOW: e.target.value,
                  });
                }}
              />
            </div>
            <div className='input' style={{ width: '100%' }}>
              <h5 className='bold'>URL FTP</h5>
              <InputData
                placeholder='URL FTP'
                className='input'
                value={tmpSeep.URL_FTP_SPEEDFLOW}
                onChange={(e) => {
                  setTmpSeep({
                    ...tmpSeep,
                    URL_FTP_SPEEDFLOW: e.target.value,
                  });
                }}
              />
            </div>

            <div className='input' style={{ gap: 5, display: 'flex' }}>
              <div className='input'>
                <h5 className='bold'>USUÁRIO FTP</h5>
                <InputData
                  placeholder='USUÁRIO FTP'
                  className='input'
                  value={tmpSeep.USR_FTP_SPEEDFLOW}
                  onChange={(e) => {
                    setTmpSeep({
                      ...tmpSeep,
                      USR_FTP_SPEEDFLOW: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='input'>
                <h5 className='bold'>SENHA FTP</h5>
                <InputData
                  placeholder='Senha FTP'
                  className='input'
                  value={tmpSeep.PWD_FTP_SPEEDFLOW}
                  onChange={(e) => {
                    setTmpSeep({
                      ...tmpSeep,
                      PWD_FTP_SPEEDFLOW: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setTmpSeep({});
              setShowSpeedInfo(false);
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleSpeedInfo();
            }}
          >
            {speedLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'SALVAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* EMAIL */}
      <Dialog
        open={showEditEmail}
        onClose={() => {
          setShowEditEmail(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Alterar e-mail</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Novo e-mail
              </label>
              <InputData
                placeholder='Novo e-mail *'
                className='input'
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
              />
            </div>
            <br />
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Confirmar novo e-mail
              </label>
              <InputData
                placeholder='Confirmar novo e-mail *'
                className='input'
                value={confirmNewEmail}
                onChange={(e) => setConfirmNewEmail(e.target.value)}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowEditEmail(false);
              setNewEmail('');
              setConfirmNewEmail('');
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleChangeEmail();
            }}
          >
            {loadingEditEmail ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* new password */}
      <Dialog open={showEditPassword}>
        <DialogTitle id='alert-dialog-title'>Alterar senha</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Nova senha
              </label>
              <InputPassSignUp>
                <input
                  type={typePass}
                  placeholder='Senha'
                  value={newPass}
                  id='password'
                  name='password'
                  onChange={(e) => setNewPass(e.target.value)}
                />
                {newPass &&
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
            <br />
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Confirmar a nova senha
              </label>
              <InputPassSignUp>
                <input
                  type={typePassConfirm}
                  placeholder='Confirmar senha'
                  value={confirmNewPass}
                  id='password'
                  name='password'
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                />
                {confirmNewPass &&
                  (typePassConfirm === 'password' ? (
                    <LiaEyeSolid
                      className='eyes'
                      onClick={handleTypePassConfirm}
                      size={25}
                    />
                  ) : (
                    <LiaEyeSlash
                      className='eyes'
                      onClick={handleTypePassConfirm}
                      size={25}
                    />
                  ))}
              </InputPassSignUp>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowEditPassword(false);
              setNewPass('');
              setConfirmNewPass('');
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleChangePass();
            }}
          >
            {loadingEditPass ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit profile */}
      <Dialog open={showEditProfile}>
        <DialogTitle id='alert-dialog-title'>Alterar perfil</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='input'>
              <label className='bold' style={{ fontSize: '1em' }}>
                Escolha o perfil
              </label>
              <SelectUfs
                placeholder='Perfil'
                menuPosition='fixed'
                className='input'
                value={profile}
                onChange={(e) => {
                  setProfile(e.target.value);
                }}
              >
                <option code={'Client'} value={'CLIENT'}>
                  Cliente
                </option>
                <option code={'Agent'} value={'AGENT'}>
                  Representante
                </option>
              </SelectUfs>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowEditProfile(false);
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={() => {
              handleChangeProfile();
            }}
          >
            {loadingEditPass ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : (
              'SALVAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
