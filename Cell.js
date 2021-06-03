"use strict";function composeExpressionWithParameters(e,t){return`${Object.keys(t).map((e=>`const ${e} = ${t[e]};`)).join("\n")};\n${e}`}function evaluate(expression){return eval(expression)}function evaluateExpressionWithParameters(expression,parameters){return eval(composeExpressionWithParameters(expression,parameters))}function computeGeometry(e,t){return e.geometry.map((e=>e.map((e=>{if("number"==typeof e)return e;if("string"!=typeof e)return;return evaluate(composeExpressionWithParameters(e,t))}))))}function composeSizedPoints(e,t){return e.map((e=>[t*e[0],t*e[1]]))}function computeCellScreenSize(e){return{width:Math.max(...e.map((e=>e[0]))),height:Math.max(...e.map((e=>e[1])))}}const default_cell_colors={fill:'"darkgrey"',selector:'"skyblue"',highlighter:'"lightgreen"'};function composeZoomedGeometry(e,t){const r=e.reduce(((e,t)=>[e[0]+t[0],e[1]+t[1]])).map((t=>t/e.length));return e.map((e=>[r[0]+t*(e[0]-r[0]),r[1]+t*(e[1]-r[1])]))}function Cell(e){var t,r,i;const{cell_config:l,resources:o,coordinates:s,size:n,figure_rotation_angle:a,figure:c,player:m,selected:u,highlighted:p,handleSelectThisCell:g}=e,h=composeSizedPoints(computeGeometry(l,s),n),{width:f,height:d}=computeCellScreenSize(h),y=evaluateExpressionWithParameters(l.position.x,s)*n,x=evaluateExpressionWithParameters(l.position.y,s)*n,v=Object.assign({},default_cell_colors,l.colors||{});let E;return Object.keys(v).map((e=>v[e]=evaluateExpressionWithParameters(v[e],s))),null!=o&&null!==(t=o.images)&&void 0!==t&&t.figures&&null!=o&&null!==(r=o.images)&&void 0!==r&&r.figures[m]&&(E=null==o||null===(i=o.images)||void 0===i?void 0:i.figures[m][c]),React.createElement("div",{className:"cellWithFigure",style:{width:`${f}px`,height:`${d}px`,transform:`translate(${y}px, ${x}px)`}},React.createElement("svg",{className:"cell",style:{width:"100%",height:"100%"},xmlns:"http://www.w3.org/2000/svg",version:"1.1",onClick:g},React.createElement("polygon",{fill:v.fill,points:h.join(" ")}),u?React.createElement("polygon",{style:{opacity:.6},fill:v.selector,points:h.join(" ")}):p?React.createElement("polygon",{style:{opacity:.6},fill:v.highlighter,points:h.join(" ")}):null),c?React.createElement("img",{className:"figure",style:{transform:`rotate(${a}deg)`},src:E,alt:`${m} ${c}`,draggable:!1,onClick:g}):null)}