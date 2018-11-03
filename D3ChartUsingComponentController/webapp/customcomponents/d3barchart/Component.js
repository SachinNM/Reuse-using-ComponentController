sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/m/Button"
], function (UIComponent, Button) {
	"use strict";

	return UIComponent.extend("d3sample.customcomponents.d3barchart.Component", {

		metadata: {
			manifest: "json",
			properties: {
				width: {
					type: "int",
					defaultValue: 500
				},
				height: {
					type: "int",
					defaultValue: 300
				},
				data: {
					type: "sap.ui.base.ManagedObject"
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// enable routing
				this.getRouter().initialize();
			}
			/*
					createContent: function () {
						this._oBtn = new Button({
							text : "Test Button"
						});
						return this._oBtn;
					}*/

	});

});