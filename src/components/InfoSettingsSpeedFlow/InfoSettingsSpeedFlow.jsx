import './InfoSettingsSpeedFlow.css';
/* eslint-disable react/prop-types */
export const InfoSettingsSpeedFlow = ({ speed }) => {





  return (
    <>
      <div className='header_container'>
        <div className='column-100'>
          <div>
            <p style={{ fontWeight: 'bold' }}>DADOS</p>
          </div>
          <div className='header_content'>
            <div>
              <label style={{ fontWeight: 'bold' }}>URL FTP</label>
              <p style={{ wordWrap: 'anywhere' }}>{speed.URL_FTP_SPEEDFLOW}</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>USUÁRIO FTP</label>
              <p style={{ wordWrap: 'anywhere' }}>{speed.USR_FTP_SPEEDFLOW}</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>SENHA FTP</label>
              <p style={{ wordWrap: 'anywhere' }}>{speed.PWD_FTP_SPEEDFLOW}</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>API KEY</label>
              <p style={{wordWrap: 'anywhere'}}>{speed.API_KEY_SPEEDFLOW}</p>
            </div>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};
