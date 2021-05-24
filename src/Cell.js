'use strict';

const cell = {
	'geometry': [
		[0.3,	0.15],
		[0.225,	0.28],
		[0.075,	0.28],
		[0,		0.15],
		[0.075,	0.02],
		[0.225,	0.02],
	]
};

function composeSizedCellPolygonArgs(size, points) {
	const sized_points = []
	for (const p of points)
		sized_points.push(`${size * p[0]}, ${size * p[1]}`);
	return sized_points.join(' ')
}

function Cell(props) {
	const {x, y, size, figure, player, selected, handleSelectThisCell} = props;
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

	const sized_points = composeSizedCellPolygonArgs(size, cell.geometry)

	return <svg className={"cell" + (selected ? " selected" : "")} style={{
			'width': size * 0.3 + 'px',
			'height': 0.28 * size + 'px',
			'left': x * 0.225 * size + 'px',
			'top': (y * size + x * size / 2) * 0.26 + 'px'
		}}
		xmlns="http://www.w3.org/2000/svg" version="1.1"
		onClick={handleSelectThisCell}>
		<polygon fill={colors.cell} points={sized_points}></polygon>
		<text className='unselectable' y="40" fill={colors.text}>
			<tspan x="30" dy="0">{x}, {y}</tspan>
    		<tspan x="10" dy="20px">{figure}</tspan>
    	</text>
	</svg>
}