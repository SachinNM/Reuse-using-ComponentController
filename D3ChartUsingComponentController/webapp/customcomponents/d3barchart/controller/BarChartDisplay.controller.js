sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ResizeHandler",
], function (Controller, JSONModel, ResizeHandler) {
	"use strict";

	return Controller.extend("d3sample.controller.ResultDisplay", {
		onInit: function () {
			this._sContainerId = "BarChartSVGComponent--container";
			var oHTML = this.byId("BarChartComponent");
			oHTML.setContent("<svg id='" + this._sContainerId + "'></svg>");
		},

		onAfterRendering: function () {
			this.iWidth = this.getOwnerComponent().getWidth();
			this.iHeight = this.getOwnerComponent().getHeight();
			this.oMargin = {
				top: 20,
				right: 0,
				bottom: 30,
				left: 40
			};

			this.oSvg = d3.select("#" + this._sContainerId)
				.attr("width", this.iWidth)
				.attr("height", this.iHeight);

			this.renderChartData();

			if (!this._sResizeHandlerId) {
				this._sResizeHandlerId = ResizeHandler.register(this, jQuery.proxy(this._onResize, this));
			}
		},

		onBeforeRendering: function () {
			ResizeHandler.deregister(this._sResizeHandlerId);
		},

		onExit: function () {
			ResizeHandler.deregister(this._sResizeHandlerId);
		},

		_onResize: function (oEvent) {
			this.iHeight = this.getHeight() < oEvent.size.height ? this.getHeight() : oEvent.size.height;
			this.iWidth = this.getWidth() < oEvent.size.width - 32 ? this.getWidth() : oEvent.size.width;
			this.renderChartData();
		},

		renderChartData: function () {
			var aData = this.getOwnerComponent().getData().map(function (oObject) {
				return {
					Name: oObject.Name,
					Value: parseFloat(oObject.Value)
				};
			});

			// To Handle resize, Used as quick solution due to short of time :)
			this.oSvg.selectAll("*").remove();

			var oScaleX = d3.scaleBand()
				.domain(aData.map(function (d) {
					return d.Name;
				}))
				.range([this.oMargin.left, this.iWidth - this.oMargin.right])
				.padding(0.1);

			var oScaleY = d3.scaleLinear()
				.domain([0, d3.max(aData, function (d) {
					return parseFloat(d.Value);
				})]).nice()
				.range([this.iHeight - this.oMargin.bottom, this.oMargin.top]);

			var oXAxis = this.oSvg.append("g")
				.attr("transform", "translate(0," + (this.iHeight - this.oMargin.bottom) + ")")
				.call(d3.axisBottom(oScaleX));

			var oYAxis = this.oSvg.append("g")
				.attr("transform", "translate(" + this.oMargin.left + ",0)")
				.call(d3.axisLeft(oScaleY));

			// Enter
			var oRect = this.oSvg
				.append("g")
				.attr("fill", "orange")
				.selectAll("rect")
				.data(aData)
				.enter().append("rect");

			// Update
			oRect.attr("x", function (d) {
					return oScaleX(d.Name);
				}.bind(this))
				.attr("y", function (d) {
					return oScaleY(parseFloat(d.Value));
				}.bind(this))
				.attr("height", function (d) {
					return oScaleY(0) - oScaleY(parseFloat(d.Value));
				}.bind(this))
				.attr("width", oScaleX.bandwidth());

			// Exit
			oRect.exit().remove();
		}

	});
});