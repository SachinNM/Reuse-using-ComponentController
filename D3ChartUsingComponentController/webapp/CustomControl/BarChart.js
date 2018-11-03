sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/HTML",
	"sap/ui/core/ResizeHandler",
	"d3sample/resources/sap/ui/thirdparty/d3"
], function (Control, HTML, ResizeHandler) {
	"use strict";
	return Control.extend("d3sample.CustomControl.BarChart", {
		metadata: {
			properties: {
				width: {
					type: "int",
					defaultValue: 500
				},
				height: {
					type: "int",
					defaultValue: 300
				}
			},
			aggregations: {
				_html: {
					type: "sap.ui.core.HTML",
					multiple: false,
					visibility: "hidden"
				},
				data: {
					type: "sap.ui.base.ManagedObject"
				}
			}
		},

		init: function () {
			this._sContainerId = this.getId() + "--contrainer";
			this.setAggregation("_html", new HTML({
				content: "<svg id='" + this._sContainerId + "'></svg>"
			}));
		},

		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_html"));
			oRM.write("</div>");
		},

		onAfterRendering: function () {

			this.iWidth = this.getWidth();
			this.iHeight = this.getHeight();
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

			this._sResizeHandlerId = ResizeHandler.register(this, jQuery.proxy(this._onResize, this));

		},

		onBeforeRendering: function () {
			ResizeHandler.deregister(this._sResizeHandlerId);
		},
		
		exit: function() {
			ResizeHandler.deregister(this._sResizeHandlerId);
		},
		
		_onResize: function (oEvent) {
			this.iHeight = this.getHeight() < oEvent.size.height ? this.getHeight() : oEvent.size.height;
			this.iWidth = this.getWidth() < oEvent.size.width - 32 ? this.getWidth() : oEvent.size.width;
			this.renderChartData();
		},

		renderChartData: function () {
			var aData = this.getBinding("data").getContexts().map(function (oContext) {
				return oContext.getObject();
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
				.attr("fill", "steelblue")
				.selectAll("rect");

			// Update
			oRect.data(aData)
				.enter().append("rect")
				.attr("x", function (d) {
					return oScaleX(d.Name);
				}.bind(this))
				.attr("y", function (d) {
					return oScaleY(d.Value);
				}.bind(this))
				.attr("height", function (d) {
					return oScaleY(0) - oScaleY(d.Value);
				}.bind(this))
				.attr("width", oScaleX.bandwidth());

			// Exit
			oRect.exit().remove();
		}
	});
});