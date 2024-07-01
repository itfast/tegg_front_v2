import { ContainerMobile, ContainerWeb } from '../../../../globalStyles';

import { NewActivateClient } from './full/NewActivateClient';
export const ActivationManualClient = () => {
  return (
    <>
      <ContainerWeb>
        <div style={{ width: '100%' }}>
          <NewActivateClient
            setShow={() => console.log('show')}
            iccid={''}
            search={() => console.log('')}
            canGoBack
          />
        </div>
      </ContainerWeb>
      <ContainerMobile>
        <div style={{ width: '100%' }}>
          <NewActivateClient
            setShow={() => console.log('show')}
            iccid={''}
            search={() => console.log('')}
            canGoBack
          />
        </div>
      </ContainerMobile>
    </>
  );
};
