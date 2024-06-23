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
  .title {
    text-align: center;
  }
`;

export const CardData2 = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  /* margin: auto; */
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
  .title {
    text-align: center;
  }
`;

// export const CardLogo = styled.img`
//   border-radius: 8px;
//   box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
//   max-width: 15%;
//   padding: 5px;
//   position: center;
//   background-repeat: no-repeat;
//   size: cover;
// `;

export const CardLogo = styled.div`
  border-radius: 8px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  max-width: 15%;
  padding: 5px;
  /* background-image: url('/assets/tv/max.avif'); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  cursor: pointer;
`;
