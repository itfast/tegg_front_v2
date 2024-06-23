import { useEffect, useState } from "react";
import { PageLayout } from "../../../../globalStyles";
import { ProductsData } from "./ProductsData";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import { translateError } from "../../../services/util";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const NewProducts = () => {
	const {t} = useTranslation()
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState(false);

	const [product, setProduct] = useState({
		Name: "",
		Description: "",
		Technology: "",
		Version: "",
		Amount: "",
		SurfId: "",
		PlayHubId: "",
		CFOP: "",
		EAN: "",
		NCM: "",
		CEST: "",
		ICMSCst: "",
		ICMSAliquot: "",
		IPICst: "",
		IPIEnqCode: "",
		IPIAliquot: "",
		PISCst: "",
		PISAliquot: "",
		COFINSCst: "",
		COFINSAliquot: "",
	});

	useEffect(() => {
		if (api.currentUser.AccessTypes[0] !== "TEGG") {
			api.user
				.logout()
				.then(() => {
					navigate("/login");
				})
				.catch((err) => {
					console.log(err);
				});
		}
		if (location?.state?.product) {
			setProduct(location?.state?.product);
		}
		if (location.pathname === "/products/info") {
			setInfo(true);
		}
	}, []);

	const handleNext = () => {
		setLoading(true);
		if (location?.pathname === "/products/edit") {
			api.product
				.update(product, product.Id)
				.then((res) => {
					toast.success(res.data.Message);
					navigate("/products");
				})
				.catch((err) => translateError(err))
				.finally(() => setLoading(false));
		} else {
			api.product
				.add(product)
				.then((res) => {
					// console.log(res);
					toast.success(res.data.Message);
					navigate("/products");
				})
				.catch((err) => {
					translateError(err);
				})
				.finally(() => setLoading(false));
		}
	};

	const goBack = () => {
		navigate("/products");
	};

	return (
		<PageLayout>
			<h2 style={{ color: "#7c7c7c", textAlign: "center" }}>
				{location?.pathname === "/products/edit"
					? t('Products.modalProducts.labelUpdate')
					: location?.pathname === "/products/info"
					? t('Products.modalProducts.labelDetails')
					: t('Products.modalProducts.labelNew')}
			</h2>
			<ProductsData
				loading={loading}
				info={info}
				goStep={handleNext}
				goBackStep={goBack}
				product={product}
				setProduct={setProduct}
				label={t('Products.modalProducts.labelModal')}
			/>
		</PageLayout>
	);
};
