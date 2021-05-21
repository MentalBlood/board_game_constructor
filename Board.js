"use strict";function _extends(){return(_extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function isDict(e){return void 0!==e&&e.constructor==Object}function convertCellCoordinatesToNumbers(e,t){for(const r of e)t[r]=Number.parseInt(t[r],10);return t}function isObjectsEqual(e,t){if(!isDict(e)||!isDict(t))return!1;for(const r in e)if(e[r]!==t[r])return!1;return!0}function Board(e){const{board:t,selectCell:r,selected_cell:n,cell_coords_names:c}=e;return React.createElement("div",{className:"board"},t.map((e=>React.createElement(Cell,_extends({key:e.x+"_"+e.y},e,{size:90,selectThisCell:()=>r(e),selected:isObjectsEqual(n,e)})))))}