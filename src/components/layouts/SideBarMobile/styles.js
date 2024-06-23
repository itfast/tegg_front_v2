import styled from 'styled-components';

export const SidebarMobileContainer = styled.div`
  /* * {
    margin: 0px;
    padding: 0px;
  }
  body {
    background: #383c55;
    width: 100%;
    height: 100%;
    font: 12px 'Open Sans', sans-serif;
  }
  div.screen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: absolute;
    /* top: 50px; */
    /* left: 0; */
    /* margin-left: -160px; */
    /* background: #31558a; */
  /* } */ */
  

  /* .list { */
    /* margin-top: 36px; */
    /* text-align: left; */
  /* } */
  

  /* div.burger {
    height: 30px;
    width: 40px;
    position: absolute;
    top: 11px;
    left: 21px;
    cursor: pointer;
  }
  div.x,
  div.y,
  div.z {
    position: absolute;
    margin: auto;
    top: 0px;
    bottom: 0px;
    background: #fff;
    border-radius: 2px;
    -webkit-transition: all 200ms ease-out;
    -moz-transition: all 200ms ease-out;
    -ms-transition: all 200ms ease-out;
    -o-transition: all 200ms ease-out;
    transition: all 200ms ease-out;
  }
  div.x,
  div.y,
  div.z {
    height: 3px;
    width: 26px;
  }
  div.y {
    top: 18px;
  }
  div.z {
    top: 37px;
  }
  div.collapse {
    top: 20px;
    background: #4a89dc;
    -webkit-transition: all 70ms ease-out;
    -moz-transition: all 70ms ease-out;
    -ms-transition: all 70ms ease-out;
    -o-transition: all 70ms ease-out;
    transition: all 70ms ease-out;
  }

  div.rotate30 {
    -ms-transform: rotate(30deg);
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
    -webkit-transition: all 50ms ease-out;
    -moz-transition: all 50ms ease-out;
    -ms-transition: all 50ms ease-out;
    -o-transition: all 50ms ease-out;
    transition: all 50ms ease-out;
  }
  div.rotate150 {
    -ms-transform: rotate(150deg);
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg);
    -webkit-transition: all 50ms ease-out;
    -moz-transition: all 50ms ease-out;
    -ms-transition: all 50ms ease-out;
    -o-transition: all 50ms ease-out;
    transition: all 50ms ease-out;
  }

  div.rotate45 {
    -ms-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transition: all 100ms ease-out;
    -moz-transition: all 100ms ease-out;
    -ms-transition: all 100ms ease-out;
    -o-transition: all 100ms ease-out;
    transition: all 100ms ease-out;
  }
  div.rotate135 {
    -ms-transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    -webkit-transition: all 100ms ease-out;
    -moz-transition: all 100ms ease-out;
    -ms-transition: all 100ms ease-out;
    -o-transition: all 100ms ease-out;
    transition: all 100ms ease-out;
  } */

  div.navbar {
    height: 60px;
    background: #385e97;
  }

  div.circle {
    /* border-radius: 50%; */
    /* width: 0px;
    height: 0px; */
    position: absolute;
    top: 60px;
    left: -565px;
    /* left: 36px; */
    background: #2b2b2b;
    opacity: 1;
    -webkit-transition: all 300ms cubic-bezier(0, 0.995, 0.99, 1);
    -moz-transition: all 300ms cubic-bezier(0, 0.995, 0.99, 1);
    -ms-transition: all 300ms cubic-bezier(0, 0.995, 0.99, 1);
    -o-transition: all 300ms cubic-bezier(0, 0.995, 0.99, 1);
    transition: all 300ms cubic-bezier(0, 0.995, 0.99, 1);
  }
  div.circle.expand {
    /* width: 1200px; */
    /* height: 1200px; */
    /* top: -160px; */
    /* left: -565px; */
    left: 0px;
    -webkit-transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    -moz-transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    -ms-transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    -o-transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
  }
  div.menu {
    /* height: 568px;
    width: 320px; */
    position: absolute;
    top: 0px;
    left: 0px;
  }
  div.menu ul div{
    position: absolute;
    z-index: 101;
    top: 50px;
  }
  div.menu ul li {
    /* margin: 20px; */
    /* list-style: none; */
    /* position: absolute; */
    /* top: 50px; */
    /* left: 0; */
    opacity: 0;
    /* width: 320px; */
    text-align: center;
    font-size: 0px;
    -webkit-transition: all 70ms cubic-bezier(0, 0.995, 0.99, 1);
    -moz-transition: all 70ms cubic-bezier(0, 0.995, 0.99, 1);
    -ms-transition: all 70ms cubic-bezier(0, 0.995, 0.99, 1);
    -o-transition: all 70ms cubic-bezier(0, 0.995, 0.99, 1);
    transition: all 70ms cubic-bezier(0, 0.995, 0.99, 1);
  }
  div.menu ul li a {
    color: #00D959;
    //text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 1px;
  }

  div.menu li.animate {
    margin-top: 0.5rem;
    font-size: 21px;
    opacity: 1;
    -webkit-transition: all 150ms cubic-bezier(0, 0.995, 0.99, 1);
    -moz-transition: all 150ms cubic-bezier(0, 0.995, 0.99, 1);
    -ms-transition: all 150ms cubic-bezier(0, 0.995, 0.99, 1);
    -o-transition: all 150ms cubic-bezier(0, 0.995, 0.99, 1);
    transition: all 150ms cubic-bezier(0, 0.995, 0.99, 1);
  }
  div.menu li.animate:nth-of-type(1) {
    /* top: 50px; */
    transition-delay: 0s;
  }
  div.menu li.animate:nth-of-type(2) {
    /* top: 130px; */
    transition-delay: 0.03s;
  }
  div.menu li.animate:nth-of-type(3) {
    /* top: 180px; */
    transition-delay: 0.06s;
  }
  div.menu li.animate:nth-of-type(4) {
    /* top: 230px; */
    transition-delay: 0.09s;
  }
  div.menu li.animate:nth-of-type(5) {
    /* top: 280px; */
    transition-delay: 0.12s;
  }
  div.menu li.animate:nth-of-type(6) {
    /* top: 330px; */
    transition-delay: 0.15s;
  }
  div.menu li.animate:nth-of-type(7) {
    /* top: 330px; */
    transition-delay: 0.18s;
  }
  div.menu li.animate:nth-of-type(8) {
    /* top: 330px; */
    transition-delay: 0.21s;
  }
  div.menu li.animate:nth-of-type(9) {
    /* top: 330px; */
    transition-delay: 0.24s;
  }
  div.menu li.animate:nth-of-type(10) {
    /* top: 330px; */
    transition-delay: 0.27s;
  }
`;
