import { useState, useEffect } from "react";
import {
	ContainerBodyLogin,
	ContainerFormLogin,
	ContainerImageLogin,
	ContainerLogin,
	FormLogin,
	InputLogin,
	InputPassSignUp,
} from "./ResetPassword.styles";
import ReactLoading from "react-loading";
import { Button } from "../../../globalStyles";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { translateError } from "../../services/util";
import { toast } from "react-toastify";
import { decodeToken, isExpired } from "react-jwt";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
export const ResetPassword = () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const [loading, setLoading] = useState(false);
	const [expired, setExpired] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [typePass, setTypePass] = useState("password");
	const [password2, setPassword2] = useState("");
	const [typePass2, setTypePass2] = useState("password");
	const navigate = useNavigate();

	const handleTypePass = () => {
		setTypePass(typePass === "password" ? "text" : "password");
	};

	const handleTypePass2 = () => {
		setTypePass2(typePass2 === "password" ? "text" : "password");
	};

	const handleReset = (e) => {
		e.preventDefault();
		if (password !== "") {
			if (password.length >= 8) {
				if (password === password2) {
					setLoading(true);
					api.user
						.updatePassword(email, password)
						.then((res) => {
							toast.success(res.data.Message);
							setPassword("");
							setPassword2("");
							navigate("/login");
						})
						.catch((err) => {
							translateError(err);
						})
						.finally(() => setLoading(false));
				} else {
					toast.error("As duas senhas devem ser iguais");
				}
			} else {
				toast.error("A senha deve ter no mínimo 8 caracteres");
			}
		} else {
			toast.error("Insira uma nova senha");
		}
	};

	useEffect(() => {
		const param = urlSearchParams.get("param");
		// if (!isExpired(param)) {
			const decoded = decodeToken(param);
			setEmail(decoded.Email);
			// console.log(decoded);
		// } else {
		// 	setExpired(true);
		// }
	}, []);

	return (
		<ContainerBodyLogin>
			<ContainerLogin>
				<ContainerImageLogin>
					<img
						src={"/assets/tegg.jpg"}
						style={{ width: "100%", height: "100%", backgroundSize: "cover" }}
					/>
				</ContainerImageLogin>

				<ContainerFormLogin>
					{expired ? (
						<div
							style={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								textAlign: "center",
								justifyContent: "center",
								gap: 40,
							}}>
							<h2>
								O link já expirou ou é inválido, por favor solicite um novo link
								ou verifique a URL e tente novamente.
							</h2>
							<Button
								style={{ width: "100%", marginTop: 10 }}
								onClick={() => navigate("/login")}>
								VOLTAR
							</Button>
						</div>
					) : (
						<>
							<h1>Alterar senha</h1>
							<FormLogin>
								<form onSubmit={handleReset} style={{ width: "100%" }}>
									<InputPassSignUp>
										<InputLogin
											type={typePass}
											name="resetPass"
											placeholder="Nova senha"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
										{password &&
											(typePass === "password" ? (
												<LiaEyeSolid
													className="eyes"
													onClick={handleTypePass}
													size={25}
												/>
											) : (
												<LiaEyeSlash
													className="eyes"
													onClick={handleTypePass}
													size={25}
												/>
											))}
									</InputPassSignUp>
									<InputPassSignUp>
										<InputLogin
											type={typePass2}
											name="resetPass"
											placeholder="Insira a senha novamente"
											value={password2}
											onChange={(e) => setPassword2(e.target.value)}
										/>
										{password2 &&
											(typePass2 === "password" ? (
												<LiaEyeSolid
													className="eyes"
													onClick={handleTypePass2}
													size={25}
												/>
											) : (
												<LiaEyeSlash
													className="eyes"
													onClick={handleTypePass2}
													size={25}
												/>
											))}
									</InputPassSignUp>

									<Button
										// nothover={loading.toString()}
										type="submit"
										// onClick={handleLogin}
										style={{ width: "100%", marginTop: 10 }}>
										{loading ? (
											<div
												style={{ display: "flex", justifyContent: "center" }}>
												<ReactLoading type={"bars"} color={"#fff"} />
											</div>
										) : (
											"ATUALIZAR"
										)}
									</Button>
									<Button
										style={{ width: "100%", marginTop: 10 }}
										onClick={() => navigate("/login")}>
										VOLTAR
									</Button>
								</form>
							</FormLogin>
						</>
					)}
				</ContainerFormLogin>
			</ContainerLogin>
		</ContainerBodyLogin>
	);
};
