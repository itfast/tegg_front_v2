import { useEffect, useState } from 'react';
import { Button, ContainerWeb, PageLayout } from '../../../../globalStyles';
import { TableItens } from '../../clients/new/NewClient.styles';
import { Loading } from '../../../components/loading/Loading';
import { InvoicesTable } from '../InvoicesTable';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api'
import { translateError } from '../../../services/util'
import { Pagination } from '@mui/material'
import Select from 'react-select';

export const Invoices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState({ label: '10', value: 10 });
  const [total, setTotal] = useState(0);
  

  const search = (id) => {
    api.order
      .getByRoot(page, limit.value, '', '', '', id)
      .then((res) => {
        console.log(res);
        setTotal(res.data?.meta?.totalPages);
        console.log(res.data?.orders);
        setOrders(res.data?.orders);
      })
      .catch((err) => translateError(err));
  };

  useEffect(() => {
    if(location.state.line){
      const {line} = location.state
      console.log(line?.Iccid)
      search(line?.Iccid)
    }

  },[limit, page])

  const handlePageSizeChange = (e) => {
    setLimit(e);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Loading open={loading} msg={msg} />
      <PageLayout>
        <Button
          style={{ marginBottom: '1rem' }}
          onClick={() => navigate('/actions')}
        >
          Voltar
        </Button>
        <h4>Cobranças</h4>
        <h4>Visualize as faturas da linha selecionada</h4>
        <br />
        <ContainerWeb>
          <TableItens>
            <tr>
              <th>Data de Geração</th>
              <th>Data do Pagamento</th>
              {/* <th>Id do Pagamento</th> */}
              <th>Tipo de fatura</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
            {orders.map((order) => (
              <InvoicesTable
                key={order.Id}
                order={order}
                setLoading={setLoading}
                setMsg={setMsg}
              />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    Sem registros
                  </div>
                </td>
              </tr>
            )}
          </TableItens>
        </ContainerWeb>
        <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>Itens por página:</p>
              <Select
                name='pages'
                id='page-select'
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '30', value: '30' },
                  { label: '50', value: '50' },
                ]}
                value={limit}
                onChange={(e) => {
                  handlePageSizeChange(e);
                }}
              />
            </div>
            <div>
              <Pagination
                count={total}
                page={page}
                onChange={handlePageChange}
                variant='outlined'
                shape='rounded'
                size='large'
              />
            </div>
          </div>
      </PageLayout>
    </>
  );
};
