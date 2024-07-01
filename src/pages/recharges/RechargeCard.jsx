/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../globalStyles';
// import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

export const RechargeCard = ({
  plan,
  name,
  size,
  internet,
  extra,
  extraPortIn,
  free,
  price,
  comments,
  disabled = false,
  selected = false,
  onClick = () => {
    console.log('ok');
  },
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Card
        onClick={onClick}
        style={{
          borderRadius: 10,
          width: 180,
          border: selected && '2px solid #00d959',
          boxShadow: selected && '0 5px 16px rgba(0, 217, 89, 0.2)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
        }}
      >
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>
          {name}
        </h2>
        <h1
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            // marginTop: 10,
            color: '#00d958',
            margin: 0,
            // fontSize: 60,
          }}
        >
          {size}
        </h1>
        <CardContent
          style={{
            textAlign: 'center',
            // height: 280,
            marginTop: -15,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <h5 style={{ color: 'black', fontWeight: 'bold' }}>
            Ligações ilimitadas
          </h5>
          <br />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {internet && (<h5>
              <span style={{ fontWeight: 'bold' }}>{internet}</span> de internet
            </h5>)}
            {extra && (<h5>
              <span style={{ fontWeight: 'bold' }}>{extra}</span> de recorrência
            </h5>)}
            {extraPortIn && <h5>
              <span style={{ fontWeight: 'bold' }}>{extraPortIn}</span> de
              portabilidade
            </h5>}
            {comments &&(
              <h6>{comments}</h6>
            )}
          </div>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // gap: 10,
              justifyContent: 'center',
            }}
          >
            {free?.map((i, idx) => (
              <h4 key={idx} style={{ color: '#00ba4b' }}>
                {i} grátis
              </h4>
            ))}
          </div>
        </CardContent>
        <CardActions
        onClick={onClick}
          style={{
            display: 'flex',
            justifyContent: 'center',
            // marginBottom: 5,
          }}
        >
          <Button
            disabled={disabled}
            onClick={onClick}
            // onClick={() =>
            //   navigate('/recharge/new', {
            //     state: { plan: plan },
            //   })
            // }
            style={{
              width: 200,
              backgroundColor: 'black',
              borderColor: 'black',
            }}
          >
            <h3
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                // fontSize: 30,
              }}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(price)}
            </h3>
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
