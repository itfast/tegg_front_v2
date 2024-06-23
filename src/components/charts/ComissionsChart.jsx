/* eslint-disable react/prop-types */
import { useResizeDetector } from "react-resize-detector";
import { XAxis, YAxis, AreaChart, Area } from "recharts";

const data = [
	{
		name: "AGOSTO",
		FATURAMENTO: 4000,
		COMISSÃO: 2400,
		amt: 2400,
	},
	{
		name: "SETEMBRO",
		FATURAMENTO: 3000,
		COMISSÃO: 1398,
		amt: 2210,
	},
	{
		name: "OUTUBRO",
		uv: 2000,
		COMISSÃO: 9800,
		FATURAMENTO: 12290,
	},
	{
		name: "NOVEMBRO",
		uv: 2780,
		FATURAMENTO: 3908,
		COMISSÃO: 2000,
	},
	{
		name: "DEZEMBRO",
		FATURAMENTO: 7890,
		COMISSÃO: 4800,
		amt: 2181,
	},
	{
		name: "JANEIRO",
		COMISSÃO: 2390,
		FATURAMENTO: 3800,
		amt: 2500,
	},
	{
		name: "FEVEREIRO",
		uv: 3490,
		FATURAMENTO: 4300,
		COMISSÃO: 2100,
	},
	{
		name: "MARÇO",
		uv: 3490,
		FATURAMENTO: 4300,
		COMISSÃO: 2100,
	},
	{
		name: "ABRIL",
		uv: 2000,
		FATURAMENTO: 9800,
		COMISSÃO: 2290,
	},
	{
		name: "MAIO",
		COMISSÃO: 1890,
		FATURAMENTO: 4800,
		amt: 2181,
	},
	{
		name: "JUNHO",
		COMISSÃO: 3800,
		FATURAMENTO: 6000,
	},
	{
		name: "JULHO",
		COMISSÃO: 4300,
		FATURAMENTO: 8700,
	},
];

const CustomizedLabel = (props) => {
	const { value } = props;

	return (
		<g className="visible">
			<text
				x={props.viewBox.x}
				y={props.viewBox.y}
				fill="#111"
				style={{ textOverflow: "ellipsis" }}>
				{new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(value)}
			</text>
		</g>
	);
};

const CustomizedAxisTick = (props) => {
	const { x, y, payload } = props;

	return (
		<g transform={`translate(${x},${y})`}>
			<text
				style={{ fontSize: "0.8rem" }}
				x={0}
				y={0}
				dy={16}
				textAnchor="end"
				fill="#666"
				transform="rotate(-35)">
				{payload.value}
			</text>
		</g>
	);
};

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value}`}</p>
//         {/* <p className="intro">{getIntroOfPage(label)}</p> */}
//         <p className="desc">Anything you want can be displayed here.</p>
//       </div>
//     );
//   }

//   return null;
// };

export const ComissionsChart = () => {
	const { width, ref } = useResizeDetector();

	return (
		<div className="card2">
			<div className="card_title">
				<h4>{`HISTÓRICO DE COMISSÕES`}</h4>
			</div>
			<div id="chartContainer" className="flex center" ref={ref}>
				<AreaChart
					width={width - 20}
					// width={'100vw'}
					height={300}
					data={data}
					margin={{
						top: 30,
						// right: 30,
						// left: 20,
						bottom: 10,
					}}>
					{/* <CartesianGrid strokeDasharray='5 5' /> */}
					<XAxis
						dataKey="name"
						angle={-20}
						height={60}
						tick={<CustomizedAxisTick />}
					/>
					<YAxis />
					{/* <Tooltip content={<CustomTooltip />} /> */}
					{/* <Tooltip /> */}
					{/* <Legend stye={{marginTop: 50}} /> */}

					<Area
						dot
						type="monotone"
						dataKey="FATURAMENTO"
						stackId="1"
						stroke="#00D959"
						fill="#00D959"
						label={<CustomizedLabel />}
					/>
					<Area
						dot
						type="monotone"
						dataKey="COMISSÃO"
						stroke="#8884d8"
						fill="#8884d8"
						label={<CustomizedLabel />}>
						{/* <LabelList dataKey='COMISSÃO' content={renderCustomizedLabel} /> */}
					</Area>
					{/* <Bar dataKey='uv' fill='#82ca9d' /> */}
				</AreaChart>
			</div>
		</div>
	);
};
