var fetchArticlesDeferred,
	data;

export default function () {
	if ( fetchArticlesDeferred ) {
		return fetchArticlesDeferred;
	} else {
		fetchArticlesDeferred = $.Deferred();
	}

	if ( !data ) {
		// fetch
		$.getScript( 'https://tools.wmflabs.org/wikivoyage/w/data/en-articles.js' )
			.done( function ( script, textStatus ) {
				data = window.addressPoints;
				fetchArticlesDeferred.resolve( data ).promise();
			} );
	} else {
		fetchArticlesDeferred.resolve( data );
	}
	return fetchArticlesDeferred.promise();
}
