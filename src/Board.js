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

function Board(props) {
	const {cell_config, board, handleSelectCell, selected_cell} = props;
	// console.log('Board', board.filter(cell => isObjectsEqual(cell.coordinates, {'x': 4, 'y': 0})));

	return (
		<div className="board">{
			board.map(
				cell =>
				<Cell
					key={Object.values(cell.coordinates).join('_')}
					{...cell}
					cell_config={cell_config}
					size={300}
					handleSelectThisCell={() => handleSelectCell(cell)}
					selected={isObjectsEqual(selected_cell, cell)}>
				</Cell>)
		}</div>
	);
}