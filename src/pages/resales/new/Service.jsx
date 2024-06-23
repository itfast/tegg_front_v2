/* eslint-disable react/prop-types */
import { UFS, getCity, translateError } from '../../../services/util';
import { CardData } from '../Resales.styles';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { Button } from '../../../../globalStyles'
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const Service = ({goBackStep, goStep, setCitys, citys, uf, setUf}) => {
  const {t} = useTranslation()
  const [optCitys, setOptCitys] = useState([]);

  async function getData() {
    try {
      const cities = await getCity(uf.value);
      console.log(cities);
      const list = [];
      list.push({label: t('Service.all'), value: 'all'})
      cities.forEach((c) => {
        list.push({
          label: `${c.nome} - ${uf.value}`,
          value: c.nome,
          complet: { city: c.nome, uf: uf.value },
        });
      });
      
      setOptCitys(list);
    } catch (err) {
      translateError(err);
    }
  }
  useEffect(() => {
    if (uf) {
      getData();
    }
  }, [uf]);


  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    if(action === 'select-option'){
      if(option.value === 'all'){
        setCitys(optCitys)
        setOptCitys([])
      }else{
        setCitys([...citys, option])
      }
      
    }else if(action === 'remove-value'){
      if(removedValue.value !== 'all'){
        const orig = _.cloneDeep(citys)
        const findIndex = orig.findIndex((o)=> o.value === removedValue.value)
        orig.splice(findIndex, 1)
        setOptCitys([...optCitys, removedValue])
        setCitys(orig)
      }else{
        getData();
        setCitys([])
      }
      
    }else if(action === 'clear'){
      getData();
      setCitys([])
    }
  };

  return (
    <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h5>{t('Service.title')}</h5>
      <div style={{ marginTop: '0.5rem' }}>
        <h5>{t('Service.selectState')}</h5>
        <Select
          // isSearchable={false}
          menuPlacement='bottom'
          isClearable={false}
          options={UFS}
          placeholder={t('Service.uf')}
          // menuPosition='fixed'
          value={uf}
          onChange={setUf}
          // onChange={(e) => {}}
        />
      </div>
      {/* </div> */}
      {uf?.value && (
        <div style={{ marginTop: '0.5rem' }}>
          <h5>{t('Service.selectCity')}</h5>
          <Select
            isMulti
            closeMenuOnSelect={false}
            menuPlacement='bottom'
            // isClearable={false}
            options={optCitys}
            placeholder={t('Service.city')}
            value={citys}
            onChange={onChange}
          />
        </div>
      )}

      <div className='flex end btn_invert'>
        <Button onClick={goBackStep}>{t('Service.goback')}</Button>
        <Button notHover onClick={goStep}>
        {t('Service.next')}
        </Button>
      </div>
    </CardData>
  );
};
