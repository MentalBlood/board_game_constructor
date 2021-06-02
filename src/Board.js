'use strict';

function isDict(something) {
	if (something === undefined)
		return false;
	return something.constructor == Object;
}

function isObjectsEqual(object1, object2) {
	if (!isDict(object1) || !isDict(object2))
		return false;
	for (const key in object1)
		if (object1[key] !== object2[key]) 
			return false;
	return true;
}

function computeBoardSize(cell_config, board) {
	const cells = board.map(cell => {
		const result = {
			'x': evaluateExpressionWithParameters(cell_config.position.x, cell.coordinates),
			'y': evaluateExpressionWithParameters(cell_config.position.y, cell.coordinates)
		};
		const geometry = computeGeometry(cell_config, cell.coordinates);
		Object.assign(result, computeCellScreenSize(geometry));
		return result;
	});
	const cell_max_x_point = Math.max(...cells.map(c => c.x + c.width));
	const cell_max_y_point = Math.max(...cells.map(c => c.y + c.height));
	return {
		'width': cell_max_x_point,
		'height': cell_max_y_point
	};
}

function Board(props) {
	const {cell_config, resources, board, rotation_angle, handleSelectCell, selected_cell, highlighted_cells, figure_image} = props;
	const required_board_size = {
		'width': window.innerWidth * 0.46,
		'height': window.innerHeight * 0.86
	};
	const base_board_size = computeBoardSize(cell_config, board);
	const cell_size = Math.min(
		required_board_size.width / base_board_size.width,
		required_board_size.height / base_board_size.height);
	const board_size = {
		'width': cell_size * base_board_size.width,
		'height': cell_size * base_board_size.height
	};

	return (
		<div className="board" style={{
			'width': `${board_size.width}px`,
			'height': `${board_size.height}px`,
			'transform': `rotate(${rotation_angle}deg)`
		}}>{
			board.map(
				cell =>
				<Cell
					key={Object.values(cell.coordinates).concat([cell.figure]).join('_')}
					{...cell}
					resources={resources}
					cell_config={cell_config}
					size={cell_size}
					figure_rotation_angle={-rotation_angle}
					handleSelectThisCell={() => handleSelectCell(cell)}
					selected={isObjectsEqual(selected_cell, cell)}
					highlighted={highlighted_cells[Object.values(cell.coordinates).join('_')]}>
				</Cell>)
		}</div>
	);
}