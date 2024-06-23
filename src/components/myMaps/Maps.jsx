/* eslint-disable react/prop-types */
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

function Mapas(props) {
	const {t} = useTranslation()
	const [data] = useState("");
	const center = {
		lat: props.position ? Number(props.position.lat) : -15.0715712,
		lng: props.position ? Number(props.position.lng) : -57.880627,
	};

	// lat: props.position ? Number(props.position.lat) : -15.0715712,
	// lng: props.position ? Number(props.position.lng) : -63.880627,
	// 12.516484, -43.838641

	// const [state] = useState(true);
	const inputFile = useRef(null);
	const [onUpload, setOnUpload] = useState("");
	const [uploadResult, setUploadResult] = useState("1");
	const [locate] = useState(-23.1542562);

	const [markersI, setMarkersI] = useState([]);

	// const history = useHistory();

	useEffect(() => {
		if (props.markers) {
			// console.log(props.markers);
			const listMarkers = [];
			props.markers.forEach((m) => {
				listMarkers.push({
					lat: Number(m.lati),
					lng: Number(m.longi),
					loc: m.loc,
					tup_1: m.tup_1,
					userLat: m.userLat,
					userLng: m.userLng,
					numSerie: m.id || null,
					status: m.status,
					qtd: m.qtd,
					uf: m.uf,
				});
			});
			setMarkersI(listMarkers);
		}
	}, [props.markers]);

	async function uploadFile() {
		data.append("map", onUpload[0]);
		setUploadResult(true);
	}

	useEffect(() => {
		if (onUpload) {
			uploadFile();
		}
	}, [onUpload]);

	const closeFile = () => {
		setUploadResult("");
		setOnUpload(inputFile.current.files);
	};

	const mapContainerStyle = {
		width: "auto",
		height: props.display || "50vh",
	};

	const options = {
		disableDefaultUI: false,

		streetViewControl: false,
		// fullscreenControl: false,
		zoomControl: true,
		zoomControlOptions: {
			position: 3,
		},
	};

	const [selected, setSelected] = useState(null);

	const mapRef = useRef();
	const onMapLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const clickMarker = (marker) => {
		if (props.markerClick) {
			setSelected(marker);
			// history.push(routing.GatewaysDetails(marker.numSerie));
		} else {
			setSelected(marker);
		}
	};

	return (
		<div className="col-lg-12 col-12">
			{locate ? null : (
				<div className="progress">
					<h1>CircularProgress</h1>
				</div>
			)}
			{uploadResult ? null : (
				<div className="progress">
					<h1>CircularProgress</h1>
				</div>
			)}

			<input
				type="file"
				id="file"
				ref={inputFile}
				style={{ display: "none" }}
				onChange={closeFile}
			/>

			<GoogleMap
				id="map"
				mapContainerStyle={mapContainerStyle}
				zoom={props.zoom || 15}
				center={center}
				options={options}
				// onClick={onMapClick}
				onLoad={onMapLoad}>
				{markersI.map((marker, i) => (
					<Marker
						key={i}
						position={{ lat: marker.lat, lng: marker.lng }}
						onClick={() => {
							clickMarker(marker);
						}}
						icon={{
							url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
						}}
					/>
				))}
				{selected ? (
					<InfoWindow
						position={{ lat: selected.lat, lng: selected.lng }}
						onCloseClick={() => {
							setSelected(null);
						}}>
						<div>
							<p style={{ color: "#000" }}>
								{`${t('Metrics.totalClientsForRegion')} ${selected.uf}: ${selected.qtd}`}
							</p>
						</div>
					</InfoWindow>
				) : null}
			</GoogleMap>
		</div>
	);
}

export default Mapas;
