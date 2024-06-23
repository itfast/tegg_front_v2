import { styled } from 'styled-components';

export const LoadingContainer = styled.div`
  .logo {
    animation: rotation 0.5s infinite linear;
    // zIndex: theme.zIndex.drawer + 2,
    margin-left: 15px;
    margin-right: 15px;
  }
  @keyframes rotation {
    from {
      transform: 'rotate(0deg)';
    }
    to {
      transform: 'rotate(359deg)';
    }
  }
  .image {
    margin-left: 15px;
    margin-right: 15px;
    -webkit-animation: spin 0.5s linear infinite;
    -moz-animation: spin 0.5s linear infinite;
    animation: spin 0.5s linear infinite;
  }
  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  } */
`;
