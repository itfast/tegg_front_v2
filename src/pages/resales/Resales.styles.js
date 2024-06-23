import { styled } from "styled-components";

export const CardData = styled.div`
	margin: 1rem 0;
	border-radius: 8px;
	padding: 2rem;
	box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
	/* background-color: rgba(250, 250, 250, 0.8); */
	/* background: rgba(11, 11, 11, 0.4); */
	color: #000;
	/* background-color: #d1f7d5; */
	/* marginTop: '1rem' */
	h2 {
		color: #7c7c7c;
		margin-bottom: 0.5rem;
	}

	label {
		color: #7c7c7c;
		font-size: 0.8rem;
	}
`;

export const ContainerTable = styled.div`
	border-radius: 8px;
	overflow-x: scroll;
	margin-top: 1rem;
	padding: 1rem;
	background-color: #d1f7d5;
	/* marginTop: '1rem' */
	h2 {
		color: #7c7c7c;
		margin-bottom: 0.5rem;
	}
	#customers {
		font-family: Arial, Helvetica, sans-serif;
		border-collapse: collapse;
	}

	#customers td,
	#customers th {
		border: 1px solid #ddd;
		padding: 8px;
	}

	#customers tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	#customers tr:hover {
		background-color: #ddd;
	}

	#customers th {
		padding-top: 12px;
		padding-bottom: 12px;
		text-align: left;
		background-color: #04aa6d;
		color: white;
	}
`;

export const InputData = styled.input`
	height: 40px;
	border-radius: 8px;
	text-align: center;
	border: 1px solid ${({ theme }) => theme.colors.button};
	outline-color: ${({ theme }) => theme.colors.button};
	::placeholder {
		text-align: start;
		padding: 0.5em;
		font-size: 18px;
		color: #b1afac;
	}
	&:focus {
		::placeholder {
			opacity: 0;
		}
	}
`;

export const MultiLineInputData = styled.textarea`
	/* height: 40px; */
	resize: none;
	padding: 1rem;
	border-radius: 8px;
	text-align: center;
	border: 1px solid ${({ theme }) => theme.colors.button};
	outline-color: ${({ theme }) => theme.colors.button};
	::placeholder {
		text-align: start;
		padding: 0.5em;
		font-size: 18px;
		color: #b1afac;
	}
	&:focus {
		::placeholder {
			opacity: 0;
		}
	}
`;

export const TypeContainer = styled.div`
	cursor: pointer;
	width: 30%;
	display: flex;
	padding: 3.5rem;
	margin: 1rem;
	border-radius: 8px;
	border: 2px solid ${({ theme }) => theme.colors.button};
	justify-content: center;
	align-items: center;
	color: ${(props) => (props.selected ? "#fff" : "#000")};
	background-color: ${(props) => (props.selected ? "#00D959" : "#fff")};
`;

export const FooterButton = styled.div`
	width: 100%;
	display: flex;
	justify-content: end;
`;

export const SelectUfs = styled.select`
	height: 40px;
	border-radius: 8px;
	/* background-color: ${({ theme }) => theme.colors.inputBackgroundColor}; */
	/* margin: 1px; */
	/* margin: 1rem; */
	text-align: center;
	/* font-size: 18px; */
	/* color: #B1AFAC; */
	border: 1px solid ${({ theme }) => theme.colors.button};
	outline-color: ${({ theme }) => theme.colors.button};
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
	:disabled {
		background-color: #f3f3f3;
		border: 1px solid #e5e5e5;
	}
`;

export const Select = styled.input`
	height: 50px;
	border-radius: 8px;
	/* background-color: ${({ theme }) => theme.colors.inputBackgroundColor}; */
	/* margin: 1px; */
	/* margin: 1rem; */
	text-align: center;
	/* font-size: 18px; */
	/* color: #B1AFAC; */
	border: 1px solid ${({ theme }) => theme.colors.button};
	outline-color: ${({ theme }) => theme.colors.button};
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
	:disabled {
		background-color: #f3f3f3;
		border: 1px solid #e5e5e5;
	}
`;

export const ContainerDetails = styled.div`
	margin: 1rem 0;
	border-radius: 8px;
	/* padding: 2rem; */
	margin: 1rem;
	background-color: #d1f7d5;
`;
