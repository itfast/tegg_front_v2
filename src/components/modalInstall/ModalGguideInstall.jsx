/* eslint-disable react/no-unescaped-entities */
import { useRef, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
// import { MdLogout } from 'react-icons/md';
// import { Button } from '../../globalStyles';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
// import { Divider } from '../Header/HeaderStyles'

const Background = styled.div`
  /* width: 100%; */
  /* padding-top: 38px; */
  height: 100%;
  background: rgba(61, 61, 61, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: end;
`;

const ModalWrapper = styled.div`
  width: 100vw;
  height: 100%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background-color: rgba(250, 250, 250, 0.8);
  color: #000;
  border-radius: 8px 8px 0 0;
  display: grid;
  padding: 2%;
  /* grid-template-columns: 1fr 1fr; */
  /* position: relative; */
  z-index: 10;
  /* border-radius: 10px; */
`;

// const ModalImg = styled.img`
//   width: 100%;
//   height: 100%;
//   border-radius: 10px 0 0 10px;
//   background: #000;
// `;

// const ModalContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   line-height: 1.8;
//   color: #141414;

//   p {
//     margin-bottom: 1rem;
//   }

//   button {
//     padding: 10px 24px;
//     background: #141414;
//     color: #fff;
//     border: none;
//   }
// `;

// const CloseModalButton = styled(MdClose)`
//   cursor: pointer;
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   width: 32px;
//   height: 32px;
//   padding: 0;
//   z-index: 10;
// `;

// eslint-disable-next-line react/prop-types
export const ModalGuideInstall = ({ showModal, setShowModal }) => {
  // const navigate = useNavigate();
  const modalRef = useRef();

  // const [alerts, setAlerts] = useState(0)

  // useEffect(()=>{
  //   api.user.countAlerts()
  //   .then((res)=>{
  //     console.log(res)
  //     setAlerts(res.data.unrededNotifications)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  // },[])

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(100%)`,
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
    setShowModal(false);
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  // const goTo = (local) => {
  //   navigate(local);
  //   setShowModal(false);
  // };

  // const logout = () => {
  //   api.user.logout();
  //   navigate('/');
  // };

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef} style={{ zIndex: 999 }}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: 10}}>
                <p>Adicionar à Tela de Inicio</p>
                <p style={{color: '#2d7cf6'}} onClick={closeModal}>Cancelar</p>
              </div>
              {/* <Divider style={{backgroundColor: '#7c7c7c', width: '100%'}}/> */}
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{width: '10%'}}>
                <img src='/assets/svg/shared.svg' style={{width: 15}}/>
                </div>
                <div style={{width: '90%'}}>
                <p>1) Pressione o botão 'Compartilhar' na barra de menu abaixo.</p>
                </div>
              </div>
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                <div style={{width: '10%'}}>
                <img src='/assets/svg/addIos.svg' style={{width: 15}}/>
                </div>
                <div style={{width: '90%'}}>
                <p>2) Pressione 'Adicionar à tela inicial'.</p>
                </div>
              </div>
              {/* <ModalImg src={'./assets/logo.png'} alt='camera' />
              <ModalContent>
                <h1>Are you ready?</h1>
                <p>Get exclusive access to our next launch.</p>
                <button>Join Now</button>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowModal(prev => !prev)}
              /> */}
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};
