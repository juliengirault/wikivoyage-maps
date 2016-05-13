import json from 'rollup-plugin-json';
import fs from 'fs';

var banner = fs.readFileSync( './rollup/banner.js.txt', 'utf8' ) +
	fs.readFileSync( './node_modules/prunecluster/dist/PruneCluster.js', 'utf8' );

var footer = fs.readFileSync( './rollup/footer.js.txt', 'utf8' );

export default {
	entry: 'src/index.js',
	format: 'iife',
	globals: {
		'jquery': '$',
		'leaflet': 'L',
		'mediawiki': 'mw',
		'prunecluster': 'PruneClusterForLeaflet'
	},
	banner: banner,
	footer: footer,
	plugins: [ json() ],
	dest: 'dist/Mediawiki:Kartographer.js'
};
