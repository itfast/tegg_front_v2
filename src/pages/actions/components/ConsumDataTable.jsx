/* eslint-disable react/prop-types */
import moment from 'moment'

export const ConsumDataTable = ({ consum }) => {
  return (
    <>
      {consum.down > 0 && consum.up > 0 && (
        <tr>
          <td>{moment(consum?.day).format('DD/MM/YYYY')}</td>
          <td>{consum.down?.toFixed(3)} mb</td>
          <td>{consum.up?.toFixed(3)} mb</td>
        </tr>
      )}
    </>
  );
};
