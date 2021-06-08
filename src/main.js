/** @jsx h */
const { h } = preact;

class Root extends preact.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		window.addEventListener('resize', () => this.forceUpdate());
		this.game = new Game(this.setState.bind(this));
	}

	render() {
		if (!this.game)
			return null;
		const unpacked_board = this.state.config ? 
			composeUnpackedBoard(this.state.board, this.state.config.cell.coordinates_names)
			: undefined;
		const board_rotation_angle = this.state.config?.board.rotation_angle[this.game.getCurrentPlayer()];
		return (<div className='app' ref={this._ref}>
		{
			this.state.config ? 
			<div className="gameUI">
				<Board
					resources={this.state.config.resources}
					board={unpacked_board}
					rotation_angle={board_rotation_angle}
					cell_config={this.state.config.cell}
					handleSelectCell={this.game.handleSelectCell.bind(this.game)}
					selected_cell={this.state.selected_cell}
					highlighted_cells={this.state.highlighted_cells || {}}
					coordinates_names={this.state.config.cell.coordinates_names}></Board>
				<div className="gameState unselectable">{this.state.current_move} {this.state.game_state.replaceAll('_', ' ')}</div>
			</div>
			: null
		}
			<div className='config'>
				<textarea className='configText'
					value={this.state.config_text}
					onInput={this.game.handleConfigTextChange.bind(this.game)}></textarea>
				<select className='configsList' 
					value={this.state.config?.name} 
					onInput={this.game.handleGameNameSelectChange.bind(this.game)}>
					{Object.keys(configs).map(name => (
						<option key={name} value={name}>{name}</option>
					))}
				</select>
				<button className="uploadConfigButton unselectable"
					onClick={this.game.uploadConfig.bind(this.game)}>upload config</button>
				<button className='compileButton unselectable'
					onClick={this.game.compile.bind(this.game)}>compile</button>
				<button className="downloadConfigButton unselectable"
					onClick={this.game.downloadConfig.bind(this.game)}>download config</button>
			</div>
		</div>);
	}
}

const configs_names_available_from_server = [
	'chess',
	'checkers',
	'intellector'
]

let configs = {};

function loadConfigs() {
	return Promise.all(
		configs_names_available_from_server.map(
			name =>
			fetch(`config/${name}.json`)
			.then(response => response.text())
			.then(text => configs[name] = text)
		)
	);
}

const rootElement = document.getElementById('root');
loadConfigs().then(() => preact.render(<Root></Root>, rootElement));