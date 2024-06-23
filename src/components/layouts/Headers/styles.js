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
