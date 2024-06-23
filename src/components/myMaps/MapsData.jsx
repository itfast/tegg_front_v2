/* eslint-disable react/prop-types */
// import React from 'react';
import { useLoadScript } from "@react-google-maps/api";
import Mapas from "./Maps";

const libraries = ["places"];

export const MapsData = (props) => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: "AIzaSyByz0iHkuLg5OFgqMAPOvFfIY6QMJ8SnSk",
		libraries,
	});
	// AIzaSyCo4SdCpgGhMIMDbtNnmsit1MjiHYp6gyY
	// googleMapsApiKey: 'AIzaSyByz0iHkuLg5OFgqMAPOvFfIY6QMJ8SnSk',
	// AIzaSyD3eCb3REvnfTWLSWqvEkb4FAkbSfrZR-k

	if (loadError) return "Erro ao carregar mapa";
	if (!isLoaded) return "Carregando mapa";

	return (
		<Mapas
			zoom={props.zoom}
			markerClick={props.markerClick}
			position={props.position}
			markers={props.markers}
			type={props.type}
			display={props.display}
			components={props.components}>
			{props.children}
		</Mapas>
	);
};
