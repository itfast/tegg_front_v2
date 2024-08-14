import { useEffect, useRef, useState } from 'react';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { PageTitles } from '../../components/PageTitle/PageTitle';
import api from '../../services/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Stack,
} from '@mui/material';
import { FormNewTutorial } from './FormNewTutorial';
import { useNavigate } from 'react-router-dom';
import { TableItens } from '../orders/clientNew/NewOrder.styles';
import { TableTutorials } from './TableTutorials';
import { CardManagerTutorial } from './CardManagerTutorial';
import { translateError } from '../../services/util'
import { Loading } from '../../components/loading/Loading'

export function ManagerTutorial() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [tutorials, setTutorials] = useState([]);
  const btnSubmit = useRef(null);

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const searchTutorials = () => {
    setMsg('Buscando tutoriais...')
    setLoading(true)
    api.tutorials.getAll(pageNum, pageSize)
    .then((res)=> {
      const list = []
      res.data?.videos?.forEach((v)=>{
        list.push({
          id: v?.Id,
          status: v?.Status,
          title: v?.Title,
          videoUrl: v?.URL,
          description: v?.Description
        })
      })
      setTutorials(list)
      setMaxPages(res?.data?.meta?.totalPages)
    })
    .catch((err) => translateError(err))
    .finally(() => {setLoading(false)})
  }

  useEffect(() => {
    searchTutorials()
  },[pageNum, pageSize])

  return (
    <>
    <Loading open={loading} msg={msg} />
      <PageLayout>
        <PageTitles title={'Gerenciar Tutoriais'} />
        <div className='btn_container'>
          {api.currentUser.Type === 'TEGG' && (
            <>
              <Button onClick={() => navigate('/tutorials')}>Voltar</Button>
              <Button onClick={() => setOpen(true)}>+ Tutorial</Button>
            </>
          )}
        </div>
        <ContainerWeb style={{ marginTop: '1rem' }}>
          <TableItens>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>URL</th>
              <th>Status</th>
            </tr>
            {tutorials.map((d) => (
              <TableTutorials
                key={d.Id}
                tutorial={d}
                searchTutorials={searchTutorials}
                setLoading={setLoading}
                setMsg={setMsg}
              />
            ))}
            {tutorials.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    Sem tutoriais...
                  </div>
                </td>
              </tr>
            )}
          </TableItens>
        </ContainerWeb>
        <ContainerMobile style={{ width: '100%', height: '100%', marginTop: '1rem' }}>
          {tutorials.map((d) => (
            <CardManagerTutorial
              key={d.Id}
              tutorial={d}
              setLoading={setLoading}
              setMsg={setMsg}
              searchTutorials={searchTutorials}
            />
          ))}
        </ContainerMobile>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <Stack
            spacing={2}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Pagination
              count={maxPages}
              page={pageNum}
              onChange={handlePageChange}
              variant='outlined'
              shape='rounded'
            />
            <div style={{ display: 'flex', gap: 5 }}>
              <p>Itens por página:</p>
              <select
                name='pages'
                id='page-select'
                value={pageSize}
                onChange={(e) => {
                  handlePageSizeChange(e);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </Stack>
        </div>
      </PageLayout>
      <Dialog open={open} fullWidth maxWidth='lg'>
        <DialogTitle>Novo tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormNewTutorial btnSubmit={btnSubmit} handleClose={() => {
              searchTutorials()
              setOpen(false)
            }}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => btnSubmit.current.click()}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
