import { toast } from 'react-toastify';
import { Button } from '../../../../globalStyles';
import { CardData, TypeContainer } from '../Resales.styles';
import './new_resale.css';

// eslint-disable-next-line react/prop-types
export const TypeRegister = ({ selected, setSelected, goStep, goBackStep }) => {
  const handleNext = () => {
    if (selected === '') {
      toast.error('Selecione o tipo de cadastro');
    } else {
      goStep();
    }
  };
  return (
    <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h5>TIPO DE CADASTRO</h5>
      <div className='select_type_container'>
        <TypeContainer
          style={{ width: screen.width < 768 && '80%', textAlign: 'center' }}
          selected={selected === 'EMPRESA'}
          onClick={() => setSelected('EMPRESA')}
        >
          EMPRESA
        </TypeContainer>
        <TypeContainer
          style={{ width: screen.width < 768 && '80%', textAlign: 'center' }}
          selected={selected === 'PESSOA FISICA'}
          onClick={() => setSelected('PESSOA FISICA')}
        >
          PESSOA FISICA
        </TypeContainer>
      </div>
      <div className='flex end btn_invert'>
        <Button onClick={goBackStep} invert>
          CANCELAR
        </Button>
        <Button notHover onClick={handleNext}>
          PRÓXIMO
        </Button>
      </div>
    </CardData>
  );
};
