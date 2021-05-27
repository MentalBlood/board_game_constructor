'use strict';

function composeExpressionWithParameters(expression, parameters) {
	const variables_defining = Object.keys(parameters).map(name => `const ${name} = ${parameters[name]};`).join('\n');
	return `${variables_defining};\n${expression}`;
}

function evaluate(expression) {
	return eval(expression);
}

function computeGeometry(cell_config, coordinates) {
	return cell_config.geometry.map(point => point.map(c => {
		if (typeof(c) === 'number')
			return c;
		if (typeof(c) !== 'string')
			return;
		const code_to_evaluate = composeExpressionWithParameters(c, coordinates);
		return evaluate(code_to_evaluate);
	}));
}

function composeSizedPoints(points, size) {
	return points.map(p => [size * p[0], size * p[1]]);
}

function computeCoordinate(expression, coordinates) {
	const values = Object.values(coordinates);
	const code_to_evaluate = composeExpressionWithParameters(expression, Object.assign({}, coordinates));
	return evaluate(code_to_evaluate);
}

function computeCellScreenSize(points) {
	return {
		'width': Math.max(...points.map(p => p[0])),
		'height': Math.max(...points.map(p => p[1]))
	}
}

function Cell(props) {
	const {cell_config, coordinates, size, figure, figure_image, player, selected, handleSelectThisCell} = props;
	console.log(figure_image)

	const points = computeGeometry(cell_config, coordinates);
	const sized_points = composeSizedPoints(points, size);

	const {width, height} = computeCellScreenSize(sized_points);

	const screen_x = computeCoordinate(cell_config.position.x, coordinates) * size;
	const screen_y = computeCoordinate(cell_config.position.y, coordinates) * size;

	return <div className={"cell" + (selected ? " selected" : "")} style={{
				'width': `${width}px`,
				'height': `${height}px`,
				'transform': `translate(${screen_x}px, ${screen_y}px)`
			}}>
		<svg style={{
				'width': '100%',
				'height': '100%'
			}}
			xmlns="http://www.w3.org/2000/svg" version="1.1"
			onClick={handleSelectThisCell}>
			<polygon fill={cell_config.colors[player].cell} points={sized_points.join(' ')}></polygon>
			<text style={{fontSize: `${height / 5}px`}} className='unselectable' y={height / 5 * 2} fill={cell_config.colors[player].text}>
				<tspan x={width / 3}>{Object.values(coordinates).join(', ')}</tspan>
				<tspan x={width / 8} dy={height / 5 * 2}>{figure}</tspan>
			</text>
		</svg>
	</div>
}