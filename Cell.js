"use strict";function composeExpressionWithParameters(e,t){return`${Object.keys(t).map((e=>`const ${e} = ${t[e]};`)).join("\n")};\n${e}`}function evaluate(expression){return eval(expression)}function computeGeometry(e,t){return e.geometry.map((e=>e.map((e=>{if("number"==typeof e)return e;if("string"!=typeof e)return;return evaluate(composeExpressionWithParameters(e,t))}))))}function composeSizedPoints(e,t){return e.map((e=>[t*e[0],t*e[1]]))}function computeCoordinate(e,t,n){Object.values(t);return evaluate(composeExpressionWithParameters(e,Object.assign({},t,{size:n})))}function computeCellScreenSize(e){return{width:Math.max(...e.map((e=>e[0]))),height:Math.max(...e.map((e=>e[1])))}}function Cell(e){const{cell_config:t,coordinates:n,size:o,figure:r,player:s,selected:i,handleSelectThisCell:a}=e,c=composeSizedPoints(computeGeometry(t,n),o),{width:l,height:p}=computeCellScreenSize(c),m=computeCoordinate(t.position.x,n,o),u=computeCoordinate(t.position.y,n,o);return React.createElement("svg",{className:"cell"+(i?" selected":""),style:{width:l+"px",height:p+"px",transform:`translate(${m+"px"}, ${u+"px"})`},xmlns:"http://www.w3.org/2000/svg",version:"1.1",onClick:a},React.createElement("polygon",{fill:t.colors[s].cell,points:c.join(" ")}),";",React.createElement("text",{style:{fontSize:p/5+"px"},className:"unselectable",y:p/5*2,fill:t.colors[s].text},React.createElement("tspan",{x:l/3},Object.values(n).join(", ")),React.createElement("tspan",{x:l/8,dy:p/5*2},r)))}