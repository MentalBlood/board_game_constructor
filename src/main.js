'use strict'

class Root extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'config_text': undefined,
			'config': {
				'board': [],
				'cell': ['x', 'y'],
				'figures': {
					"defensor": {
						"movement": [
							{
								"x": 1,
								"also_reversed": true
							},
							{
								"y": 1,
								"also_reversed": true
							},
							{
								"x": 1,
								"y": -1,
								"also_reversed": true
							}
						]
					},
					"dominator": {
						"movement": [
							{
								"x": 1,
								"repeat": true,
								"also_reversed": true
							},
							{
								"y": 1,
								"repeat": true,
								"also_reversed": true
							},
							{
								"x": 1,
								"y": -1,
								"repeat": true,
								"also_reversed": true
							}
						]
					},
					"aggressor": {
						"movement": [
							{
								"x": 1,
								"y": 1,
								"repeat": true,
								"also_reversed": true
							},
							{
								"x": 1,
								"y": -1,
								"repeat": true,
								"also_reversed": true
							},
							{
								"x": -1,
								"y": 1,
								"repeat": true,
								"also_reversed": true
							}
						]
					}
				}
			}
		}

		for (let x = 0; x < 9; x++)
			for (let y = 0 - Math.floor(x / 2); y < 7 - x % 2 - Math.floor(x / 2); y++)
				this.state.config.board.push({'x': x, 'y': y});

		this.state.config_text = JSON.stringify(this.state.config);
	}

	onConfigTextChange(e) {
		const new_text = e.target.value;
		this.setState({'config_text': new_text});
	}

	compile() {
		this.setState({'config': JSON.parse(this.state.config_text)});
	}

	render() {
		return (<div className="app">
			<Board board={this.state.config.board}></Board>
			<div className="config">
				<textarea className="configText"
					value={JSON.stringify(this.state.config, null, '\t')}
					onChange={this.onConfigTextChange.bind(this)}></textarea>
				<button className="compileButton"
					onClick={this.compile.bind(this)}>compile</button>
			</div>
		</div>);
	}
}

const rootElement = document.getElementById('root');
ReactDOM.render(React.createElement(Root), rootElement);