import L from 'leaflet';
import wikivoyage from '../mw.wikivoyage';

/*jscs:disable disallowDanglingUnderscores, requireVarDeclFirst */
var ControlLayers = L.Control.Layers.extend( {

	_addItem: function ( obj ) {
		var label = L.Control.Layers.prototype._addItem.call( this, obj );
		if ( !obj.overlay && label.childNodes[ 0 ].checked ) {
			this._previousSelected = label.childNodes[ 0 ];
		}
	},

	_onInputClick: function ( event ) {
		var self = this,
			proto = L.Control.Layers.prototype._onInputClick,
			input = event && event.target,
			obj;

		if ( input &&
			event.type === 'click' &&
			/leaflet-control-layers-selector/.test( input.className ) ) {

			obj = this._layers[ input.layerId ];
			if ( this._map.hasLayer( obj.layer ) ) {
				proto.call( self );
			} else {
				event.stopPropagation();
				if ( !obj.overlay && this._previousSelected ) {
					this._previousSelected.checked = true;
				}
				input.checked = false;
				this._expand();
				wikivoyage.isAllowed( obj.layer )
					.done( function () {
						input.checked = true;
						proto.call( self );
					} );
			}
		} else {
			proto.call( this );
		}
	}
} );

export default ControlLayers;
