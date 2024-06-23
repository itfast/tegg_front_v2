import { CardData, InputData } from "../Resales.styles";

export const Address = () => {
	return (
		<CardData>
			<h3>ENDEREÇO</h3>
			<InputData type="text" placeholder="CEP" />
			<InputData type="text" placeholder="ENDEREÇO" />
			<InputData type="text" placeholder="NÚMERO" />
			<InputData type="text" placeholder="COMPLEMENTO" />
			<InputData type="text" placeholder="BAIRRO" />
			<InputData type="text" placeholder="CIDADE" />
			<InputData type="text" placeholder="UF" />
		</CardData>
	);
};

// // ENDEREÇO
//   PostalCode            String
//   State                 String
//   City                  String
//   District              String
//   Number                String
//   Complement            String?
