/* eslint-disable react/prop-types */
import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { SelectUfs } from '../../pages/resales/Resales.styles';
import { Button } from '../../../globalStyles';
import api from '../../services/api';
import { translateError } from '../../services/util';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

export const ChangeProfile = ({ setShowEditProfile, setLoading }) => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(
    api.currentUser.Type === 'CLIENT'
      ? 'CLIENT'
      : api.currentUser.Type === 'AGENT'
      ? 'AGENT'
      : 'DEALER'
  );
  const [profileOpt, setProfileOpt] = useState([]);

  useEffect(() => {
    const list = [];
    if (api.currentUser.Type === 'CLIENT' || api.currentUser.Type === 'AGENT') {
      list.push({ value: 'CLIENT', label: 'Cliente' });
      list.push({ value: 'AGENT', label: 'Representante' });
      if (api.currentUser.MyUserDealerId) {
        list.push({ value: 'DEALER', label: 'Revenda' });
      }
    } else {
      list.push({ value: 'DEALER', label: 'Revenda' });
      if (api.currentUser.MyUserFinalClientId) {
        list.push({ value: 'CLIENT', label: 'Cliente' });
        list.push({ value: 'AGENT', label: 'Representante' });
      }
    }
    setProfileOpt(list);
  }, []);


  const changeClientProfile = () => {
    setLoading(true);
    api.user
      .updateProfile(api.currentUser.UserId, profile)
      .then(async () => {
        setLoading(false);
        setShowEditProfile(false);
        window.location.reload();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const newUserSession = (userId) => {
    api.user
      .getUserSession(userId)
      .then((res) => {
        navigate('/')
        api.mySession.set(res.data?.AccessToken).then(async () => {
          if (profile === 'DEALER') {
            setLoading(false);
            setShowEditProfile(false);
            window.location.reload();
          } else {
            changeClientProfile();
          }
        });
      })
      .catch((err) => translateError(err));
  };

  const handleChangeProfile = () => {
    if(api.currentUser.Type !== profile){
      setLoading(true);
      if (api.currentUser.Type === 'CLIENT' || api.currentUser.Type === 'AGENT') {
        if (profile === 'DEALER') {
          newUserSession(api.currentUser.MyUserDealerId);
        } else {
          changeClientProfile();
        }
      } else {
        newUserSession(api.currentUser.MyUserFinalClientId);
      }
    }else{
      toast.info('Perfil selecionado já é o perfil atual.')
    }
  };

  return (
    <>
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
              {profileOpt.map((p) => (
                <option key={p?.value} value={p?.value}>
                  {p?.label}
                </option>
              ))}
              {/* <option code={'Client'} value={'CLIENT'}>
                  Cliente
                </option>
                <option code={'Agent'} value={'AGENT'}>
                  Representante
                </option> */}
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
          {/* {loading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : ( */}
          ALTERAR
          {/* )} */}
        </Button>
      </DialogActions>
    </>
  );
};
