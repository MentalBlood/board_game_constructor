"use strict";function getAllElementsWithDepth_(e,t,s,o){for(const i of Object.keys(e)){const n=Number.parseInt(i,10),r=e[n],c=o.concat([n]);0==t?s.push({keys:c,element:r}):getAllElementsWithDepth_(r,t-1,s,c)}}function getAllElementsWithDepth(e,t){const s=[];return getAllElementsWithDepth_(e,t,s,[]),s}function dictFromTwoLists(e,t){const s={};for(let o=0;o<e.length;o++)s[e[o]]=t[o];return s}class Root extends React.Component{constructor(e){super(e),this.state={board:void 0,selected_cell:void 0,config_text:void 0,config:{players:["white","black"],board:[],cell:["x","y"],figures:{intellector:{movement:[{x:1,also_reversed:!0},{y:1,also_reversed:!0},{x:1,y:-1,also_reversed:!0}],cell_actions:{destination:[{action:"swap",if:{given:{figure:"defensor"},computed:{is_enemy:!1}}}]}},defensor:{movement:[{x:1,also_reversed:!0},{y:1,also_reversed:!0},{x:1,y:-1,also_reversed:!0}]},dominator:{movement:[{x:1,repeat:!0,also_reversed:!0},{y:1,repeat:!0,also_reversed:!0},{x:1,y:-1,repeat:!0,also_reversed:!0}]},aggressor:{movement:[{x:1,y:1,repeat:!0,also_reversed:!0},{x:1,y:-2,repeat:!0,also_reversed:!0},{x:2,y:-1,repeat:!0,also_reversed:!0}]},liberator:{movement:[{x:2,also_reversed:!0},{y:2,also_reversed:!0},{x:2,y:-2,also_reversed:!0}]},progressor:{movement:{white:[{x:1},{y:1},{x:-1,y:1}],black:[{x:-1},{y:-1},{x:1,y:-1}]}}},initial_position:{white:{intellector:[{x:4,y:-2}],dominator:[{x:0,y:0},{x:8,y:-4}],aggressor:[{x:2,y:-1},{x:6,y:-3}],defensor:[{x:3,y:-1},{x:5,y:-2}],liberator:[{x:1,y:0},{x:7,y:-3}],progressor:[{x:0,y:1},{x:2,y:0},{x:4,y:-1},{x:6,y:-2},{x:8,y:-3}]},black:{intellector:[{x:4,y:4}],dominator:[{x:0,y:6},{x:8,y:2}],aggressor:[{x:2,y:5},{x:6,y:3}],defensor:[{x:3,y:4},{x:5,y:3}],liberator:[{x:1,y:5},{x:7,y:2}],progressor:[{x:0,y:5},{x:2,y:4},{x:4,y:3},{x:6,y:2},{x:8,y:1}]}}}};for(let e=0;e<9;e++)for(let t=0-Math.floor(e/2);t<7-e%2-Math.floor(e/2);t++)this.state.config.board.push({x:e,y:t});this.state.config_text=JSON.stringify(this.state.config),this.state=Object.assign(this.state,this.compile_()),this.actions={swap:(e,t,s)=>{this.setByCoordinates(e,t,s),this.setByCoordinates(t,e,s)},move:(e,t,s)=>{this.setByCoordinates(t,this.withoutCoordinates(e),s),this.emptyCell(e,s)}},this.values_computers={is_enemy:(e,t)=>e.player!=t.player}}withoutData(e){const t=this.state.config.cell,s={};for(const o of t)s[o]=e[o];return s}withoutCoordinates(e){const t=Object.assign({},e),s=this.state.config.cell;for(const e of s)delete t[e];return t}onConfigTextChange(e){const t=e.target.value;this.setState({config_text:t})}setByCoordinates(e,t,s,o=!0){const i=this.state.config.cell.map((t=>e[t]));let n=s;for(let e=0;e<i.length-1;e++){const t=i[e];if(!n[t]){if(!o)return;n[t]={}}n=n[t]}const r=i[i.length-1];(n[r]||o)&&(n[r]=t)}emptyCell(e,t){this.setByCoordinates(e,this.withoutData(e),t)}getByCoordinates_(e,t,s){const o=e.map((e=>t[e]));let i=s;for(let e=0;e<o.length-1;e++){const t=o[e];if(!i[t])return;i=i[t]}const n=o[o.length-1];return void 0!==i[n]?[i,n]:void 0}getByCoordinates(e,t,s){const o=this.getByCoordinates_(e,t,s);return o?o[0][o[1]]:void 0}placeFiguresOnBoard(e,t,s){const o={};for(const e of s)this.emptyCell(e,o);for(const e in t)for(const s in t[e])for(const i of t[e][s])this.setByCoordinates(i,{player:e,figure:s},o,!1);return o}unpackBoard(e,t){return getAllElementsWithDepth(this.state.board,e.length-1).map((t=>Object.assign(t.element,dictFromTwoLists(e,t.keys))))}compile_(){const e=JSON.parse(this.state.config_text);return{config:e,position:e.initial_position,board:this.placeFiguresOnBoard(e.cell,e.initial_position,e.board)}}compile(){JSON.parse(this.state.config_text);this.setState(this.compile_(),(()=>this.forceUpdate()))}getCellsDelta(e,t,s){const o={};for(name of e){s[name]-t[name]&&(o[name]=s[name]-t[name])}return o}isDivider(e,t,s){let o;for(let i=0;i<e.length;i++){const n=e[i];if(t[n]&&!s[n]||!t[n]&&s[n])return!1;if(void 0===t[n]||null==s[n])continue;const r=t[n]/s[n];if(r!=Math.floor(r))return!1;if(o){if(r!=o)return!1}else{if(o=r,s.also_reversed){if(Math.abs(o)>1&&!s.repeat)return!1;continue}if(o>0&&o>1&&!s.repeat)return!1;if(o<0&&(!s.also_reversed||o<-1&&!s.repeat))return!1}}return{coefficient:o}}matchDict(e,t){for(const s in t)if(e[s]!=t[s])return!1;return!0}computeValues(e,t,s){const o={};for(const i of e)this.values_computers[i]&&(o[i]=this.values_computers[i](t,s));return o}getActionsForCell(e,t,s,o,i){const n=o.cell_actions||s.cell_actions;if(!n)return!1;const r=n[i];if(!r)return!1;const c=[];for(const s of r){if(s.if){if(s.if.given&&!this.matchDict(e,s.if.given))continue;if(s.if.computed){const o=this.computeValues(Object.keys(s.if.computed),e,t);if(!this.matchDict(o,s.if.computed))continue}}c.push(s.action)}return 0!=c.length&&(!c.includes("cancel")&&{actions:c})}getCellAfterSteps(e,t,s,o){const i={};for(const n of e){const e=s[n]?s[n]:0;i[n]=t[n]+e*o}return i}canMove(e,t){console.log("canMove",e,t);const s=e.figure;if(!s)return!1;if(isObjectsEqual(e,t))return!1;const o=this.state.config.figures[s],i=o.movement,n=isDict(i)?i[e.player]:i,r=this.state.config.cell,c=this.getCellsDelta(r,e,t);for(const s of n){var a;const i=null===(a=this.isDivider(r,c,s))||void 0===a?void 0:a.coefficient;if(i){if(t.figure)return this.getActionsForCell(t,e,o,s,"destination");const n=[],c=Math.sign(i);for(let t=c;t!=i;t+=c){const i=this.getCellAfterSteps(r,e,s,t),c=this.getByCoordinates(r,i,this.state.board);if(!c.figure)continue;const a=this.getActionsForCell(c,e,o,s,"transition");if(!1===a)return!1;n.push(...a)}return n.length?{actions:n}:{actions:["move"]}}}return!1}makeActions(e,t,s){this.setState((o=>{for(const i of s)this.actions[i]&&this.actions[i](e,t,o.board);return o}))}selectCell(e){if(this.state.selected_cell){const t=this.canMove(this.state.selected_cell,e);t&&this.makeActions(this.state.selected_cell,e,t.actions),this.setState({selected_cell:void 0})}else this.setState({selected_cell:e})}render(){const e=this.unpackBoard(this.state.config.cell,this.state.board);return React.createElement("div",{className:"app"},React.createElement(Board,{board:e,selectCell:this.selectCell.bind(this),selected_cell:this.state.selected_cell,cell_coords_names:this.state.config.cell}),React.createElement("div",{className:"config"},React.createElement("textarea",{className:"configText",value:JSON.stringify(this.state.config,null,"\t"),onChange:this.onConfigTextChange.bind(this)}),React.createElement("button",{className:"compileButton",onClick:this.compile.bind(this)},"compile")))}}const rootElement=document.getElementById("root");ReactDOM.render(React.createElement(Root),rootElement);