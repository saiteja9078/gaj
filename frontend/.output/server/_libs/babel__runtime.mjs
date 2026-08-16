//#region node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
//#endregion
//#region node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
//#endregion
//#region node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteralLoose.js
function _taggedTemplateLiteralLoose(e, t) {
	return t || (t = e.slice(0)), e.raw = t, e;
}
//#endregion
//#region node_modules/@babel/runtime/helpers/esm/objectDestructuringEmpty.js
function _objectDestructuringEmpty(t) {
	if (null == t) throw new TypeError("Cannot destructure " + t);
}
//#endregion
export { _extends as i, _taggedTemplateLiteralLoose as n, _objectWithoutPropertiesLoose as r, _objectDestructuringEmpty as t };
