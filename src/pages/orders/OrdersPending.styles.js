import { styled } from 'styled-components';

export const SelectContainer = styled.div`
  .select {
    width: 100%;
    min-width: 15ch;
    max-width: 30ch;
    border: 1px solid var(--select-border);
    border-radius: 0.25em;
    padding: 0.25em 0.5em;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1.1;
    background-color: #fff;
    background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  }
`;

export const InputSearch = styled.div`
  width: 30%;
  height: 40px;
  position: relative;
  /* height: 60px; */
  display: flex;
  border-radius: 8px;
  background-color: #fdfaf5;
  margin: 5px;
  text-align: center;
  font-size: 18px;
  color: #b1afac;
  border: 1px solid #00d959;
  /* padding: 1rem; */
  input {
    border: none;
    width: 100%;
    /* text-align: center; */
    font-size: 18px;
    background-color: #d1f7d5;
    /* color: #B1AFAC; */
    padding: 1rem 1rem 1rem 1rem;
    ::placeholder {
      text-align: start;
      padding: 0.5em;
      /* margin: 10px; */
      /* font-size: 18px; */
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
  }
  img {
    position: absolute;
    /* margin-right: 10; */
    right: 0;
    bottom: 30%;
    width: 1.2rem;
    cursor: pointer;
  }
`;
