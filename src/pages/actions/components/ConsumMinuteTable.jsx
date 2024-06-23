/* eslint-disable react/prop-types */
import moment from "moment";

export const ConsumMinuteTable = ({ consum }) => {
  return (
    <>
      <tr>
        <td>{moment(consum?.day).format("DD/MM/YYYY")}</td>
        <td>{consum.minute}</td>
      </tr>
    </>
  );
};
