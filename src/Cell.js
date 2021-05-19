'use strict';

function Cell(props) {
	const {x, y, size, figure, player, selected, selectThisCell} = props;
	const colors = {
		'white': {
			'cell': 'white',
			'text': 'black'
		},
		'black': {
			'cell': 'black',
			'text': 'white'
		},
		undefined: {
			'cell': 'darkgrey',
			'text': 'black'
		}
	}[player];

	const points = `
		${size},				${size / 2}
		${size / 300 * 225},	${size / 300 * 280}
		${size / 300 * 75},		${size / 300 * 280}
		0,						${size / 2}
		${size / 300 * 75},		${size / 300 * 20}
		${size / 300 * 225},	${size / 300 * 20}
	`;

	return <svg className={"cell" + (selected ? " selected" : "")} style={{
			'width': size + 'px',
			'height': 280 / 300 * size + 'px',
			'left': x * 260 / 300 * size + 'px',
			'top': y * size + x * size / 2 + 'px'
		}}
		xmlns="http://www.w3.org/2000/svg" version="1.1"
		onClick={selectThisCell}>
		<polygon fill={colors.cell} points={points}></polygon>
		<text className='unselectable' y="40" fill={colors.text}>
			<tspan x="30" dy="0">{x}, {y}</tspan>
    		<tspan x="10" dy="20px">{figure}</tspan>
    	</text>
	</svg>
}