import L from 'leaflet';
import ControlLayers from './control-layers.js';
import ControlNearby from '../controls/nearby';
import wikivoyage from '../mw.wikivoyage';
import message from '../mw.message';

/*jscs:disable disallowDanglingUnderscores, requireVarDeclFirst */
var Map = function ( map ) {
	this.map = map;
};

Map.prototype.nearby = function () {
	var control = this._controlNearby;
	if ( control ) {
		return control;
	}

	control = this._controlNearby = new ControlNearby();
	control.addTo( this.map );

	this.controlLayers().addLayer(
		control.pruneCluster,
		wikivoyage.formatLayerName( message( control.pruneCluster.options.wvName ), control.pruneCluster.options ),
		true
	).update();

	return control;
};

Map.prototype.controlLayers = function () {
	this._controlLayers = this._controlLayers || new ControlLayers( this.map );
	return this._controlLayers;
};

Map.prototype.scale = function () {
	return L.control.scale().addTo( this.map );
};

export default Map;
