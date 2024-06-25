/* eslint-disable react/prop-types */
import api from '../../../services/api';
import { CardData } from './NewOrder.styles';
// import AsyncSelect from 'react-select/async';
import Radio from '@mui/joy/Radio';
import FormControl from '@mui/joy/FormControl';

import RadioGroup from '@mui/joy/RadioGroup';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useTranslation } from 'react-i18next';

export const Buyer = ({
  handleNextExt,
  stoke,
  setStoke,
  linkIccid,
  setLinkIccid,
  typeOrder,
  setTypeOrder,
  buyer,
  setBuyer,
  otherSend,
  setOtherSend,
  typeClient,
  setTypeClient,
}) => {
  // const [value, setValue] = useState('local');
  const {t} = useTranslation()
  const navigate = useNavigate();

  const handleChange = (event) => {
    setStoke(event.target.value);
    setLinkIccid('manual');
  };

  const handleChangeLink = (event) => {
    setLinkIccid(event.target.value);
  };

  const handleChangeType = (event) => {
    setTypeOrder(event.target.value);
  };

  const handleTypeClient = (event) => {
    setTypeClient(event.target.value);
  };
  

  const loadDealers = async (search, prevOptions) => {
    const vlr = prevOptions.length;

    const response = await api.dealer.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
    console.log(response);
    const listD = [];
    response.data?.dealers?.forEach((d) => {
      listD.push({
        value: d.Id,
        label: d.CompanyName || d.Name,
        type: 'dealer',
      });
    });
    const hasMoreD = response.data.meta.total > vlr;
    return {
      options: listD,
      hasMoreD,
    };
  };

  const loadClients = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const list = [];

    const response = await api.client.getSome(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response.data?.finalClients?.forEach((c) => {
      list.push({
        value: c.Id,
        label: c.Name,
        type: 'client',
      });
    });

    const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
    return {
      options: list,
      hasMore,
    };
  };

  const handleNext = () => {
    if (buyer) {
      handleNextExt();
    } else {
      toast.error(t('Order.new.buyer.mustBuyer'));
    }
  };

  return (
    <CardData>
      <h5>{t('Order.new.buyer.title')}</h5>
      {api.currentUser.AccessTypes[0] === 'TEGG' && (
        <FormControl>
          <RadioGroup
            defaultValue='outlined'
            name='radio-buttons-group'
            orientation='horizontal'
            value={typeClient}
            onChange={handleTypeClient}
          >
            <Radio
              color='success'
              orientation='horizontal'
              size='md'
              variant='solid'
              value='finalClient'
              label={t('Order.new.buyer.client')}
            />
            <Radio
              color='success'
              orientation='horizontal'
              size='md'
              variant='solid'
              value='dealer'
              label={t('Order.new.buyer.resale')}
            />
          </RadioGroup>
        </FormControl>
      )}
      <div style={{ display: 'flex', marginBottom: '2rem' }}>
        <div style={{ width: '100%' }}>
          {typeClient === 'finalClient' && (
            <AsyncPaginate
              // defaultOptions
              placeholder={t('Order.new.buyer.placeHolder')}
              noOptionsMessage={() => t('Order.new.buyer.notClients')}
              value={buyer}
              loadOptions={loadClients}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
              onChange={(e) => {
                setBuyer(e);
              }}
            />
          )}
          {typeClient === 'dealer' && (
            <AsyncPaginate
              // defaultOptions
              placeholder={t('Order.new.buyer.placeHolder')}
              noOptionsMessage={() => t('Order.new.buyer.notResales')}
              value={buyer}
              loadOptions={loadDealers}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
              onChange={(e) => {
                setBuyer(e);
              }}
            />
          )}
        </div>
        <div>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => navigate('/clients/new')}
          >
            +
          </Button>
        </div>
      </div>
      {api.currentUser.AccessTypes[0] !== 'DEALER' && (
        <>
          <h5>{t('Order.new.buyer.selectDestiny')}</h5>
          <FormControl>
            <RadioGroup
              defaultValue='outlined'
              name='radio-buttons-group'
              orientation='horizontal'
              value={stoke}
              onChange={handleChange}
            >
              <Radio
                color='success'
                orientation='horizontal'
                size='md'
                variant='solid'
                value='local'
                label={t('Order.new.buyer.localStoke')}
              />
              <Radio
                color='success'
                orientation='horizontal'
                size='md'
                variant='solid'
                value='Transportadora'
                label={t('Order.new.buyer.transport')}
              />
            </RadioGroup>
          </FormControl>
          {/*  */}
          {stoke === 'local' && (
            <>
              <h5 style={{ marginTop: '0.5rem' }}>Tipo de envio</h5>
              <FormControl>
                <RadioGroup
                  defaultValue='outlined'
                  name='radio-buttons-group'
                  orientation='horizontal'
                  value={otherSend}
                  onChange={(event) => setOtherSend(event.target.value)}
                >
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='mãos'
                    label={t('Order.new.buyer.hands')}
                  />
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='outros'
                    label={t('Order.new.buyer.other')}
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <>
              <h5>{t('Order.new.buyer.iccidVinc')}</h5>
              <FormControl>
                <RadioGroup
                  defaultValue='outlined'
                  name='radio-buttons-group'
                  orientation='horizontal'
                  value={linkIccid}
                  onChange={handleChangeLink}
                >
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='automatic'
                    label={t('Order.new.buyer.automatic')}
                  />
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='manual'
                    label={t('Order.new.buyer.manual')}
                  />
                </RadioGroup>
              </FormControl>
              <h5>{t('Order.new.buyer.orderType')}</h5>
              <FormControl>
                <RadioGroup
                  defaultValue='outlined'
                  name='radio-buttons-group'
                  orientation='horizontal'
                  value={typeOrder}
                  onChange={handleChangeType}
                >
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='plan'
                    label={t('Order.new.buyer.plan')}
                  />
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='unit'
                    label={t('Order.new.buyer.unit')}
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}
        </>
      )}

      {/*  */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <Button onClick={handleNext}>{t('Order.new.buyer.buttonNext')}</Button>
      </div>
    </CardData>
  );
};
