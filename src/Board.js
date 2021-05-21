'use strict';

function isDict(something) {
	if (something === undefined)
		return false;
	return something.constructor == Object;
}

function convertCellCoordinatesToNumbers(cell_coords_names, cell) {
	for (const name of cell_coords_names)
		cell[name] = Number.parseInt(cell[name], 10);
	return cell;
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
	const {board, selectCell, selected_cell, cell_coords_names} = props;

	return (
		<div className="board">{
			board.map(
				cell =>
				<Cell
					key={cell.x + '_' + cell.y}
					{...cell}
					size={90}
					selectThisCell={() => selectCell(cell)}
					selected={isObjectsEqual(selected_cell, cell)}>
				</Cell>)
		}</div>
	);
}