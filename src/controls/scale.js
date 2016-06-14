import L from 'leaflet';

/*jscs:disable disallowDanglingUnderscores, requireVarDeclFirst */
var ControlScale = L.Control.Scale.extend( {

	isMetric: true,

	_updateScales: function ( options, maxMeters ) {

		L.Control.Scale.prototype._updateScales.call( this, options, maxMeters );

		this._toggleScale();
	},

	_addScales: function ( options, className, container ) {
		L.Control.Scale.prototype._addScales.call( this, options, className, container );

		if ( options.metric && options.imperial ) {
			L.DomEvent.addListener( this._mScale, 'click', this._onToggleScale, this );
			L.DomEvent.addListener( this._iScale, 'click', this._onToggleScale, this );
			L.DomEvent.disableClickPropagation( container );
		}
	},

	_toggleScale: function () {
		if ( this.options.metric && this.options.imperial ) {
			this._mScale.style.display = this.isMetric ? 'block' : 'none';
			this._iScale.style.display = !this.isMetric ? 'block' : 'none';
		}
	},

	_onToggleScale: function () {
		this.isMetric = !this.isMetric;
		this._toggleScale();
	}
} );

export default ControlScale;
