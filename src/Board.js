'use strict';

function Board(props) {
	return (
		<div className="board">{
			props.board.map(
				cell =>
				<Cell
					key={cell.x + '_' + cell.y}
					{...cell}
					size={90}>
				</Cell>)
		}</div>
	);
}