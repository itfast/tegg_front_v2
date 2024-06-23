import { styled } from "styled-components";

export const CardData = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  margin: auto;
  /* margin: 1rem 0; */
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
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

export const CardDataCard = styled.div`
  /* display: flex; */
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  margin-top: 1rem;
  /* margin: auto; */
  /* margin: 1rem 0; */
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  max-width: 700px;
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

export const InputData = styled.input`
  /* width: 100%; */
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
  &:focus {
    ::placeholder {
      opacity: 0;
    }
  }
`;

export const InputDataCard = styled.input`
  /* width: 100%; */
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
  &:focus {
    ::placeholder {
      opacity: 0;
    }
  }
`;

export const SelectUfs = styled.select`
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

export const TableItens = styled.table`
  border-collapse: collapse;
  border-style: hidden;
  box-shadow: 0 0 0 1px #000;
  border-radius: 10px;
  color: #00d959;
  td {
    color: #000000;
  }
  tr:nth-child(even) {
    background-color: #d1f7d5;
  }
  tr:first-child {
    /* background-color: #00D959; */
    border-top-left-radius: 10px;
    overflow: hidden;
    background-clip: border-box;
  }
  tr:first-of-type td:first-child {
    border-top-left-radius: 10px;
  }

  tr:first-of-type td:last-child {
    border-top-right-radius: 10px;
  }

  tr:last-of-type td:first-child {
    border-bottom-left-radius: 10px;
  }

  tr:last-of-type td:last-child {
    border-bottom-right-radius: 10px;
  }
`;

export const TypeContainer = styled.div`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  width: 23%;
  display: flex;
  padding: 0.4rem;
  margin: 1rem;
  border-radius: 8px;
  border: ${(props) =>
    props.disabled
      ? "2px solid #ccc"
      : `2px solid ${props.theme.colors.button}`};
  /* border: 2px solid ${({ theme }) => theme.colors.button}; */
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.disabled ? "#9e9e9e" : props.selected ? "#fff" : "#000"};
  background-color: ${(props) =>
    props.disabled ? "#ccc" : props.selected ? "#00D959" : "#fff"};
`;
