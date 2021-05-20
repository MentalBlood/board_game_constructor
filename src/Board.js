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
	const {board, selectCell, selected_cell} = props;
	const c = board.filter(c => c.x == 3 && c.y == 3)[0];

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