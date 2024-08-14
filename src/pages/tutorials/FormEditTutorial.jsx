/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Video } from './Video';
import { InputData, MultiLineInputData } from '../resales/Resales.styles';
import { useState } from 'react';
import api from '../../services/api';
import { translateError } from '../../services/util';
import { Loading } from '../../components/loading/Loading';
import { toast } from 'react-toastify'

const schema = yup
  .object({
    id: yup.string().required('Id é obrigatório'),
    title: yup.string().required('Título do vídeo deve ser informado'),
    description: yup.string().required('Descrição do vídeo deve ser informado'),
    videoUrl: yup.string().required('URL do vídeo deve ser informado'),
  })
  .required();

// eslint-disable-next-line react/prop-types
export const FormEditTutorial = ({ btnSubmit, data, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
    resolver: yupResolver(schema),
  });

  const vUrlVideo = watch('videoUrl');

  const submited = (myData) => {
    setLoading(true);
    api.tutorials
      .edit(
        myData?.id,
        myData?.title,
        myData?.description,
        myData.videoUrl,
        data.status
      )
      .then((res) => {
        console.log(res)
        toast.success(res.data?.Message)
        handleClose()
      })
      .catch((err) => translateError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Loading open={loading} msg='Editando tutorial...' />
      <div
        style={{
          display: window.innerWidth > 768 && 'flex',
          gap: 10,
          justifyContent: 'space-around',
        }}
      >
        <div style={{ width: '100%' }}>
          <form onSubmit={handleSubmit(submited)}>
            <div
              style={{
                display: window.innerWidth > 768 && 'flex',
                alignItems: 'center',
              }}
            >
              <h5 style={{ marginRight: '0.2rem' }}>Nome</h5>
            </div>
            <div style={{ width: '100%' }}>
              <InputData
                {...register('title')}
                type='text'
                placeholder=''
                style={{ width: '100%', textAlign: 'start', paddingLeft: 10 }}
              />
              <h5 style={{ color: 'red' }}>{errors.title?.message}</h5>
            </div>
            <div
              style={{
                display: window.innerWidth > 768 && 'flex',
                alignItems: 'center',
              }}
            >
              <h5 style={{ marginRight: '0.2rem' }}>Descrição</h5>
            </div>
            <div style={{ width: '100%' }}>
              <MultiLineInputData
                {...register('description')}
                type='text'
                rows={4}
                placeholder=''
                style={{ width: '100%', textAlign: 'start' }}
              />
              <h5 style={{ color: 'red' }}>{errors.description?.message}</h5>
            </div>
            <div
              style={{
                display: window.innerWidth > 768 && 'flex',
                alignItems: 'center',
              }}
            >
              <h5 style={{ marginRight: '0.2rem' }}>URL</h5>
            </div>
            <div style={{ width: '100%' }}>
              <InputData
                {...register('videoUrl')}
                type='text'
                placeholder=''
                style={{ width: '100%', textAlign: 'start', paddingLeft: 10 }}
              />
              <h5 style={{ color: 'red' }}>{errors.videoUrl?.message}</h5>
            </div>
            <button ref={btnSubmit} style={{ visibility: 'hidden' }} />
          </form>
        </div>
        <div style={{ width: '100%' }}>
          <div
            style={{
              width: window.innerWidth > 768 && 350,
              paddingTop: '10px',
              margin: 'auto',
              height: '100%',
            }}
          >
            <Video url={vUrlVideo !== '' ? vUrlVideo : undefined} />
          </div>
        </div>
      </div>
    </>
  );
};