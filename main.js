"use strict";function getAllElementsWithDepth_(t,e,s,o){for(const i of Object.keys(t)){const n=Number.parseInt(i,10),a=t[n],c=o.concat([n]);0===e?s.push({keys:c,element:a}):getAllElementsWithDepth_(a,e-1,s,c)}}function getAllElementsWithDepth(t,e){const s=[];return getAllElementsWithDepth_(t,e,s,[]),s}function dictFromTwoLists(t,e){const s={};for(let o=0;o<t.length;o++)s[t[o]]=e[o];return s}function matchDict(t,e){for(const s in e)if(t[s]!=e[s])return!1;return!0}class Root extends React.Component{constructor(t){super(t),this.state={board:void 0,game_state:void 0,selected_cell:void 0,config_text:void 0,config:config},this.state.config_text=JSON.stringify(this.state.config),this.state=Object.assign(this.state,this.compile_()),this.actions={swap:(t,e,s)=>{this.setCellByCoordinates(t.coordinates,Object.assign({},e),s),this.setCellByCoordinates(e.coordinates,Object.assign({},t),s)},move:(t,e,s)=>{const o=t.coordinates;this.setCellByCoordinates(e.coordinates,t,s),this.setCellEmpty(o,s)},take:(t,e,s)=>{this.setCellEmpty(e.coordinates,s)}},this.values_computers={is_enemy:(t,e)=>t.player!=e.player},this.entities_getters={cell:t=>this.composeUnpackedBoard(this.state.config.cell.coordinates_names,t)},this.conditions_types={exists:t=>Boolean(t.length)},this.state_data_getters={check_win:t=>{const e=this.getCurrentPlayer(),s=this.state.config.win_conditions[e];for(const e of s){const s=this.entities_getters[e.entity](t).filter((t=>matchDict(t,e.filter)));return this.conditions_types[e.type](s)===e.result}}},this.game_state_passiveness_by_type={move:"active",check_win:"passive",end:"active"}}componentDidMount(){this.startGame()}startGame(){this.setGameState(this.state.config.initial_game_state)}setGameState(t){this.state.config.game_states[t]&&this.setState((e=>({game_state:t})))}composeCellWithoutData(t){const e=this.state.config.cell.coordinates_names,s={};for(const o of e)s[o]=t[o];return s}getCurrentPlayer(){const t=this.getCurrentGameStateInfo();if(t)return t.parameters.player}withoutCoordinates(t){const e=Object.assign({},t);return delete e.coordinates,e}hangleConfigTextChange(t){const e=t.target.value;this.setState({config_text:e})}setCellByCoordinates(t,e,s,o=!0){var i;const n=this.state.config.cell.coordinates_names.map((e=>t[e]));let a=s;for(let t=0;t<n.length-1;t++){const e=n[t];if(!a[e]){if(!o)return;a[e]={}}a=a[e]}const c=n[n.length-1];(a[c]||o)&&(null!==(i=a[c])&&void 0!==i&&i.coordinates?a[c]=Object.assign({},e,{coordinates:a[c].coordinates}):a[c]=Object.assign({},e))}setCellEmpty(t,e){this.setCellByCoordinates(t,{coordinates:t},e)}getCellByCoordinates_(t,e,s){const o=t.map((t=>e[t]));let i=s;for(let t=0;t<o.length-1;t++){const e=o[t];if(!i[e])return;i=i[e]}const n=o[o.length-1];return void 0!==i[n]?[i,n]:void 0}getCellByCoordinates(t,e,s){const o=this.getCellByCoordinates_(t,e,s);return o?o[0][o[1]]:void 0}composeBoardWithFigures(t,e,s){const o={};for(const t of s)this.setCellEmpty(t,o);for(const t in e)for(const s in e[t])for(const i of e[t][s])this.setCellByCoordinates(i,{coordinates:i,player:t,figure:s},o,!1);return o}composeUnpackedBoard(t,e){return getAllElementsWithDepth(this.state.board,t.length-1).map((t=>t.element))}compile_(){const t=JSON.parse(this.state.config_text);return{config:t,game_state:t.initial_game_state,position:t.initial_position,board:this.composeBoardWithFigures(t.cell.coordinates_names,t.initial_position,t.board)}}compile(){JSON.parse(this.state.config_text);this.setState(this.compile_())}getCoordinatesDelta(t,e){const s={};for(name of Object.keys(t)){e[name]-t[name]&&(s[name]=e[name]-t[name])}return s}isVectorDividedByAnother(t,e){let s;for(const o of Object.keys(t)){if(t[o]&&!e[o]||!t[o]&&e[o])return!1;if(void 0===t[o]||void 0===e[o])continue;const i=t[o]/e[o];if(i!=Math.floor(i))return!1;if(s){if(i!=s)return!1}else{if(s=i,e.also_reversed){if(Math.abs(s)>1&&!e.repeat)return!1;continue}if(s>0&&s>1&&!e.repeat)return!1;if(s<0&&(!e.also_reversed||s<-1&&!e.repeat))return!1}}return{coefficient:s}}composeComputedValues(t,e,s){const o={};for(const i of t)this.values_computers[i]&&(o[i]=this.values_computers[i](e,s));return o}composeActionsForCell(t,e,s,o,i){const n=o.cell_actions||s.cell_actions;if(!n)return[];const a=n[i];if(!a)return[];const c=[];for(const s of a){if(s.if){if(s.if.given&&!matchDict(t,s.if.given))continue;if(s.if.computed){if(!matchDict(this.composeComputedValues(Object.keys(s.if.computed),t,e),s.if.computed))continue;if(s.actions.includes("cancel"))return[]}}c.push({target_cell:t,from_cell:e,actions:s.actions})}return c}composeCellAfterSteps(t,e,s,o){const i={};for(const n of t){const t=s[n]?s[n]:0;i[n]=e[n]+t*o}return i}composeActionsForMove(t,e){const s=[{from_cell:t,target_cell:e,actions:["move"]}],o=t.figure;if(!o)return[];if(isObjectsEqual(t,e))return[];const i=this.state.config.figures[o],n=i.movement,a=isDict(n)?n[t.player]:n,c=this.state.config.cell.coordinates_names,r=this.getCoordinatesDelta(t.coordinates,e.coordinates),l=[];for(const o of a){var h;const n=null===(h=this.isVectorDividedByAnother(r,o))||void 0===h?void 0:h.coefficient;if(n){if(e.figure){const s=this.composeActionsForCell(e,t,i,o,"destination");l.push.apply(l,...s)}const a=[],r=Math.sign(n);for(let e=r;e!=n;e+=r){const s=this.composeCellAfterSteps(c,t.coordinates,o,e),n=this.getCellByCoordinates(c,s,this.state.board);if(!n.figure)continue;const r=this.composeActionsForCell(n,t,i,o,"transition");a.push(...r)}return!l.length&&a.length?a.concat(s):l.concat(a)}}return[]}composeStateAfterActions(t,e,s,o){for(const e of o)for(const s of e.actions)this.actions[s]&&this.actions[s](e.from_cell,e.target_cell,t.board);return t}getCurrentGameStateInfo(){return this.state.config.game_states[this.state.game_state]}getGameStateInfo(t){return this.state.config.game_states[t]}composeNextGameState(t){const e=this.getGameStateInfo(t);if("string"==typeof e.next)return e.next;const s=this.state_data_getters[e.type](this.state.board);for(const t of e.next)if(matchDict({result:s},t.if))return t.state}setNextGameState(){const t=this.state.game_state;let e=this.composeNextGameState(t);for(;;){const t=this.getGameStateInfo(e).type;if("passive"!=this.game_state_passiveness_by_type[t])break;e=this.composeNextGameState(e)}this.setGameState(e)}handleSelectCell(t){if(this.state.selected_cell){const e=this.composeActionsForMove(this.state.selected_cell,t);if(console.log("actions_for_move",e),e.length>0){const s=this.composeStateAfterActions(this.state,this.state.selected_cell,t,e);this.setState(s,(()=>this.setNextGameState()))}this.setState({selected_cell:void 0})}else{var e;const s=t.player;if(!s)return;s&&s===(null===(e=this.getCurrentGameStateInfo().parameters)||void 0===e?void 0:e.player)&&this.setState({selected_cell:t})}}render(){const t=this.composeUnpackedBoard(this.state.config.cell.coordinates_names,this.state.board);return React.createElement("div",{className:"app"},React.createElement("div",{className:"gameUI"},React.createElement(Board,{board:t,cell_config:this.state.config.cell,handleSelectCell:this.handleSelectCell.bind(this),selected_cell:this.state.selected_cell,cell_coords_names:this.state.config.cell.coordinates_names}),React.createElement("div",{className:"gameState unselectable"},this.state.game_state)),React.createElement("div",{className:"config"},React.createElement("textarea",{className:"configText",value:JSON.stringify(this.state.config,null,"\t"),onChange:this.hangleConfigTextChange.bind(this)}),React.createElement("button",{className:"compileButton unselectable",onClick:this.compile.bind(this)},"compile")))}}const rootElement=document.getElementById("root");ReactDOM.render(React.createElement(Root),rootElement);