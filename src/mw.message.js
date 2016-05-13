import mw from 'mediawiki';
import labels from './i18n/en.json';

mw.messages.set( labels );

export default function ( key, action ) {
	action = action || 'escaped';
	return mw.message( 'kartographer-wv-' + key )[ action ]();
};
