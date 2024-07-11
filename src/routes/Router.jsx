import { Fragment, useEffect, useState } from 'react';
import { Routes, Route /*, useLocation*/ } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Login } from '../pages/login/Login';
import GlobalStyle from '../../globalStyles';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Resales } from '../pages/resales/Resales';
import { Clients } from '../pages/clients/Clients';
import { DashBoard } from '../pages/dashboard/DashBoard';
import { NewResales } from '../pages/resales/new/NewResales';
import { Plans } from '../pages/plans/Plans';
import { EditResales } from '../pages/resales/new/EditResales';
import { NewClient } from '../pages/clients/new/NewClient';
import { NewPlans } from '../pages/plans/new/NewPlans';
import { ResalesDetails } from '../pages/resales/ResalesDetails';
import { Comissions } from '../pages/comissions/Comissions';
import { Iccids } from '../pages/iccid/Iccids';
import { NewIccid } from '../pages/iccid/new/NewIccid';
import { NewIccidSpreadsheet } from '../pages/iccid/spreadsheet/NewIccidSpreadsheet';
import { ActivateIccid } from '../pages/iccid/activate/ActivateIccid';
import { Orders } from '../pages/orders/Orders';
import { NewOrder } from '../pages/orders/new/NewOrder';
import { NewEsimOrder } from '../pages/orders/newEsim/NewEsimOrder';
import { PayOrder } from '../pages/orders/payment/PayOrder';
import { PayOrderCredit } from '../pages/orders/payment/credit/PayOrderCredit';
import { PayOrderPix } from '../pages/orders/payment/pix/PayOrderPix';
import { EditIccids } from '../pages/orders/editIccids/EditIccids';
import { Products } from '../pages/products/Products';
import { NewProducts } from '../pages/products/new/NewProducts';
import { Profile } from '../pages/profile/Profile';
import { PayRecharge } from '../pages/profile/recharge/PayRecharge';
import { PayRechargeCredit } from '../pages/profile/recharge/credit/PayRechargeCredit';
import { PayRechargePix } from '../pages/profile/recharge/pix/PayRechargePix';
import { Lines } from '../pages/lines/Lines';
import { ActivateEsim } from '../pages/lines/activateEsim/ActivateEsim';
import { Subscriptions } from '../pages/subscriptions/Subscriptions';
// import { NewSubscription } from '../pages/subscriptions/new/NewSubscription';
import { PortRequests } from '../pages/portRequests/PortRequests';
import { NewPortRequest } from '../pages/portRequests/new/NewPortRequest';
import { NFe } from '../pages/nfe/NFe';
// import TeggPrivateRoute from "./TeggPrivateRoute";
// import TeggDealerPrivateRoute from "./TeggDealerPrivateRoute";
import { Recharges } from '../pages/recharges/Recharges';
import { NewRecharge } from '../pages/recharges/new/NewRecharge';
import { ResetPassword } from '../pages/resetPassword/ResetPassword';
import { NewOrderNew } from '../pages/orders/new/NewOrderNew';
import { NewOrderByClient } from '../pages/orders/clientNew/NewOrderByClient';
import { OrdersPending } from '../pages/orders/OrdersPending';
import { NewSubscriptionClient } from '../pages/subscriptions/clientNew/NewSubscriptionClient';
import { NewOrderByDealer } from '../pages/orders/dealerNew/NewOrderByDealer';
import { Activation } from '../pages/iccid/activate/Activatetion';
import { Statement } from '../pages/statement/Statement';
import { OrdersPendingDetails } from '../pages/orders/OrdersPendingDetails'
import { OrdersDetails } from '../pages/orders/OrdersDetails'
import { ClientsPending } from '../pages/clients/ClientsPending'
import { ConfirmRegister } from '../pages/login/ConfirmRegister';
import { ActivationManual } from '../pages/iccid/activate/ActivatetionManual';
import { ActivationManualClient } from '../pages/iccid/activate/ActivatetionManualClient';
// import { Streaming } from '../pages/streaming/Streaming';
import { StreamingManagement } from '../pages/streaming/StreamingManagement';
import { Actions } from '../pages/actions/Actions';
import { ConsumInf } from '../pages/actions/components/ConsumInf'
import { ChangePlan } from '../pages/actions/components/ChangePlan'
import { RechargeAction } from '../pages/actions/components/Recharge';
import { PorInAction } from '../pages/actions/components/PortInAction';
import { Invoices } from '../pages/actions/components/Invoices'
import { NewStreaming } from '../pages/streaming/NewStreaming';
import { PreRegister } from '../pages/preRegister/PreRegister';
import { PreOrder } from '../pages/preRegister/PreOrder';
// import { element } from 'prop-types';
import { ChangeChip } from '../pages/ChangeChip/ChangeChip';
import { BringNumber } from '../pages/portRequests/component/BringNumber'
import { ClientsDeleteds } from '../pages/clients/ClientsDeleteds'
import { ChangeDocument } from '../pages/ChangeDocument/ChangeDocument'
import { PortDoc } from '../components/PortDocs/PortDoc'

