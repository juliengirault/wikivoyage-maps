import $ from 'jquery';
import mw from 'mediawiki';
import wikivoyage from './mw.wikivoyage.js';
import maptiles from './data/maptiles.json';

mw.wikivoyage = wikivoyage;

function wikivoyageMe( map, isFullScreen ) {

	var wvmap = wikivoyage.map( map );

	// wvmap.controlLayers()
	// 	.basemap( 'mapnik' )
	// 	.basemap( 'mapquestopen' )
	// 	.basemap( 'mapquest' )
	// 	.basemap( 'landscape' )
	// 	.overlay( 'traffic' )
	// 	.overlay( 'maplabels' )
	// 	.overlay( 'boundaries' )
	// 	.overlay( 'hill' )
	// 	.overlay( 'cycling' )
	// 	.overlay( 'hiking' )
	// 	.datalayer( this.map.dataLayers )
	// 	.update();

	wvmap.controlLayers().addAll();
	wvmap.scale();
	wvmap.nearby();

	return wvmap;
}

mw.hook( 'wikipage.maps' ).add( function ( map, isFullScreen ) {

	$.each( maptiles, function ( i, tile ) {
		wikivoyage.addTileLayer( i, tile.tilesUrl, tile.options );
	} );

	// init ?
	if ( $.isArray( map ) ) {
		$.each( map, function ( i, m ) {
			wikivoyageMe( m, isFullScreen );
		} )
	} else {
		wikivoyageMe( map, isFullScreen );
	}
} );
