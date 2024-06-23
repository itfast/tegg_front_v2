/* eslint-disable react/prop-types */
import { useRef, useEffect, useCallback, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { Button } from '../../../globalStyles'

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(61, 61, 61, 0.7);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: start;
`;

const ModalWrapper = styled.div`
  width: 100vw;
  height: 100%;
  color: #000;
  padding: 7%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const PInform = styled.p`
  text-align: center;
  color: #363637;
  span {
    font-weight: 500;
  }
  padding: 1rem;
`;

export const ContainerCheckbox = styled.div`
  /* margin-right: 10%; */
  /* margin-left: 10%; */
  margin-bottom: 5%;
  div {
    /* margin-top: 5px; */
  }
  /* input {
    margin-right: 5px;
  } */

  input[type='checkbox']:checked + label::after {
    content: '';
    position: absolute;
    height: 1.5ex;
    width: 1.5ex;
    border: 1px solid rgb(166, 166, 166);
    border-radius: 4px;
    /* background: rgba(9, 9, 9, 9); */
    background-color: #00D959;
    top: 0.9ex;
    left: 0ex;
    /* border: 3px solid blue; */
    border-top: none;
    border-right: none;
    /* -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg); */
  }

  input[type='checkbox'] {
    line-height: 2.1ex;
  }

  input[type='radio'],
  input[type='checkbox'] {
    position: absolute;
    left: -999em;
  }

  input[type='checkbox'] + label {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  input[type='checkbox'] + label::before {
    content: '';
    display: inline-block;
    vertical-align: -25%;
    height: 1.5ex;
    width: 1.5ex;
    background-color: white;
    border: 1px solid rgb(166, 166, 166);
    border-radius: 4px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.25);
    margin-right: 0.5em;
  }
  label {
    color: #7f7f7f;
    span {
      text-decoration: underline;
      /* color: #b6862d; */
    }
  }
`;

// eslint-disable-next-line react/prop-types
export const ModalInstall = ({ showModal, setShowModal, installApp }) => {
  const [check, setCheck] = useState(false);
  const modalRef = useRef();
  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    alignSelf: 'center',
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
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

  const handleCheck = (e) => {
    console.log(e)
    setCheck(e);
    localStorage.setItem('appInstall', e);
  };

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef} style={{ zIndex: 999 }}>
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  <IoClose
                    style={{ margin: '1rem 1rem 0' }}
                    color='#00D959'
                    fontSize='1.5rem'
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <PInform>
                  Para sua facilidade, instale o <span>atalho</span> do nosso
                  Web App no seu celular
                </PInform>
                {/* <div style={{backgroundColor: '#D4A845', padding: '1.5rem', borderRadius: '16px'}}>
                <img src='/assets/logob1.png' />
                </div> */}
                <img style={{maxWidth: '10%',}} src='/assets/tegg-logo.png' />
                <Button
                  style={{
                    color: '#fff',
                    fontWeight: 400,
                    width: '80%',
                    // height: '10px',
                    margin: '2rem 0 2rem',
                    //
                  }}
                  onClick={installApp}
                >
                  INSTALAR ATALHO
                </Button>
                <ContainerCheckbox>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <input
                      type='checkbox'
                      id='msg'
                      name='msg'
                      checked={check}
                      value={check}
                      onChange={(e) => handleCheck(e.target.checked)}
                    />
                    <label htmlFor='msg'>Não exibir mais essa mensagem.</label>
                  </div>
                </ContainerCheckbox>
              </div>
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};
