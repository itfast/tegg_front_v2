/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom';
// import Header from '../../Header/Header';

import { LayoutContainer, OutletContainer } from './AdminStyles';
// import MenuAdmin from './Menus/MenuAdmin';
import { Header } from './Headers';
import { useState, useEffect } from 'react';
// import { Menu } from './Menus/Index';
import { SideBar } from './SideBar/Index';
import { ModalInstall } from '../modalInstall/ModalInstall';
import { ModalGuideInstall } from '../modalInstall/ModalGguideInstall';
import { SideBarMobile } from './SideBarMobile/Index';
import { HeaderMobile } from './HeaderMobile';
// import api from '../../../services/api';

export function AdminLayout({ installApp, setModalGuide, modalGuide }) {
  const [open, setOpen] = useState(false);
  const [has, setHas] = useState(0);
  const [showModal, setShowModal] = useState(false);
  // const [showModal1, setShowModal1] = useState(false);
  // const [open, setOpen] = useState(
  // 	localStorage.getItem("menu") === "true" ? true : false
  // );
  // const [windowWidth, setWindowWidth] = useState(getCurrentDimension());

  const handleInstall = () => {
    installApp();
    setShowModal(false);
  };

  // function getCurrentDimension() {
  //   return window.innerWidth;
  // }

  useEffect(() => {
    if (window.innerWidth < 768) {
      const app = localStorage.getItem('appInstall');
      if (!app) {
        setShowModal(true);
      } else if (app === 'false') {
        setShowModal(true);
      }
    }
  }, []);

  // useEffect(() => {
  // 	const updateDimension = () => {
  // 		const dimension = getCurrentDimension();
  // 		// console.log(dimension);
  // 		setWindowWidth(dimension);
  // 		if (dimension <= 700) setOpen(false);
  // 	};
  // 	window.addEventListener("resize", updateDimension);

  // 	return () => {
  // 		window.removeEventListener("resize", updateDimension);
  // 	};
  // }, [windowWidth]);

  return (
    <LayoutContainer>
      <ModalInstall
        showModal={showModal}
        setShowModal={setShowModal}
        installApp={handleInstall}
      />

      <ModalGuideInstall showModal={modalGuide} setShowModal={setModalGuide} />

      {screen.width < 768 ? (
        <>
          <HeaderMobile open={open} setOpen={setOpen} has={has} />
          <SideBarMobile open={open} setOpen={setOpen} setHas={setHas} />
        </>
      ) : (
        <>
          <Header open={open} setOpen={setOpen} />
          <SideBar open={open} setOpen={setOpen} />
        </>
      )}

      {screen.width < 768 ?
        !open ? (
          <OutletContainer open={open}>
            <Outlet />
          </OutletContainer>
        ):(
          <></>
        ):(
          <OutletContainer open={open}>
            <Outlet />
          </OutletContainer>
        )}
    </LayoutContainer>
  );
}
