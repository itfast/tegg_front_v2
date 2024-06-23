import { toast } from 'react-toastify';
import { Button } from '../../../../globalStyles';
import { CardData, TypeContainer } from '../../resales/Resales.styles';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
export const TypeRegister = ({ selected, setSelected, goStep, goBackStep }) => {
  const {t} = useTranslation()
  const handleNext = () => {
    if (selected === '') {
      toast.error(t('Clients.new.type.msgError'));
    } else {
      goStep();
    }
  };
  return (
    <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h5>{t('Clients.new.type.title')}</h5>
      <div className='select_type_container'>
        <TypeContainer
          style={{ width: screen.width < 768 && '80%', textAlign: 'center' }}
          selected={selected === 'PESSOA JURÍDICA'}
          onClick={() => setSelected('PESSOA JURÍDICA')}
        >
          {t('Clients.new.type.pj')}
        </TypeContainer>
        <TypeContainer
          style={{ width: screen.width < 768 && '80%', textAlign: 'center' }}
          selected={selected === 'PESSOA FISICA'}
          onClick={() => setSelected('PESSOA FISICA')}
        >
          {t('Clients.new.type.pf')}
        </TypeContainer>
      </div>
      {/* <div className='flex end btn_invert'> */}
      <div style={{display: 'flex', justifyContent: 'end'}}>
        <Button onClick={goBackStep} invert>
        {t('Clients.new.type.buttonCancel')}
        </Button>
        <Button notHover onClick={handleNext}>
        {t('Clients.new.type.buttonNext')}
        </Button>
      </div>
      {/* </div> */}
    </CardData>
  );
};
