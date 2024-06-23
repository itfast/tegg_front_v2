/* eslint-disable react/prop-types */
import moment from "moment";

export const ConsumSmsTable = ({ consum }) => {
  return (
    <>
      <tr>
        <td>{moment(consum?.day).format("DD/MM/YYYY")}</td>
        <td>{consum.sms}</td>
      </tr>
    </>
  );
};
