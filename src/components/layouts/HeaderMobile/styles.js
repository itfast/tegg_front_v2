import styled from "styled-components";

export const SessionComponent = styled.div`
	.home-section {
		position: fixed;
		z-index: 99;
		/* background: ${({ theme }) => theme.colors.button}; */
		background-color: #2b2b2b;
		/* height: 100vh; */
		height: 60px;
		left: 260px;
		width: calc(100% - 260px);
		transition: all 0.5s ease;
	}
	.home-section i {
		color: #fff;
	}
	.sidebar.close ~ .home-section {
		left: 78px;
		width: calc(100% - 78px);
	}
	.home-section.close {
		left: 78px;
		width: calc(100% - 78px);
	}
	.home-section .home-content {
		height: 60px;
		display: flex;
		align-items: center;
	}
	.home-section .home-content .bx-menu,
	.home-section .home-content .bx-chevron-left,
	.home-section .home-content .text {
		/* color: #11101d; */
		font-size: 35px;
	}
	.home-section .home-content .bx-menu,
	.home-section .home-content .bx-chevron-left {
		margin: 0 15px;
		cursor: pointer;
	}
	.home-section .home-content .text {
		font-size: 26px;
		font-weight: 600;
	}
	div.burger {
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
		background-color: red;
  }
  div.y {
    top: 18px;
  }
  div.z {
    top: 37px;
  }
  div.collapse {
    top: 20px;
    background: red;
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
  }
	@media (max-width: 768px) {
		.sidebar.close .nav-links li .sub-menu {
			display: none;
		}
		.sidebar {
			width: 78px;
		}
		.sidebar.close {
			width: 0;
		}
		.home-section {
			left: 78px;
			width: 100%;
			z-index: 100;
		}
		.home-section.close {
			left: 0;
			width: 100%;
		}
		.sidebar.close ~ .home-section {
			width: 100%;
			left: 0;
		}
	}
`;
