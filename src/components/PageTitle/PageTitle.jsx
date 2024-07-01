/* eslint-disable react/prop-types */
export const PageTitles = ({ title }) => {
  return (
    <div style={{width: '100%', textAlign: 'center', marginBottom: '1rem'}}>
      <h4>{title.toUpperCase()}</h4>
    </div>
  );
};
