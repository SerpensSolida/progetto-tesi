import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {all as allStrategy} from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import {Fill, Icon, RegularShape, Stroke, Style} from "ol/style";
import {ImageWMS, Raster, TileImage, TileWMS} from "ol/source";
import ImageLayer from "ol/layer/Image";

//GeoJSON data folder.
const geoJSONFolder = "/webgis/data/";
export const iconPath = "/webgis/icons/";

//Init GeoJson format.
const geoJson = new GeoJSON(
	{
		dataProjection: "EPSG:4326",
		extractGeometryName: true,
	});


//Tile layer source.
const mapLayerParam =
	{
		source: new OSM(
			{
				url: "https://maps.refuges.info/hiking/{z}/{x}/{y}.png"
			})
	};

//Tile layer.
export const mapLayer = new TileLayer(mapLayerParam);

//Marche geologic layer source.
const marcheWMS = "http://wms.cartografia.marche.it/geoserver/Geologia/wms";
const marcheGeologicLayerSource = new ImageWMS(
	{
		url: marcheWMS,
		params:
			{
				layers: 'CartaGeologica',
				tiled: true,
				srs: 'EPSG:4326',
				bgcolor: "0xFFFFFF",
				transparent: true,
				format: "image/png",
			},
		crossOrigin: 'anonymous',
		serverType: 'geoserver',
	});

//Convert to raster for editing.
const modifiedGeologicSource = new Raster(
	{
		sources: [marcheGeologicLayerSource],
		crossOrigin: 'anonymous',
		operation: (pixels, data) =>
		{
			let pixel = pixels[0];

			if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255)
				pixel[3] = 0;

			return pixels[0];
		}
	});

//Marche Geologic layer
export const marcheGeologicLayer = new ImageLayer(
	{
		title: "Carta Geologica della Regione Marche (1:10.000)",
		visible: false,
		source: modifiedGeologicSource,
	});

//Italy Geologic layer source.
const italyWMS = "http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Carta_geologica.map";
const italyGeologicLayerSource = new TileWMS(
	{
		url: italyWMS,
		params:
			{
				layers: 'GE.CARTAGEOLOGICA',
				tiled: true,
				srs: 'EPSG:4326',
				bgcolor: "0xFFFFFF",
				transparent: true,
				format: "image/png",
			},
		crossOrigin: 'anonymous',
		serverType: 'geoserver',
	});

//Geologic layer.
export const italyGeologicLayer = new TileLayer(
	{
		source: italyGeologicLayerSource,
		title: "Carta Geologica d'Italia (1:100.000)",
		visible: false,
	});

//Tracks layer source.
const trackSource = new VectorSource(
	{
		format: geoJson,
		url: geoJSONFolder + "tracks.geojson",
		strategy: allStrategy
	});

//Track layer.
export const tracksColors = ["#448aff", "#1565c0", "#009688", "#8bc34a", "#ffc107", "#ff9800", "#f44336", "#ad1457"];
export const tracksLayer = new VectorLayer(
	{
		source: trackSource,
		title: "Tratte",
		style: (feature) =>
			[
				new Style(
				{
					stroke: new Stroke(
						{
							color: "black",
							width: 5.25,
						}),
				}),
				new Style(
					{
						stroke: new Stroke(
							{
								color: tracksColors[feature.get("id")],
								width: 4,
							}),
					})
			]
	});

//Sections layer source from geoserver.
const sectionsSource = new VectorSource(
	{
		format: geoJson,
		url: geoJSONFolder + "sezioni_geologiche.geojson",
		strategy: allStrategy
	})

//Sections layer.
export const sectionsLayer = new VectorLayer(
	{
		source: sectionsSource,
		title: "Sezioni geologiche",
		style: new Style(
			{
				stroke: new Stroke(
					{
						color: "rgba(10,10,10,0.75)",
						width: 5.25,
						lineDash: [4, 10],
					}),
			}),
	});

//Icon colors.
export const iconColor = "#000000";
export const backgroundColor = "#ffffff";
export const iconBackground = new RegularShape(
	{
		fill: new Fill({color: backgroundColor}),
		stroke: new Stroke(
			{
				color: iconColor,
				width: 2
			}),
		points: 16,
		radius: 13,
		rotation: 3.14 / 4,
		declutterMode: "obstacle"
	});

//Style used by layers.
export function iconStyle(feature)
{
	const icon = feature.get("icona");
	const featureColor = feature.get("colore")
	const iconColor = featureColor ? "#" + featureColor : "#000";

	const style =
		[
			new Style(
				{
					image: new RegularShape(
						{
							fill: new Fill({color: backgroundColor}),
							stroke: new Stroke(
								{
									color: iconColor,
									width: 2
								}),
							points: 16,
							radius: 13,
							rotation: 3.14 / 4,
							declutterMode: "obstacle"
						}),
				}),
			new Style(
				{
					image: new Icon(
						{
							src: iconPath + icon,
							color: iconColor,
							scale: 0.03,
						})
				})
		];

	return style;
}

//Food and sleep layer source from geoserver.
const foodAndSleepSource = new VectorSource(
	{
		format: geoJson,
		url: geoJSONFolder + "mangiare_e_dormire.geojson",
		strategy: allStrategy
	})

//Food and sleep layer.
export const foodAndSleepLayer = new VectorLayer(
	{
		source: foodAndSleepSource,
		title: "Mangiare e dormire",
		style: iconStyle
	});

//Info and safety layer source from geoserver.
const infoAndSafetySource = new VectorSource(
	{
		format: geoJson,
		url: geoJSONFolder + "info_e_sicurezza.geojson",
		strategy: allStrategy
	})

//Info and safety layer.
export const infoAndSafetyLayer = new VectorLayer(
	{
		source: infoAndSafetySource,
		title: "Info e sicurezza",
		style: iconStyle
	});