export function Router() {
  const [deferredPrompt, setDeferredPrompt] = useState();
  const [modalGuide, setModalGuide] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|macintosh/.test(userAgent);
  };

  const installApp = async () => {
    if (isIos()) {
      setModalGuide(true);
    } else {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      localStorage.setItem('appInstall', true);
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Fragment>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/subscribe'} element={<PreRegister />} />
          <Route path={'/subscribe/:id'} element={<PreRegister />} />
          <Route path={'/subscribe/client/:id'} element={<PreRegister />} />
          <Route path={'/register/:id'} element={<ConfirmRegister/>} />
          <Route path={'/updatePassword'} element={<ResetPassword />} />
          <Route path={'orders/pay/:id'} element={<PayOrder />} />
          <Route path={'orders/pay/pix/:id'} element={<PayOrderPix />} />
          <Route path={'orders/pay/credit/:id'} element={<PayOrderCredit />} />

          {/* USUÁRIO TEGG, REVENDA E CLIENTE */}
          <Route path='/*' element={<PrivateRoute />}>
            <Route
              path=''
              element={
                <AdminLayout
                  installApp={installApp}
                  modalGuide={modalGuide}
                  setModalGuide={setModalGuide}
                />
              }
            >
              <Route
                path={''}
                element={<DashBoard installApp={installApp} />}
              />
              <Route path={'orders'} element={<Orders />} />
              <Route path={'orders/:id'} element={<OrdersDetails />} />
              <Route path={'orders/new/chip'} element={<NewOrder />} />
              <Route path={'orders/new/esim'} element={<NewEsimOrder />} />
              <Route path={'orders/new'} element={<NewOrderNew />} />
              <Route path={'orders/pending'} element={<OrdersPending />} />
              <Route path={'orders/pending/:id'} element={<OrdersPendingDetails />} />
              <Route path={'orders/:id'} element={<OrdersDetails />} />
              <Route path={'preorder'} element={<PreOrder />} />
              <Route
                path={'orders/newbyclient'}
                element={<NewOrderByClient />}
              />

              <Route
                path={'orders/newbydealer'}
                element={<NewOrderByDealer />}
              />
              <Route path={'orders/edit/:id'} element={<EditIccids />} />
              <Route path={'iccids'} element={<Iccids />} />
              <Route path={'iccids/new'} element={<NewIccid />} />
              <Route path={'iccids/logged/link'} element={<ActivateIccid />} />
              <Route path={'activation'} element={<Activation />} />
              <Route path={'activation/manual'} element={<ActivationManual />} />
              <Route path={'activation/client/manual'} element={<ActivationManualClient />} />
              <Route path={'profile'} element={<Profile />} />
              <Route path={'streaming'} element={<NewStreaming />} />
              <Route path={'management/streaming'} element={<StreamingManagement/>} />
              <Route path={'recharge'} element={<Recharges />} />
              <Route path={'recharge/new'} element={<NewRecharge />} />
              <Route
                path={'iccids/new/spreadsheet'}
                element={<NewIccidSpreadsheet />}
              />
              <Route path={'recharge/pay/:id'} element={<PayRecharge />} />
              <Route
                path={'recharge/pay/credit/:id'}
                element={<PayRechargeCredit />}
              />
              <Route
                path={'recharge/pay/pix/:id'}
                element={<PayRechargePix />}
              />
              <Route path={'lines'} element={<Lines />} />
              <Route path={'lines/esim/:id'} element={<ActivateEsim />} />
              <Route path={'portRequests'} element={<PortRequests />} />
              <Route path={'portRequests/new'} element={<NewPortRequest />} />
              <Route path={'subscriptions'} element={<Subscriptions />} />
              <Route
                path={'subscriptions/new'}
                element={<NewSubscriptionClient />}
              />
              <Route path={'nfe'} element={<NFe />} />
              <Route path={'plans'} element={<Plans />} />
              <Route path={'plans/info'} element={<NewPlans />} />
              <Route path={'plans/new'} element={<NewPlans />} />
              <Route path={'plans/edit'} element={<NewPlans />} />
              <Route path={'agents'} element={<Clients />} />
              <Route path={'clients'} element={<Clients />} />
              <Route path={'clients/new'} element={<NewClient />} />
              <Route path={'clients/edit'} element={<NewClient />} />
              <Route path={'clients/pending'} element={<ClientsPending />} />
              <Route path={'clients/deleteds'} element={<ClientsDeleteds />} />
              <Route path={'salesforce'} element={<Resales />} />
              <Route path={'salesforce/details'} element={<ResalesDetails />} />
              <Route path={'salesforce/deleteds'} element={<ClientsDeleteds />} />
              <Route path={'salesforce/new'} element={<NewResales />} />
              <Route path={'salesforce/edit/:t'} element={<EditResales />} />
              <Route path={'products/'} element={<Products />} />
              <Route path={'products/new'} element={<NewProducts />} />
              <Route path={'products/edit'} element={<NewProducts />} />
              <Route path={'products/info'} element={<NewProducts />} />
              <Route path={'comissions'} element={<Comissions />} />
              <Route path={'statement'} element={<Statement />} />
              <Route path={'actions'} element={<Actions />} />
              <Route path={'actions/consum'} element={<ConsumInf />} />
              <Route path={'actions/changeplan'} element={<ChangePlan />} />
              <Route path={'actions/recharge'} element={<RechargeAction />} />
              <Route path={'actions/portin'} element={<PorInAction />} />
              <Route path={'actions/invoices'} element={<Invoices/>}/>
              <Route path={'actions/changechip'} element={<ChangeChip />} />
              <Route path={'actions/changedocument'} element={<ChangeDocument />} />
              <Route path={'actions/portDoc'} element={<PortDoc />} />
              <Route path={'bringnumber'} element={<BringNumber />} />
            </Route>
          </Route>
        </Fragment>
      </Routes>
    </>
  );
}
