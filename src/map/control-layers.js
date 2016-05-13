import $ from 'jquery';
import ControlLayers from '../controls/layers';
import wikivoyage from '../mw.wikivoyage';
import message from '../mw.message';

/*jscs:disable disallowDanglingUnderscores, requireVarDeclFirst */
var MapControl = function ( map ) {
	this.map = map;
	this.control = new ControlLayers();
	this.control.addTo( this.map );

	// Add wikimedia basemap
	this.addLayer(
		this.map.wikimediaLayer,
		wikivoyage.formatLayerName( message( 'Wikimedia' ), { wvIsWMF: true } )
	);
};

MapControl.prototype.addLayer = function ( layer, name, overlay ) {
	this.control._addLayer( layer, name, overlay );
	return this;
};

MapControl.prototype.addAll = function () {
	this
		.basemap( 'mapnik' )
		.basemap( 'mapquestopen' )
		.basemap( 'mapquest' )
		.basemap( 'landscape' )
		.overlay( 'traffic' )
		.overlay( 'maplabels' )
		.overlay( 'boundaries' )
		.overlay( 'hill' )
		.overlay( 'cycling' )
		.overlay( 'hiking' )
		.datalayer( this.map.dataLayers )
		.update();
	return this;
};

MapControl.prototype.update = function () {
	this.control._update();
	return this;
};

MapControl.prototype.basemap = function ( id ) {
	var tileLayer = wikivoyage.createTileLayer( id );
	this.addLayer( tileLayer.layer, tileLayer.name );
	return this;
};

MapControl.prototype.overlay = function ( id ) {
	var tileLayer = wikivoyage.createTileLayer( id );
	this.addLayer( tileLayer.layer, tileLayer.name, true );
	return this;
};

MapControl.prototype.datalayer = function ( id, layer ) {
	if ( typeof id === 'object' ) {
		var self = this;
		$.each( id, function ( group, groupLayer ) {
			self.datalayer( group, groupLayer );
		} );
		return this;
	}
	this.addLayer(
		layer,
		wikivoyage.formatLayerName( message( 'group' ) + id ),
		true
	);
	return this;
};

export default MapControl;
