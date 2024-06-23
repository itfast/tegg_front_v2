/* eslint-disable react/prop-types */
import moment from 'moment';
import { TableItens } from '../orders/new/NewOrder.styles';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem } from '@mui/material';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import api from '../../services/api';
import { Button } from '../../../globalStyles'
import { toast } from 'react-toastify'
import { translateError } from '../../services/util'
import { Loading } from '../../components/loading/Loading'

export const TableNf = ({ nfs, search }) => {
  const [tmp, setTmp] = useState();
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false)
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, nf) => {
    setAnchorEl(event.currentTarget);
    setTmp(nf);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const resendNFe = () => {
		setLoading(true);
		api.nfe
			.resend(tmp.Id)
			.then((res) => {
				toast.success(res.data.Message);
        setShowResend(false)
        search()
			})
			.catch((err) => {
				translateError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

  return (
    <>
    <Loading open={loading} mgs={'Reemitindo nfe...'}/>
      <TableItens>
        <tr>
          <th>Número</th>
          <th>Série</th>
          <th>Status</th>
          {/* <th>MENSAGEM</th> */}
          <th>Chave acesso</th>
          <th>Protocolo</th>
          <th>Data autorização</th>
        </tr>
        {nfs.length === 0 && (
          <tr>
            <td colSpan="6" style={{textAlign: 'center'}}>Você não possui notas emitidas</td>
          </tr>
        )}
        {nfs.map((n) => (
          <tr key={n.Id}>
            <td>{n.Number}</td>
            <td>{n.Group}</td>
            <td style={{ maxWidth: 400, wordWrap: 'break-word' }}>
              {n.StatusDesc}
            </td>
            <td style={{ maxWidth: 200, wordWrap: 'break-word' }}>
              {n.AccessKey}
            </td>
            <td>{n.Protocol}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: n.AuthTime ? 'space-between' : 'end',
                  alignItems: 'center',
                }}
              >
                {n.AuthTime && moment(n.AuthTime).format('DD/MM/YYYY HH:mm')}
                <div>
                  <IconButton
                    aria-label='more'
                    id='long-button'
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={(e) => handleClick(e, n)}
                  >
                    {/* <MoreVertIcon /> */}
                    <IoMdMore />
                  </IconButton>
                  <Menu
                    id='long-menu'
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        // width: '10ch',
                      },
                    }}
                  >
                    <MenuItem
                      disabled={!tmp?.PDFLink}
                      onClick={() => {
                        tmp?.PDFLink && window.open(tmp?.PDFLink, '_black');
                      }}
                    >
                      Download PDF
                    </MenuItem>
                    <MenuItem
                      disabled={!tmp?.XMLLink}
                      onClick={() => {
                        tmp?.XMLLink && window.open(tmp?.XMLLink, '_black');
                      }}
                    >
                      Download XML
                    </MenuItem>
                    {api.currentUser.Type !== 'CLIENT' && (
                    <MenuItem
                      disabled={tmp?.StatusCode === 100}
                      onClick={() => {
                        handleClose();
                        setShowResend(true);
                      }}
                    >
                      Reemitir
                    </MenuItem>
                    )}
                  </Menu>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </TableItens>
      <Dialog
				open={showResend}
				onClose={() => {
					setShowResend(false);
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">Reemitir NF-e</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<p>Atenção!</p>
						<p>
							Confira todas as informações referentes a NF-e antes de reemitir
							para evitar novos erros.
						</p>
						<p>
							Após confirmar todos os dados clique no botão abaixo para reemitir
							a nota.
						</p>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						invert
						onClick={() => {
							setShowResend(false);
						}}>
						FECHAR
					</Button>
					<Button
						onClick={() => {
							resendNFe();
						}}>
						REEMITIR
					</Button>
				</DialogActions>
			</Dialog>
    </>
  );
};
