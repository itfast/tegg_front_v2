import { styled } from "styled-components";

export const ContainerBodyLogin = styled.div`
	/* height: 100vh; */
	height: 100%;
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background-image: url("/assets/Main_Background.svg");
	background-repeat: no-repeat;
	background-size: cover;
	/* overflow: scroll; */
	
`;

export const ContainerLogin = styled.div`
	display: flex;
	width: 80%;
	/* height: 50%; */
	// margin: auto;
	// margin-bottom: 20px;
	// box-shadow: 60px 16px teal;
	.react-card-flip{
		width: 100%;
	}

	@media (max-width: 750px) {
		flex-direction: column;
		align-items: center;
		margin-top: -200px;
		// margin: auto;
	}

	@media (max-width: 700px) {
		width: 90%;
	}

	@media (max-width: 768px) {
		width: 100vw;
		// height: 100vh;
	}
`;

export const ContainerImageLogin = styled.div`
	width: 40%;
	/* height: 40vh; */

	/* background-image: url('/assets/tegg.jpg');
  background-repeat: no-repeat;
  background-size: cover; */

	@media (max-width: 750px) {
		width: 100%;
	}

	@media (max-width: 768px) {
		width: 100vw;
		height: 50vh;
	}
`;

export const ContainerImageText = styled.div`
	height: 100%;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;

	@media (max-width: 750px) {
		/* width: 100%; */
		flex-direction: column-reverse;
	}
`;

export const ContainerFormLogin = styled.div`
	width: 60%;
	/* height: 20%; */
	/* height: 40vh; */
	background-color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;

	padding: 2rem 1rem;

	@media (max-width: 750px) {
		width: 100%;
	}
	@media (max-height: 580px) {
		padding-top: 20px;
	}
	@media (max-height: 460px) {
		padding-top: 10px;
	}

	@media (max-width: 768px) {
		width: 100vw;
		height: 50vh;
	}

	@media (max-width: 380px) {
		text-align: center;
	}

	/* h1 {
    color: #c1c1c1;
  } */
	p {
		padding: 0.4rem;
	}
`;

export const FormLogin = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export const InputPassSignUp = styled.div`
	width: 100%;
	position: relative;
	/* height: 60px; */
	display: flex;
	border-radius: 8px;
	/* background-color: #fdfaf5; */
	margin: 5px;
	text-align: center;
	font-size: 18px;
	/* color: #b1afac; */

	input {
		border: none;
		width: 100%;
		text-align: center;
		font-size: 18px;
		border-radius: 8px;
		background-color: ${({ theme }) => theme.colors.inputBackgroundColor};
		/* color: #B1AFAC; */
		padding: 1rem 1rem 1rem 0;
		border: 1px solid ${({ theme }) => theme.colors.inputBackgroundColor};
		outline-color: ${({ theme }) => theme.colors.inputBorderRadius};
		::placeholder {
			text-align: start;
			padding: 0.5em;
			font-size: 18px;
			color: #b1afac;
		}
		:focus {
			::placeholder {
				opacity: 0;
				border: 1px solid #f7eeda;
			}
		}
		:disabled {
			background-color: #f3f3f3;
			border: 1px solid #e5e5e5;
		}
		@media (max-width: 700px) {
			height: 50px;
			font-size: 14px;
		}
	}
	.eyes {
		position: absolute;
		/* margin-right: 10; */
		cursor: pointer;
		right: 0;
		bottom: 28%;
		padding-right: 10px;
		z-index: 11;
	}

	@media (max-height: 580px) {
		height: 40px;
	}
`;

export const InputLogin = styled.input`
	width: 100%;
	height: 60px;
	border-radius: 8px;
	background-color: ${({ theme }) => theme.colors.inputBackgroundColor};
	margin: 5px;
	text-align: center;
	font-size: 18px;
	/* color: #B1AFAC; */
	border: 1px solid ${({ theme }) => theme.colors.inputBackgroundColor};
	outline-color: ${({ theme }) => theme.colors.inputBorderRadius};
	::placeholder {
		text-align: start;
		padding: 0.5em;
		font-size: 18px;
		color: #b1afac;
	}
	:focus {
		::placeholder {
			opacity: 0;
		}
	}

	@media (max-width: 700px) {
		/* height: 50px; */
		font-size: 14px;
	}

	@media (max-height: 580px) {
		height: 40px;
	}
`;
