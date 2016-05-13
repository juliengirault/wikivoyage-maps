import L from 'leaflet';
import $ from 'jquery';
import wikivoyage from '../mw.wikivoyage';
import getArticles from '../data/en-articles';

function mousepopup( marker, data ) {
	marker.bindPopup( data.title, { minWidth: 120, maxWidth: 120 } );
	marker.on( 'click', function ( e ) {
		this.openPopup();
	} );
}

/*jscs:disable disallowDanglingUnderscores, requireVarDeclFirst */
var ControlNearby = L.Control.extend( {
	options: {
		// Do not switch for RTL because zoom also stays in place
		position: 'topleft'
	},

	onAdd: function ( map ) {
		var container = L.DomUtil.create( 'div', 'leaflet-control-mapbox-share leaflet-bar' ),
			link = L.DomUtil.create( 'a', 'mapbox-geocoder mapbox-icon mapbox-icon-kartographer-nearby', container ),
			pruneCluster = new PruneClusterForLeaflet( 70 ),
			control = this;

		link.href = '#';
		link.title = mw.msg( 'kartographer-fullscreen-text' );
		pruneCluster.options = {
			wvIsOverlay: true,
			wvIsExternal: true,
			wvName: 'nearby-articles'
		};

		this.map = map;
		this.link = link;
		this.pruneCluster = pruneCluster;

		L.DomEvent.addListener( link, 'click', this._onToggleNearbyLayer, this );
		L.DomEvent.disableClickPropagation( container );

		map.on( 'overlayadd', this._onOverlayAdd, this );
		map.on( 'overlayremove', this._onOverlayRemove, this );

		return container;
	},

	_onOverlayAdd: function ( obj ) {
		var pruneCluster = this.pruneCluster;
		if ( pruneCluster !== obj.layer ) {
			return;
		}
		// Zoom out to get a better picture of the markers nearby.
		if ( this.map.getZoom() >= 12 ) {
			this.map.setZoom( 10 );
		}
		this._toggleActiveClass( true );
		if ( pruneCluster._objectsOnMap.length > 0 ) {
			return;
		}
		getArticles().done( function ( addressPoints ) {
			var nr = addressPoints.length,
				a, jslang = 'en',
				tp = '//upload.wikimedia.org/wikipedia/commons/thumb/', // thumbnail path
				ap = '//' + jslang + '.wikivoyage.org/wiki/', // WV article path
				i = 0;

			for ( i = 0; i < nr; i++ ) {
				a = addressPoints[ i ];
				pruneCluster.RegisterMarker( new PruneCluster.Marker( a[ 0 ], a[ 1 ], { title: '<img src="' + tp + a[ 3 ] + '/120px-' + a[ 3 ].substring( 5 ) + '"> <a href="' + ap + a[ 2 ] + '" target="_blank">' + a[ 2 ] + '</a>' } ) );
				pruneCluster.PrepareLeafletMarker = mousepopup;
			}
			pruneCluster.ProcessView();
		} );
	},

	_onOverlayRemove: function ( obj ) {
		if ( this.pruneCluster !== obj.layer ) {
			return;
		}
		this._toggleActiveClass( false );
	},

	_toggleActiveClass: function ( enabled ) {
		enabled = ( enabled !== undefined ) ? enabled : this.map.hasLayer( this.pruneCluster );
		$( this.link ).toggleClass( 'mapbox-icon-nearby-active', enabled );
	},

	_onToggleNearbyLayer: function ( e ) {
		var control = this,
			enabled = this.map.hasLayer( this.pruneCluster );

		L.DomEvent.stop( e );

		if ( !enabled ) {
			wikivoyage.isAllowed( this.pruneCluster )
				.done( function () {
					control.map.addLayer( control.pruneCluster );
				} );
		} else {
			this.map[ enabled ? 'removeLayer' : 'addLayer' ]( this.pruneCluster );
		}
	}
} );

export default ControlNearby;
