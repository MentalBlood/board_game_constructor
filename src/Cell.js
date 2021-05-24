'use strict';

function composeCellPolygon(cell_config, size, player) {
	const sized_points = [];
	for (const point of cell_config.geometry)
		sized_points.push(`${size * point[0]}, ${size * point[1]}`);
	const points_arg = sized_points.join(' ');
	return <polygon fill={cell_config.colors[player].cell} points={points_arg}></polygon>;
}

function computeCoordinate(expression, coordinates, size) {
	const values = Object.values(coordinates);
	const variables_defining = Object.keys(coordinates).map(name => `const ${name} = coordinates.${name};`).join('\n');
	const result = eval(`${variables_defining};\n${expression}`);
	// console.log('result', result);
	return result;
}

function Cell(props) {
	const {cell_config, coordinates, size, figure, player, selected, handleSelectThisCell} = props;

	const width = Math.max(...cell_config.geometry.map(point => point[0])) * size;
	const height = Math.max(...cell_config.geometry.map(point => point[1])) * size;

	const screen_x = computeCoordinate(cell_config.position.x, coordinates, size);
	const screen_y = computeCoordinate(cell_config.position.y, coordinates, size);

	return <svg className={"cell" + (selected ? " selected" : "")} style={{
			'width': width + 'px',
			'height': height + 'px',
			'transform': `translate(${screen_x + 'px'}, ${screen_y + 'px'})`
		}}
		xmlns="http://www.w3.org/2000/svg" version="1.1"
		onClick={handleSelectThisCell}>
		{composeCellPolygon(cell_config, size, player)}
		<text className='unselectable' y={size / 10} fill={cell_config.colors[player].text}>
			<tspan x={size / 10} dy="0">{Object.values(coordinates).join(', ')}</tspan>
    		<tspan x={size / 10 / 3} dy={size / 10 / 3 * 2}>{figure}</tspan>
    	</text>
	</svg>
}