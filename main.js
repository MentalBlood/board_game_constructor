"use strict";function getAllElementsWithDepth_(t,e,s,o){for(const i of Object.keys(t)){const n=Number.parseInt(i,10),a=t[n],c=o.concat([n]);0===e?s.push({keys:c,element:a}):getAllElementsWithDepth_(a,e-1,s,c)}}function getAllElementsWithDepth(t,e){const s=[];return getAllElementsWithDepth_(t,e,s,[]),s}function dictFromTwoLists(t,e){const s={};for(let o=0;o<t.length;o++)s[t[o]]=e[o];return s}function matchDict(t,e){for(const s in e)if("object"==typeof t[s]){if(!matchDict(t[s],e[s]))return!1}else if(t[s]!=e[s])return!1;return!0}function joinDicts(t,e){const s=Object.assign({},t);for(const t in e){if(s[t]){if(Array.isArray(s[t])&&Array.isArray(e[t])){s[t].push.apply(s[t],e[t]);continue}if(isDict(s[t])&&isDict(e[t])){s[t]=joinDicts(s[t],e[t]);continue}}s[t]=e[t]}return s}const configs_names_available_from_server=["chess","checkers","intellector"];let configs={};function loadConfigs(){return Promise.all(configs_names_available_from_server.map((t=>fetch(`config/${t}.json`).then((t=>t.text())).then((e=>configs[t]=e)))))}class Root extends React.Component{constructor(t){super(t),this.state={board:void 0,game_state:void 0,game_statistics:{current_move:void 0},selected_cell:void 0,config_text:void 0,config:void 0},this.actions={swap:({from_cell:t,to_cell:e,board:s})=>{this.setCellByCoordinates(t.coordinates,Object.assign({},e),s),this.setCellByCoordinates(e.coordinates,Object.assign({},t),s)},move:({from_cell:t,to_cell:e,board:s})=>{t.last_move=this.state.game_statistics.current_move;const o=t.coordinates;this.setCellByCoordinates(e.coordinates,t,s),this.setCellEmpty(o,s)},take:({from_cell:t,to_cell:e,board:s})=>{this.setCellEmpty(e.coordinates,s)},replace:({from_cell:t,board:e,parameters:s})=>{this.setCellByCoordinates(t.coordinates,Object.assign(t,{figure:s.new_figure}),e)}},this.values_computers={is_cell:({cell:t})=>Boolean(t),is_enemy:({cell:t,from_cell:e})=>void 0!==(null==t?void 0:t.player)&&(null==t?void 0:t.player)!=(null==e?void 0:e.player),is_figure:({cell:t})=>void 0!==(null==t?void 0:t.player),moves_after_last_move:({from_cell:t})=>this.state.game_statistics.current_move-t.last_move},this.entities_getters={cell:t=>this.composeUnpackedBoard(this.state.config.cell.coordinates_names,t)},this.conditions_types={exists:t=>Boolean(t.length)},this.state_effects={next_move:t=>(t.current_move+=1,t)},this.state_data_getters={check_win:t=>{const e=this.getCurrentPlayer(),s=this.state.config.win_conditions[e];for(const e of s){const s=this.entities_getters[e.entity](t).filter((t=>matchDict(t,e.filter)));if(this.conditions_types[e.type](s)===e.result)return!0}return!1}},this.game_state_passiveness_by_type={move:"active",check_win:"passive",next_move:"passive",end:"active"},this._ref=React.createRef()}setConfigForGame(t){this.setState(this.compile_(t.replaceAll("\t","   ")),(()=>this.startGame()))}setLoadedConfig(t){this.setConfigForGame(configs[t])}componentDidMount(){window.addEventListener("resize",this.handleResize.bind(this)),this.setLoadedConfig("chess")}handleResize(){this.forceUpdate()}startGame(){this.setState((t=>({game_statistics:{current_move:1},game_state:this.state.config.initial_game_state})))}setGameState(t){this.state.config.game_states[t]&&this.setState((e=>({game_state:t})))}composeDictWithCoordinates(t){const e=this.state.config.cell.coordinates_names,s={};for(const o of e)s[o]=t[o];return s}getCurrentPlayer(){var t;const e=this.getCurrentGameStateInfo();if(e)return null==e||null===(t=e.parameters)||void 0===t?void 0:t.player}composeDictWithoutCoordinates(t){const e=Object.assign({},t);return delete e.coordinates,e}hangleConfigTextChange(t){const e=t.target.value;this.setState({config_text:e})}setCellByCoordinates(t,e,s,o){var i;const n=(o=o||this.state.config.cell.coordinates_names).map((e=>t[e]));let a=s;for(let t=0;t<n.length-1;t++){const e=n[t];a[e]||(a[e]={}),a=a[e]}const c=n[n.length-1];"function"==typeof e&&(e=e(a[c])),null!==(i=a[c])&&void 0!==i&&i.coordinates?a[c]=Object.assign({},e,{coordinates:a[c].coordinates}):a[c]=Object.assign({},e)}setCellEmpty(t,e,s){s=s||this.state.config.cell.coordinates_names,this.setCellByCoordinates(t,{coordinates:t},e,s)}getCellByCoordinates_(t,e,s){const o=t.map((t=>e[t]));let i=s;for(let t=0;t<o.length-1;t++){const e=o[t];if(!i[e])return;i=i[e]}const n=o[o.length-1];return void 0!==i[n]?[i,n]:void 0}getCellByCoordinates(t,e,s){const o=this.getCellByCoordinates_(t,e,s);return o?o[0][o[1]]:void 0}composeBoardWithFigures(t,e,s){const o={};for(const e of s)this.setCellEmpty(e,o,t);for(const s in e)for(const i in e[s])for(const n of e[s][i])this.setCellByCoordinates(n,{coordinates:n,moves_made:0,last_move:0,player:s,figure:i},o,t);return o}composeUnpackedBoard(t,e){return getAllElementsWithDepth(this.state.board,t.length-1).map((t=>t.element))}compile_(t){const e=JSON.parse(t);return{config:e,config_text:t,game_state:e.initial_game_state,position:e.initial_position,board:this.composeBoardWithFigures(e.cell.coordinates_names,e.initial_position,e.board.cells)}}compile(){this.setState(this.compile_(this.state.config_text))}isVectorDividedByAnother(t,e,s){let o;for(const i of t){if(!e[i]){if(s[i])return!1;continue}const t=e[i]/s[i];if(t!=Math.floor(t))return!1;if(o){if(t!=o)return!1}else{if(o=t,!s.also_reversed&&o<0)return!1;if(!s.repeat&&Math.abs(o)>1)return!1}}return{coefficient:o}}composeComputedValues(t,e,s){const o={};for(const i of t)this.values_computers[i]&&(o[i]=this.values_computers[i]({cell:e,from_cell:s}));return o}composeActionsForCell(t,e,s){if(!t)return[];const o=[];for(const i of t){if(i.if){let t=!1;for(const o of i.if)if((!o.statistics||matchDict(this.state.statistics,o.statistics))&&(!o.self||matchDict(s,o.self))&&(!o.target||matchDict(e,o.target))){if(o.computed){if(!matchDict(this.composeComputedValues(Object.keys(o.computed),e,s),o.computed))continue}t=!0;break}if(!t)continue}o.push({target_cell:e,from_cell:s,actions:i.actions})}return o}composeCellAfterSteps(t,e,s,o){const i={};for(const n of t){const t=s[n]||0;i[n]=e[n]+t*o}return i}composeCoordinatesDelta(t,e,s){const o={};for(const i of t)o[i]=(s[i]||0)-(e[i]||0);return o}composeActionsForAvailableMove(t,e,s,o,i){const n=s.figure,a=this.state.config.cell.coordinates_names,c=(this.state.config.figures[n],[]),r=this.composeActionsForCell(e.destination||[],o,s);if(r.filter((t=>t.actions.includes("cancel"))).length)return[];c.push.apply(c,r);const l=[],f=Math.sign(i);for(let o=f;o!=i;o+=f){const i=this.composeCellAfterSteps(a,s.coordinates,t,o),n=this.getCellByCoordinates(a,i,this.state.board),c=this.composeActionsForCell(e.transition||[],n,s);l.push(...c)}return l.filter((t=>t.actions.includes("cancel"))).length?[]:c.concat(l)}composeActionsForSimpleMove(t,e){const s=t.figure,o=this.state.config.cell.coordinates_names,i=this.state.config.figures[s],n=this.composeCoordinatesDelta(o,t.coordinates,e.coordinates),a=i.movement,c=isDict(a)?a[t.player]:a;for(const s of c){var r;const a=null===(r=this.isVectorDividedByAnother(o,n,s))||void 0===r?void 0:r.coefficient;if(!a)continue;const c=joinDicts(s.cell_actions||{},i.cell_actions||{});return this.composeActionsForAvailableMove(s,c,t,e,a)}return[]}composeActionsForComplexMove(t,e){const s=t.figure,o=this.state.config.cell.coordinates_names,i=this.composeCoordinatesDelta(o,t.coordinates,e.coordinates),n=this.state.config.complex_movement.filter((t=>t.figures.filter((t=>t.figure===s)).length)),a=t.coordinates;for(const t of n){let e=!0;const n=[];for(const r of t.figures.filter((t=>t.figure===s))){const s=r.relative_position||{},l=this.composeCoordinatesDelta(o,a,s);Object.keys(t).filter((t=>this.state.config.figures[t]));for(const s of t.figures){const a=s.figure,f=s.coordinates_delta||{};let h;var c;if(s!==r)h=1;else if(h=null===(c=this.isVectorDividedByAnother(o,i,f))||void 0===c?void 0:c.coefficient,!h){e=!1;break}const m=s.relative_position||{},d=this.composeCoordinatesDelta(o,l,m),g=this.getCellByCoordinates(o,d,this.state.board);if((null==g?void 0:g.figure)!==a){e=!1;break}const u=this.composeCellAfterSteps(o,g.coordinates,f,1),_=this.getCellByCoordinates(o,u,this.state.board),p=joinDicts(s.cell_actions||{},t.cell_actions||{}),v=this.composeActionsForAvailableMove(f,p,g,_,h);if(v.filter((t=>t.actions.includes("cancel"))).length||!v.filter((t=>!t.actions.includes("cancel"))).length){e=!1;break}n.push.apply(n,v)}if(e)return n}}return[]}composeActionsForMove(t,e){if(!t.figure)return[];if(isObjectsEqual(t,e))return[];const s=this.composeActionsForSimpleMove(t,e);if(s.length)return s;if(!this.state.config.complex_movement)return[];return this.composeActionsForComplexMove(t,e)}composeStateAfterActions(t,e,s){this.setCellByCoordinates(e.coordinates,(t=>Object.assign(t,{moves_made:t.moves_made+1})),t.board);for(const e of s)for(const s of e.actions){let o,i;isDict(s)?(o=s.action,i=s.parameters):o=s,this.actions[o]&&this.actions[o]({from_cell:e.from_cell,to_cell:e.target_cell,parameters:i,board:t.board})}return t}getCurrentGameStateInfo(){return this.state.config.game_states[this.state.game_state]}getGameStateInfo(t){return this.state.config.game_states[t]}composeNextGameState(t){const e=this.getGameStateInfo(t);if("string"==typeof e.next)return e.next;const s=this.state_data_getters[e.type]?this.state_data_getters[e.type](this.state.board):void 0;for(const t of e.next)for(const e of t.if)if(matchDict({result:s},e))return t.state}setNextGameState(){const t=this.state.game_state;let e=this.state.game_statistics,s=this.composeNextGameState(t);for(;;){const t=this.getGameStateInfo(s).type;if("passive"!=this.game_state_passiveness_by_type[t])break;this.state_effects[t]&&(e=this.state_effects[t](e)),s=this.composeNextGameState(s)}this.setState({game_statistics:e}),this.setGameState(s)}getAvailableMovesFromCell(t){if(!t.figure)return[];const e=[],s=this.state.config.figures[t.figure],o=this.state.config.cell.coordinates_names;for(const i of s.movement){const s=this.composeDictWithCoordinates(i),n=[this.composeCellAfterSteps(o,t.coordinates,s,1)];i.also_reversed&&n.push(this.composeCellAfterSteps(o,t.coordinates,s,-1));for(const s of n){const i=this.getCellByCoordinates(o,s,this.state.board);if(!i)continue;const n=this.composeActionsForMove(t,i);n.length>0&&e.push.apply(e,n)}}return e}handleSelectCell(t){const e=this.state.selected_cell;if(e){const s=this.composeActionsForMove(e,t);if(s.length>0){const t=this.composeStateAfterActions(this.state,e,s);this.setState(t,(()=>this.setNextGameState()))}this.setState({selected_cell:void 0,highlighted_cells:{}})}else{var s;const e=t.player;if(!e)return;if(e&&e===(null===(s=this.getCurrentGameStateInfo().parameters)||void 0===s?void 0:s.player)){const e=this.getAvailableMovesFromCell(t).map((t=>t.target_cell.coordinates));this.setState({selected_cell:t,highlighted_cells:e.reduce(((t,e)=>(t[Object.values(e).join("_")]=!0,t)),{})})}}}handleGameNameSelectChange(t){const e=t.target.value;this.setLoadedConfig(e,(()=>this.startGame()))}getSaveName(){const t=new Date,e=`${t.getFullYear()}_${t.getMonth()+1}_${t.getDate()}`,s=`${t.getHours()}_${t.getMinutes()}_${t.getSeconds()}`;return`${this.state.config.name}_config-${e}-${s}.json`}downloadConfig(){const t=this.state.config_text,e=this.getSaveName();downloadFile(e,t)}uploadConfig(){uploadFile("json",(t=>{const e=JSON.parse(t).name;e?(configs[e]=t,this.setLoadedConfig(e)):console.log('no game name found in config (field "name")')}))}render(){var t,e;const s=this.state.config?this.composeUnpackedBoard(this.state.config.cell.coordinates_names,this.state.board):void 0,o=null===(t=this.state.config)||void 0===t?void 0:t.board.rotation_angle[this.getCurrentPlayer()];return React.createElement("div",{className:"app",ref:this._ref},this.state.config?React.createElement("div",{className:"gameUI"},React.createElement(Board,{resources:this.state.config.resources,board:s,rotation_angle:o,cell_config:this.state.config.cell,handleSelectCell:this.handleSelectCell.bind(this),selected_cell:this.state.selected_cell,highlighted_cells:this.state.highlighted_cells||{},cell_coords_names:this.state.config.cell.coordinates_names}),React.createElement("div",{className:"gameState unselectable"},this.state.current_move," ",this.state.game_state.replaceAll("_"," "))):null,React.createElement("div",{className:"config"},React.createElement("textarea",{className:"configText",value:this.state.config_text,onChange:this.hangleConfigTextChange.bind(this)}),React.createElement("select",{className:"configsList",value:null===(e=this.state.config)||void 0===e?void 0:e.name,onChange:this.handleGameNameSelectChange.bind(this)},Object.keys(configs).map((t=>React.createElement("option",{key:t,value:t},t)))),React.createElement("button",{className:"uploadConfigButton unselectable",onClick:this.uploadConfig.bind(this)},"upload config"),React.createElement("button",{className:"compileButton unselectable",onClick:this.compile.bind(this)},"compile"),React.createElement("button",{className:"downloadConfigButton unselectable",onClick:this.downloadConfig.bind(this)},"download config")))}}const rootElement=document.getElementById("root");loadConfigs().then((()=>ReactDOM.render(React.createElement(Root),rootElement)));