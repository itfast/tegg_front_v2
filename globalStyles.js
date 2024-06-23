import styled, { createGlobalStyle } from 'styled-components';
// import ReactLoading from 'react-loading';
// import { Children } from 'react'

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Louis', 'Montserrat', sans-serif;
	font-weight: 400;
  }
	/* @media screen and (max-width: 768px) { */
		/* body{
			background-image:${(props) =>
        props.myBackground === 'white'
          ? "url('/assets/svg/backgroudc.svg')"
          : "url('/assets/svg/backgroudc.svg')"}; 
			background-color: ${(props) =>
        props.myBackground === 'white' ? '#fff' : '#393839'};
		} */
		
	/* } */
	/* rgba(255, 0, 0, 0.2); */
	/* D4A845 */
	/* 393839 */
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1300px;
  margin-right: auto;
  margin-left: auto;
  padding: 0 50px;

  @media screen and (max-width: 960px) {
    padding: 0 30px;
  }
`;
export const MainHeading = styled.h1`
  font-size: clamp(2.3rem, 6vw, 4.5rem);
  margin-bottom: 2rem;
  color: ${({ inverse }) => (inverse ? '$403ae3' : '#fff')};
  width: 100%;
  letter-spacing: 4px;
  text-align: center;
`;

export const Heading = styled.h2`
  font-size: clamp(1.3rem, 13vw, 3.1rem);
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
  color: ${({ inverse }) => (inverse ? '$403ae3' : '#fff')};
  letter-spacing: 0.4rem;
  line-height: 1.06;
  text-align: center;
  width: ${({ width }) => (width ? width : '100%')};
`;
export const TextWrapper = styled.span`
  color: ${({ color }) => (color ? color : '')};
  font-size: ${({ size }) => (size ? size : '')};
  font-weight: ${({ weight }) => (weight ? weight : '')};
  letter-spacing: ${({ spacing }) => (spacing ? spacing : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
`;
export const Section = styled.section`
  padding: ${({ padding }) => (padding ? padding : '140px 0')};
  margin: ${({ margin }) => (margin ? margin : '')};
  /* background: ${({ inverse }) => (inverse ? 'white' : '#071c2f')}; */
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : 'auto')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : 'auto')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : 'auto')};
  height: ${({ height }) => (height ? height : 'auto')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : 'auto')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 'auto')};

  @media screen and (max-width: 768px) {
    padding: ${({ smPadding }) => (smPadding ? smPadding : '70px 0')};
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: ${({ justify }) => (justify ? justify : '')};
  align-items: ${({ align }) => (align ? align : '')};
  gap: ${({ gap }) => (gap ? gap : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : 'auto')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : 'auto')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : 'auto')};
  height: ${({ height }) => (height ? height : 'auto')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : 'auto')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 'auto')};
  flex-wrap: ${({ wrap }) => (wrap ? wrap : '')};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justify }) => (justify ? justify : '')};
  align-items: ${({ align }) => (align ? align : '')};
  gap: ${({ gap }) => (gap ? gap : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : 'auto')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : 'auto')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : 'auto')};
  height: ${({ height }) => (height ? height : 'auto')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : 'auto')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : 'auto')};
`;

export const PageLayout = styled.div`
  position: absolute;
  margin-top: 60px;
  width: 100%;
  padding: 1rem;
  /* background-image: url('/assets/pgto1.jpg'); */
`;

export const InputSearch = styled.input`
  color: #b1afac;
  background-color: #fbf7ed;
  text-align: center;
  min-height: 2.5rem;
  width: 80%;
  /* margin-top: 3rem; */
  /* margin-top: 4%; */
  /* margin-bottom: 7%; */
  font-size: 1rem;
  padding: 1%;
  border: 1px solid #d4a845;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  ::placeholder {
    color: #b1afac;
  }
`;

export const Button = styled.button`
  border-radius: 8px;
  /* width: 100%; */
  /* background: none; */
  background-color: ${(props) =>
    props.invert
      ? '#fff'
      : props.disabled
      ? '#ccc'
      : props.theme.colors.button};
  white-space: nowrap;
  padding: 10px 20px;
  /* font-size: 16px; */
  color: ${(props) =>
    props.invert || props.disabled
      ? '#9e9e9e'
      : props.theme.colors.buttonTextColor};
  outline: none;
  /* min-height: 60px; */
  /* border: 2px solid ${({ theme }) => theme.colors.button}; */
  border: ${(props) =>
    props.disabled ? '2px solid #ccc' : props.theme.colors.button};
  cursor: pointer;
  overflow: hidden;
  position: relative;
  font-weight: 400;
  /* font-size: 1.5rem; */

  &:before {
    background: #fff;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    transition: all 0.6s ease;
    width: 100%;
    height: 0%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &:hover:before {
    height: 500%;
    background-color: ${(props) =>
      props.disabled ? '' : `${({ theme }) => theme.colors.buttonHover}`};
    color: ${({ theme }) => theme.colors.buttonHoverTextColor};
  }

  &:hover {
    background-color: ${(props) =>
      props.notHover
        ? props.theme.colors.button
        : props.disabled
        ? '#ccc'
        : props.theme.colors.buttonHover};
    color: ${(props) =>
      props.notHover
        ? '#fff'
        : props.disabled
        ? ''
        : props.theme.colors.buttonHoverTextColor};
  }
  &:disabled {
    background-color: '#c1c1c1';
    color: '#fff';
  }
`;

export const SpecialButton = styled.button`
  border-radius: 16px;
  /* background: none; */
  background-color: #d4a845;
  white-space: nowrap;
  padding: 0px;
  padding: 5px 10px;
  /* font-size: 16px; */
  color: #fff;
  outline: none;
  /* min-height: 60px; */
  border: 2px solid #d4a845;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  font-weight: 400;

  &:before {
    background: #fff;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    transition: all 0.6s ease;
    width: 100%;
    height: 0%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &:hover:before {
    /* height: 500%; */
    background-color: #7f7f7f;
  }

  &:hover {
    /* color: black; */
  }
`;

export default GlobalStyle;

export const ContainerMobile = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    #banner {
      width: 100%;
      /* min-height: 100vh; */
      position: relative;
    }

    #banner:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      /* width: 100%; */
      /* height: 100%; */
      /* min-height: 100vh; */
      opacity: 0.11;
      z-index: -1;
      background: url(/assets/tegg.jpg) center center;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      background-size: cover;
    }
  }
`;

export const ContainerWeb = styled.div`
  display: none;
  @media screen and (min-width: 769px) {
    display: flex;
  }
`;

export const CardInfo = styled.div`
  width: 90%;
  background-color: #00d959;
  text-align: center;
  color: #fff;
  padding: 0.5rem;
  margin: auto;
  border-radius: 8px;
  margin-top: 0.2rem;
  position: relative;
`;
