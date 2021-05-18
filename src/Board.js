'use strict';

function Board(props) {
	return (
		<div className="board">{
			props.board.map(
				cell =>
				<Cell
					key={cell.x + '_' + cell.y}
					x={cell.x}
					y={cell.y}
					width={90}>
				</Cell>)
		}</div>
	);
}