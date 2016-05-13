import WikivoyageMap from './map/map';
import $ from 'jquery';
import mw from 'mediawiki';
import message from './mw.message';

/*jscs:disable requireVarDeclFirst */
var maps = [],
	tileLayerDefs = {},
	areExternalAllowed,
	windowManager,
	messageDialog,
	STORAGE_KEY = 'mwKartographerExternalSources';

mw.loader.using( 'oojs-ui' );

function getWindowManager() {
	if ( windowManager ) {
		return windowManager;
	}
	messageDialog = new OO.ui.MessageDialog();
	windowManager = new OO.ui.WindowManager();
	$( 'body' ).append( windowManager.$element );
	windowManager.addWindows( [ messageDialog ] );
	return windowManager;
}

function alertExternalData() {
	return getWindowManager().openWindow( messageDialog, {
		title: message( 'warning-external-source-title', 'text' ),
		message: message( 'warning-external-source-message', 'text' ),
		actions: [
			{ label: message( 'warning-external-source-disagree', 'text' ), action: 'bad' },
			{
				label: message( 'warning-external-source-agree', 'text' ),
				action: 'good'
			}
		]
	} );
}

export default {
	map: function ( map ) {
		var wikivoyageMap = new WikivoyageMap( map );
		return wikivoyageMap;
	},

	addTileLayer: function ( id, url, options ) {
		options.wvLayerId = id;
		options.attribution = options.attribution || '';
		$.each( options.attribs, function ( i, attrib ) {
			options.attribution += attrib.label + ' ';
			options.attribution += ' <a href="' + attrib.url + '">' + attrib.name + '</a>';
		} );

		tileLayerDefs[ id.toString() ] = {
			url: url,
			options: options
		};
		return this;
	},

	createTileLayer: function ( id ) {
		var layerDefs = tileLayerDefs[ id ];
		return {
			layer: new L.TileLayer( layerDefs.url, layerDefs.options ),
			name: this.formatLayerName( message( layerDefs.options.wvName ), layerDefs.options )
		};
	},

	formatLayerName: function ( name, options ) {
		var icon;
		options = options || {};
		if ( options.wvIsExternal ) {
			icon = 'http://maps.wikivoyage-ev.org/w/lib/images/external.png';
		} else if ( options.wvIsWMF ) {
			icon = 'https://tools.wmflabs.org/wikivoyage/w/lib/images/wmf-logo-12.png';
		}
		return name + ( icon ? ' <img src="' + icon + '" />' : '' );
	},

	isAllowed: function ( layer ) {
		var deferred = $.Deferred();

		if ( areExternalAllowed === undefined ) {
			areExternalAllowed = mw.storage.get( STORAGE_KEY ) === '1';
		}

		if ( !layer.options.wvIsExternal || areExternalAllowed ) {
			deferred.resolve();
		} else {
			alertExternalData()
				.then( function ( opened ) {
					opened.then( function ( closing, data ) {
						if ( data && data.action && data.action === 'good' ) {
							areExternalAllowed = true;
							mw.storage.set( STORAGE_KEY, '1' );
							deferred.resolve();
						} else {
							deferred.reject();
						}
					} );
				} );
		}

		return deferred.promise();
	}
};
