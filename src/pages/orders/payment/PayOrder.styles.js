import { styled } from 'styled-components';

export const BackgroundForPay = styled.div`
  background: url('/assets/pgto1.jpg');
  height: 100vh;
  width: 100vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  align-content: center;
`;

export const PayCardContainer = styled.div`
  @media screen and (max-width: 400px) {
    .rccs__card {
      height: 20vh;
      margin-top: 10;
      margin-bottom: 10;
      position: relative;
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      -webkit-transition: all 0.4s linear;
      transition: all 0.4s linear;
      width: 70vw;
    }
  }
`;

export const CardItem = styled.div`
  width: 90%;
  text-align: center;
  color: white;
  padding: 0.5rem;
  margin: auto;
  border-radius: 8px;
  margin-top: 0.2rem;
  position: relative;
`;
export const ImagePay = styled.img`
  /* animation: pulse 0.7s infinite; */
  cursor: pointer;
  margin: 0 auto;
  display: table;
  animation-direction: alternate;
  -webkit-animation-name: pulse;
  animation-name: pulse;

  @-webkit-keyframes pulse {
    0% {
      /* -webkit-transform: scale(1); */
      /* -webkit-filter: brightness(100%); */
    }
    100% {
      /* -webkit-transform: scale(1.1); */
    }
  }

  @keyframes pulse {
    0% {
      /* transform: scale(1); */
      /* filter: brightness(100%); */
    }
    100% {
      transform: scale(1.1);
      /* filter: brightness(200%); */
    }
  }

  &:hover {
    animation: pulse 2s infinite;
  }
`;
