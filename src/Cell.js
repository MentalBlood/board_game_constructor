'use strict';

function composeExpressionWithParameters(expression, parameters) {
	const letiables_defining = Object.keys(parameters).map(name => `const ${name} = ${parameters[name]};`).join('\n');
	return `${letiables_defining};\n${expression}`;
}

function evaluate(expression) {
	return eval(expression);
}

function evaluateExpressionWithParameters(expression, parameters) {
	return eval(composeExpressionWithParameters(expression, parameters));
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

function computeCellScreenSize(points) {
	return {
		'width': Math.max(...points.map(p => p[0])),
		'height': Math.max(...points.map(p => p[1]))
	}
}

const default_cell_colors = {
	'fill': '"darkgrey"',
	'selector': '"skyblue"'
}

function composeZoomedGeometry(points, factor) {
	const center = points.reduce((acc, curr) => [
		acc[0] + curr[0],
		acc[1] + curr[1]
	]).map(c => c / points.length);
	return points.map(p => [
		center[0] + factor * (p[0] - center[0]),
		center[1] + factor * (p[1] - center[1])
	]);
}

function Cell(props) {
	const {cell_config, resources, coordinates, size, figure_rotation_angle, figure, player, selected, handleSelectThisCell} = props;

	const points = computeGeometry(cell_config, coordinates);
	const sized_points = composeSizedPoints(points, size);
	const zoomed_sized_points = selected ? composeZoomedGeometry(sized_points, 0.85) : sized_points;

	const {width, height} = computeCellScreenSize(sized_points);

	const screen_x = evaluateExpressionWithParameters(cell_config.position.x, coordinates) * size;
	const screen_y = evaluateExpressionWithParameters(cell_config.position.y, coordinates) * size;

	const colors = Object.assign({}, default_cell_colors, cell_config.colors || {});
	Object.keys(colors).map(type => 
		colors[type] = evaluateExpressionWithParameters(colors[type], coordinates));

	let figure_image = undefined;
	if (resources?.images?.figures)
		if (resources?.images?.figures[player])
			figure_image = resources?.images?.figures[player][figure];

	return <div className="cellWithFigure" style={{
				'width': `${width}px`,
				'height': `${height}px`,
				'transform': `translate(${screen_x}px, ${screen_y}px)`
			}}>
		<svg className='cell' style={{
				'width': '100%',
				'height': '100%'
			}}
			xmlns="http://www.w3.org/2000/svg" version="1.1"
			onClick={handleSelectThisCell}>
			{
				selected ? 
				<polygon fill={colors.selector} points={sized_points.join(' ')}></polygon>
				: null
			}
			<polygon fill={colors.fill} points={zoomed_sized_points.join(' ')}></polygon>
		</svg>
		{
			figure ? 
			<img className='figure' style={{
					'transform': `rotate(${figure_rotation_angle}deg)`
				}}
				src={figure_image}
				alt={`${player} ${figure}`} 
				draggable={false}
				onClick={handleSelectThisCell}></img> 
			: null
		}
	</div>
}