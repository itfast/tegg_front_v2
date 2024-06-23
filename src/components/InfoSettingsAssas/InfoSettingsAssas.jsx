import './InfoSettingsAssas.css';

/* eslint-disable react/prop-types */
export const InfoSettingsAssas = ({ assas }) => {

  return (
    <>
      <div className='header_container'>
        <div className='column-100'>
          <div>
            <p style={{ fontWeight: 'bold' }}>DADOS</p>
          </div>
          <div className='header_content'>
            <div>
              <label style={{ fontWeight: 'bold' }}>URL</label>
              <p style={{ wordWrap: 'anywhere' }}>{assas.URL_ASSAS}</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>KEY ASSAS</label>
              <p style={{wordWrap: 'anywhere'}}>{assas.API_KEY_ASSAS}</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>WALLET ID</label>
              <p style={{ wordWrap: 'anywhere' }}>{assas.WALLET_ID_ASSAS}</p>
            </div>
          </div>
          <br />
          {/* <div
            style={{ display: 'flex', width: '100%', justifyContent: 'end' }}
          >
            <div>
              <label style={{ fontWeight: 'bold' }}>DATA ATUALIZAÇÃO</label>
              <p>
                {assas?.CreatedAt &&
                  moment(assas?.CreatUPDATEATedAt).format('DD/MM/YYYY')}
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
