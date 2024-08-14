import { useEffect, useState } from 'react';
import { Button, PageLayout } from '../../../globalStyles';
import { PageTitles } from '../../components/PageTitle/PageTitle';
import Divider from '@mui/material/Divider';
import api from '../../services/api';
import { TutorialGrid } from './TutorialGrid';
// import { Dialog } from '@mui/material'
// import { ManagerTutorial } from './ManagerTutorial'
import { useNavigate } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';
import { translateError } from '../../services/util'
// import TutorialModal from './Modal'

export const Tutorials = () => {
  // const [open, setOpen] = useState(false)
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [tutorial, setTutorials] = useState([
    
  ]);

  const searchTutorials = () => {
    api.tutorials.getAll(pageNum, pageSize, 'Publicado')
    .then((res)=> {
      const list = []
      res.data?.videos?.forEach((v)=>{
        list.push({
          id: v?.Id,
          status: v?.Status,
          title: v?.Title,
          media: v?.URL,
          subject: v?.Description
        })
      })
      setTutorials(list)
      setMaxPages(res?.data?.meta?.totalPages)
    })
    .catch((err) => translateError(err))
  }

  useEffect(() => {
    searchTutorials()
  },[pageNum, pageSize])

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  return (
    <PageLayout>
      <PageTitles title={'Tutoriais'} />
      <div className='btn_container'>
        {api.currentUser.Type === 'TEGG' && (
          <Button onClick={() => navigate('/tutorials/manager')}>
            Gerenciar Tutoriais
          </Button>
        )}
      </div>
      {tutorial.length > 0 && (
        <>
          <Divider
            variant='middle'
            style={{ backgroundColor: '#71717130', margin: '10px' }}
          />
          <TutorialGrid
            tutorials={tutorial.filter((tuto) => {
              return tuto;
            })}
          />
        </>
      )}
      {tutorial.length === 0 && (
        <h3 style={{textAlign: 'center'}}>Sem tutoriais publicados...</h3>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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
  );
};
