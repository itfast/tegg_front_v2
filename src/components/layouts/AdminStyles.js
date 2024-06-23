import styled from "styled-components";

export const ContainerMenu = styled.div`
	background-color: #4a4a4b;
	position: fixed;
	height: 100%;
	top: 0px;
	left: 0px;
	width: 300px;
	left: 0;
	/* animation: showSidebar .4s; */
`;

export const LayoutContainer = styled.div`
	height: calc(100vh);
	/* background: ${(props) => props.theme["gray-800"]}; */
`;

export const OutletContainer = styled.div`
	position: relative;
	left: ${(props) => (props.open ? "260px" : "78px")};
	transition: all 0.5s ease;
	width: calc(${(props) => (props.open ? "100vw - 260px" : "100vw - 78px")});

	.close {
		left: 78px;
	}

	@media (max-width: 768px) {
		left: 0px;
		width: calc(${(props) => (props.open ? "100vw - 260px" : "100vw")});
		/* left: 20px;
		width: calc(${(props) => (props.open ? "100vw - 260px" : "100vw - 39px")}); */
	}
`;
