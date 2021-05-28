"use strict";function getAllElementsWithDepth_(t,e,s,o){for(const i of Object.keys(t)){const n=Number.parseInt(i,10),a=t[n],c=o.concat([n]);0===e?s.push({keys:c,element:a}):getAllElementsWithDepth_(a,e-1,s,c)}}function getAllElementsWithDepth(t,e){const s=[];return getAllElementsWithDepth_(t,e,s,[]),s}function dictFromTwoLists(t,e){const s={};for(let o=0;o<t.length;o++)s[t[o]]=e[o];return s}function matchDict(t,e){for(const s in e)if("object"==typeof t[s]){if(!matchDict(t[s],e[s]))return!1}else if(t[s]!=e[s])return!1;return!0}function joinDicts(t,e){const s=Object.assign({},t);for(const t in e){if(s[t]){if(Array.isArray(s[t])&&Array.isArray(e[t])){s[t].push.apply(s[t],e[t]);continue}if(isDict(s[t])&&isDict(e[t])){s[t]=joinDicts(s[t],e[t]);continue}}s[t]=e[t]}return s}const games_available=["chess","checkers","intellector"];class Root extends React.Component{constructor(t){super(t),this.state={game_name:"chess",board:void 0,game_state:void 0,selected_cell:void 0,config_text:void 0,config:void 0},this.actions={swap:({from_cell:t,to_cell:e,board:s})=>{this.setCellByCoordinates(t.coordinates,Object.assign({},e),s),this.setCellByCoordinates(e.coordinates,Object.assign({},t),s)},move:({from_cell:t,to_cell:e,board:s})=>{const o=t.coordinates;this.setCellByCoordinates(e.coordinates,t,s),this.setCellEmpty(o,s)},take:({from_cell:t,to_cell:e,board:s})=>{this.setCellEmpty(e.coordinates,s)},replace:({from_cell:t,board:e,parameters:s})=>{this.setCellByCoordinates(t.coordinates,Object.assign(t,{figure:s.new_figure}),e)}},this.values_computers={is_cell:(t,e)=>Boolean(t),is_enemy:(t,e)=>void 0!==(null==t?void 0:t.player)&&(null==t?void 0:t.player)!=(null==e?void 0:e.player),is_figure:(t,e)=>void 0!==(null==t?void 0:t.player)},this.entities_getters={cell:t=>this.composeUnpackedBoard(this.state.config.cell.coordinates_names,t)},this.conditions_types={exists:t=>Boolean(t.length)},this.state_data_getters={check_win:t=>{const e=this.getCurrentPlayer(),s=this.state.config.win_conditions[e];for(const e of s){const s=this.entities_getters[e.entity](t).filter((t=>matchDict(t,e.filter)));return this.conditions_types[e.type](s)===e.result}}},this.game_state_passiveness_by_type={move:"active",check_win:"passive",end:"active"},this._ref=React.createRef()}fetchSetConfigForGame(t,e){fetch(`config/${t}/main.json`).then((t=>t.text())).then((s=>this.setState(Object.assign(this.compile_(s),{game_name:t}),e)))}componentDidMount(){window.addEventListener("resize",this.handleResize.bind(this)),this.fetchSetConfigForGame(this.state.game_name,(()=>this.startGame()))}handleResize(){this.forceUpdate()}startGame(){this.setGameState(this.state.config.initial_game_state)}setGameState(t){this.state.config.game_states[t]&&this.setState((e=>({game_state:t})))}composeCellWithoutData(t){const e=this.state.config.cell.coordinates_names,s={};for(const o of e)s[o]=t[o];return s}getCurrentPlayer(){const t=this.getCurrentGameStateInfo();if(t)return t.parameters.player}withoutCoordinates(t){const e=Object.assign({},t);return delete e.coordinates,e}hangleConfigTextChange(t){const e=t.target.value;this.setState({config_text:e})}setCellByCoordinates(t,e,s,o){var i;const n=(o=o||this.state.config.cell.coordinates_names).map((e=>t[e]));let a=s;for(let t=0;t<n.length-1;t++){const e=n[t];a[e]||(a[e]={}),a=a[e]}const c=n[n.length-1];"function"==typeof e&&(e=e(a[c])),null!==(i=a[c])&&void 0!==i&&i.coordinates?a[c]=Object.assign({},e,{coordinates:a[c].coordinates}):a[c]=Object.assign({},e)}setCellEmpty(t,e,s){s=s||this.state.config.cell.coordinates_names,this.setCellByCoordinates(t,{coordinates:t},e,s)}getCellByCoordinates_(t,e,s){const o=t.map((t=>e[t]));let i=s;for(let t=0;t<o.length-1;t++){const e=o[t];if(!i[e])return;i=i[e]}const n=o[o.length-1];return void 0!==i[n]?[i,n]:void 0}getCellByCoordinates(t,e,s){const o=this.getCellByCoordinates_(t,e,s);return o?o[0][o[1]]:void 0}composeBoardWithFigures(t,e,s){const o={};for(const e of s)this.setCellEmpty(e,o,t);for(const s in e)for(const i in e[s])for(const n of e[s][i])this.setCellByCoordinates(n,{coordinates:n,moves_made:0,player:s,figure:i},o,t);return o}composeUnpackedBoard(t,e){return getAllElementsWithDepth(this.state.board,t.length-1).map((t=>t.element))}compile_(t){const e=JSON.parse(t);return{config:e,config_text:t,game_state:e.initial_game_state,position:e.initial_position,board:this.composeBoardWithFigures(e.cell.coordinates_names,e.initial_position,e.board)}}compile(){this.setState(this.compile_(this.state.config_text))}isVectorDividedByAnother(t,e,s){let o;for(const i of t){if(!e[i]){if(s[i])return!1;continue}const t=e[i]/s[i];if(t!=Math.floor(t))return!1;if(o){if(t!=o)return!1}else{if(o=t,!s.also_reversed&&o<0)return!1;if(!s.repeat&&Math.abs(o)>1)return!1}}return{coefficient:o}}composeComputedValues(t,e,s){const o={};for(const i of t)this.values_computers[i]&&(o[i]=this.values_computers[i](e,s));return o}composeActionsForCell(t,e,s){if(!t)return[];const o=[];for(const i of t){if(i.if){let t=!1;for(const o of i.if)if((!o.self||matchDict(s,o.self))&&(!o.target||matchDict(e,o.target))){if(o.computed){if(!matchDict(this.composeComputedValues(Object.keys(o.computed),e,s),o.computed))continue}t=!0;break}if(!t)continue}o.push({target_cell:e,from_cell:s,actions:i.actions})}return console.log("matched_actions",o),o}composeCellAfterSteps(t,e,s,o){const i={};for(const n of t){const t=s[n]||0;i[n]=e[n]+t*o}return i}composeCoordinatesDelta(t,e,s){const o={};for(const i of t)o[i]=(s[i]||0)-(e[i]||0);return o}composeActionsForAvailableMove(t,e,s,o,i){const n=s.figure,a=this.state.config.cell.coordinates_names,c=(this.state.config.figures[n],[]),r=this.composeActionsForCell(e.destination,o,s);if(r.filter((t=>t.actions.includes("cancel"))).length)return[];c.push.apply(c,r);const l=[],h=Math.sign(i);for(let o=h;o!=i;o+=h){const i=this.composeCellAfterSteps(a,s.coordinates,t,o),n=this.getCellByCoordinates(a,i,this.state.board),c=this.composeActionsForCell(e.transition,n,s);l.push(...c)}return l.filter((t=>t.actions.includes("cancel"))).length?[]:c.concat(l)}composeActionsForSimpleMove(t,e){const s=t.figure,o=this.state.config.cell.coordinates_names,i=this.state.config.figures[s],n=this.composeCoordinatesDelta(o,t.coordinates,e.coordinates),a=i.movement,c=isDict(a)?a[t.player]:a;for(const s of c){var r;const a=null===(r=this.isVectorDividedByAnother(o,n,s))||void 0===r?void 0:r.coefficient;if(!a)continue;const c=joinDicts(s.cell_actions,i.cell_actions);return this.composeActionsForAvailableMove(s,c,t,e,a)}return[]}composeActionsForComplexMove(t,e){const s=t.figure,o=this.state.config.cell.coordinates_names,i=this.composeCoordinatesDelta(o,t.coordinates,e.coordinates),n=this.state.config.complex_movement.filter((t=>t[s])),a=t.coordinates;for(const t of n){let e=!0;const n=[],h=t[s].relative_position||{},m=this.composeCoordinatesDelta(o,a,h),f=Object.keys(t).filter((t=>this.state.config.figures[t]));for(const a of f){var c,r;const h=t[a],f=h.coordinates_delta;let d;var l;if(a!==s)d=1;else if(d=null===(l=this.isVectorDividedByAnother(o,i,f))||void 0===l?void 0:l.coefficient,!d){e=!1;break}const g=h.relative_position||{},p=this.composeCoordinatesDelta(o,m,g),u=this.getCellByCoordinates(o,p,this.state.board);if((null==u?void 0:u.figure)!==a){e=!1;break}const _=this.composeCellAfterSteps(o,u.coordinates,f,1),v=this.getCellByCoordinates(o,_,this.state.board),C=h.cell_actions||t.cell_actions,y=this.composeActionsForAvailableMove(f,C,u,v,d),b=(null===(c=C.destination)||void 0===c?void 0:c.length)||0,S=(null===(r=C.transition)||void 0===r?void 0:r.length)||0;if(!y||y.length<b+S){e=!1;break}if(y.filter((t=>t.actions.includes("cancel"))).length){e=!1;break}n.push.apply(n,y)}if(e)return n}return[]}composeActionsForMove(t,e){if(!t.figure)return[];if(isObjectsEqual(t,e))return[];const s=this.composeActionsForSimpleMove(t,e);if(s.length)return s;if(!this.state.config.complex_movement)return[];return this.composeActionsForComplexMove(t,e)}composeStateAfterActions(t,e,s){this.setCellByCoordinates(e.coordinates,(t=>Object.assign(t,{moves_made:t.moves_made+1})),t.board);for(const e of s)for(const s of e.actions){let o,i;isDict(s)?(o=s.action,i=s.parameters):o=s,this.actions[o]&&this.actions[o]({from_cell:e.from_cell,to_cell:e.target_cell,parameters:i,board:t.board})}return t}getCurrentGameStateInfo(){return this.state.config.game_states[this.state.game_state]}getGameStateInfo(t){return this.state.config.game_states[t]}composeNextGameState(t){const e=this.getGameStateInfo(t);if("string"==typeof e.next)return e.next;const s=this.state_data_getters[e.type](this.state.board);for(const t of e.next)for(const e of t.if)if(matchDict({result:s},e))return t.state}setNextGameState(){const t=this.state.game_state;let e=this.composeNextGameState(t);for(;;){const t=this.getGameStateInfo(e).type;if("passive"!=this.game_state_passiveness_by_type[t])break;e=this.composeNextGameState(e)}this.setGameState(e)}handleSelectCell(t){const e=this.state.selected_cell;if(e){const s=this.composeActionsForMove(e,t);if(s.length>0){const t=this.composeStateAfterActions(this.state,e,s);this.setState(t,(()=>this.setNextGameState()))}this.setState({selected_cell:void 0})}else{var s;const e=t.player;if(!e)return;e&&e===(null===(s=this.getCurrentGameStateInfo().parameters)||void 0===s?void 0:s.player)&&this.setState({selected_cell:t})}}handleGameNameSelectChange(t){const e=t.target.value;this.fetchSetConfigForGame(e,(()=>this.startGame()))}render(){const t=this.state.config?this.composeUnpackedBoard(this.state.config.cell.coordinates_names,this.state.board):void 0;return React.createElement("div",{className:"app",ref:this._ref},this.state.config?React.createElement("div",{className:"gameUI"},React.createElement(Board,{resources:{path:`config/${this.state.game_name}`},board:t,cell_config:this.state.config.cell,handleSelectCell:this.handleSelectCell.bind(this),selected_cell:this.state.selected_cell,cell_coords_names:this.state.config.cell.coordinates_names}),React.createElement("div",{className:"gameState unselectable"},this.state.game_state.replace("_"," "))):null,React.createElement("div",{className:"config"},React.createElement("textarea",{className:"configText",value:this.state.config_text,onChange:this.hangleConfigTextChange.bind(this)}),React.createElement("select",{value:this.state.game_name,onChange:this.handleGameNameSelectChange.bind(this)},games_available.map((t=>React.createElement("option",{key:t,value:t},t)))),React.createElement("button",{className:"compileButton unselectable",onClick:this.compile.bind(this)},"compile")))}}const rootElement=document.getElementById("root");ReactDOM.render(React.createElement(Root),rootElement);