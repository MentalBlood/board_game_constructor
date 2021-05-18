'use strict';

function Cell(props) {
	const x = props.x;
	const y = props.y;
	const width = props.width;

	const points = `
		${width},				${width / 2}
		${width / 300 * 225},	${width / 300 * 280}
		${width / 300 * 75},	${width / 300 * 280}
		0,						${width / 2}
		${width / 300 * 75},	${width / 300 * 20}
		${width / 300 * 225},	${width / 300 * 20}
	`;

	return <svg className="cell" style={{
			'width': width + 'px',
			'height': 280 / 300 * width + 'px',
			'left': x * 260 / 300 * width + 'px',
			'top': y * width + x * width / 2 + 'px'
		}}
		xmlns="http://www.w3.org/2000/svg" version="1.1">
		<polygon fill="white" points={points}></polygon>
		<text x="30" y="50" fill="black">{x}, {y}</text>
	</svg>
}