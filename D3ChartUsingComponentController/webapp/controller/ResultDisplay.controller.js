sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ComponentContainer",
	"sap/ui/base/ManagedObject",
	"d3sample/CustomControl/BarChart"
], function (Controller, JSONModel, ComponentContainer, ManagedObject, BarChart) {
	"use strict";

	return Controller.extend("d3sample.controller.ResultDisplay", {
		onInit: function () {
			var oModel;

			oModel = new JSONModel({
				customerSelectionLoaded: false
			});
			this.getView().setModel(oModel, "view");

			this._loadComponentManually();
			this._loadCustomControl();

		},

		_loadCustomControl: function () {
			var oChartTabBar = this.byId("IconTabChartCustomControl");
			var oChartControl = new BarChart({
				width: 1000,
				height: 500,
				data: {
					path: "DataModel>/",
					template: new ManagedObject()
				}
			});
			oChartTabBar.insertContent(oChartControl);
		},

		_loadComponentManually: function () {
			var oChartTabBar = this.byId("IconTabChartComponent");

			var oContainer = new sap.ui.core.ComponentContainer("CompCont2", {
				name: "d3sample.customcomponents.d3barchart",
				settings: {
					width: 1000,
					height: 500,
					data: {
						path: "DataModel>/",
						template: new ManagedObject()
					}
				},
				propagateModel: true
			});

			// place this Ui Container with the Component inside into UI Area 
			oContainer.placeAt(oChartTabBar);
		}
	});
});