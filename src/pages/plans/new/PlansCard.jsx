import { translateValue } from '../../../services/util';
import { AiFillDelete } from 'react-icons/ai';
/* eslint-disable react/prop-types */
export const PlansCard = ({ plan, info, handleDelete, index }) => {
  return (
    <div
      style={{
        width: '90%',
        backgroundColor: '#00D959',
        textAlign: 'center',
        // color: '#3d3d3d',
        padding: '0.5rem',
        margin: 'auto',
        borderRadius: '8px',
        marginTop: '0.2rem',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '16px',
        }}
      >
        {!info && (
        <AiFillDelete
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            handleDelete(index);
          }}
        />)}
        {/* <MdSignalWifiStatusbarNotConnected
            style={{ color: 'red' }}
            size={25}
            onClick={() => getStatus(i)}
          /> */}
        {/* icone */}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
        }}
      >
        {/* <Checkbox
            // checked={checkedArray[index]}
            onChange={(e) => {
              handleCheck(e, i);
            }}
          /> */}
      </div>
      <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>{plan.Name}</h4>
      <h4>{translateValue(plan.Amount)}</h4>
    </div>
  );
};
