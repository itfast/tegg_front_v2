/* eslint-disable react/prop-types */
import { MenuItem } from '@mui/material';
import api from '../../services/api';
import { translateError } from '../../services/util';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ChangeProfile = ({ setShowEditProfile, setLoading }) => {
  const navigate = useNavigate();

  const changeClientProfile = (profile) => {
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

  const newUserSession = (userId, profile) => {
    api.user
      .getUserSession(userId)
      .then((res) => {
        console.log(res)
        navigate('/');
        api.mySession.set(res.data?.AccessToken).then(async () => {
          if (profile === 'DEALER') {
            setLoading(false);
            window.location.reload();
          } else {
            changeClientProfile(profile);
          }
        });
      })
      .catch((err) => translateError(err))
      .finally(()=> setLoading(false));
  };

  const handleChangeProfile = (profile) => {
    if (api.currentUser.Type !== profile) {
      setShowEditProfile()
      setLoading(true);
      if (
        api.currentUser.Type === 'CLIENT' ||
        api.currentUser.Type === 'AGENT'
      ) {
        if (profile === 'DEALER') {
          console.log('DEALER')
          console.log(api.currentUser.MyUserDealerId)
          newUserSession(api.currentUser.MyUserDealerId, profile);
        } else {
          changeClientProfile(profile);
        }
      } else {
        newUserSession(api.currentUser.MyUserFinalClientId, profile);
      }
    } else {
      toast.info('Perfil selecionado já é o perfil atual.');
    }
  };

  return (
    <>
    {(api.currentUser.MyUserFinalClientId || api.currentUser.Type === 'AGENT' || api.currentUser.Type === 'CLIENT') &&<MenuItem disabled={api.currentUser.Type === 'CLIENT'} onClick={()=>handleChangeProfile('CLIENT')}>Cliente</MenuItem>}
    {(api.currentUser.MyUserFinalClientId || api.currentUser.Type === 'AGENT' || api.currentUser.Type === 'CLIENT') &&<MenuItem disabled={api.currentUser.Type === 'AGENT'} onClick={()=>handleChangeProfile('AGENT')}>Representante</MenuItem>}
    {(api.currentUser.MyUserDealerId || api.currentUser.Type === 'DEALER')  && <MenuItem disabled={api.currentUser.Type === 'DEALER'} onClick={()=>handleChangeProfile('DEALER')}>Revenda</MenuItem>}
    </>
  );
};
