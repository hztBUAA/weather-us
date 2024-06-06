<template>
    <div id="map" class="map"></div>
</template>
  
<script>
import Axios from 'axios'
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import tileGrid from 'ol/tilegrid/WMTS.js'
import View from 'ol/View.js';
import WMTS from 'ol/source/WMTS.js';
import {get as getProjection} from 'ol/proj.js';
import {getTopLeft, getWidth} from 'ol/extent.js';
export default {
    props: [
    ],
    data() {
      return {
        
      }
    },
    mounted() {
        this.initGeo()
    },
    methods: {
        async initGeo() {
            const projection = getProjection('EPSG:4326');
            const projectionExtent = projection.getExtent();
            const size = getWidth(projectionExtent) / 256;
            //const resolutions = new Array(14);
            var resolutions = [
                0.703125,
                0.3515625,
                0.17578125,
                0.087890625,
                0.0439453125,
                0.02197265625,
                0.010986328125,
                0.0054931640625,
                0.00274658203125,
                0.001373291015625,
                0.0006866455078125,
                0.00034332275390625,
                0.000171661376953125,
                0.0000858306884765625,
                0.00004291534423828125,
                0.000021457672119140625,
                0.000010728836059570312,
                0.000005364418029785156,
                0.000002682209014892578,
                0.000001341104507446289
            ];
            var matrixIds = new Array(14);
            for (var z = 0; z < 14; ++z) {
                //resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;
            }
            let map;
                //console.log(options)
                /*
                map = new Map({
                    layers: [
                        new TileLayer({
                            opacity: 1,
                            source: new WMTS(options),
                        }),
                    ],
                    target: 'map',
                    view: new View({
                        center: [0, 90],
                        zoom: 5,
                    }),
                });*/
                //console.log(getTopLeft(projectionExtent))
                map = new Map({
                    target: 'map',
                    view: new View({
                        center: [50, 95],
                        zoom: 5,
                        multiWorld: true
                    }),
                    layers: [new TileLayer({
                        opacity: 1,
                        source: new WMTS({
                            //url: (window.isLocal ? window.server : "https://iserver.supermap.io")+"/iserver/services/map-china400/wmts100",
                            url: 'https://igss.cgs.gov.cn:6160/igs/rest/ogc/qg50w_20210416_F7qGy9A7/WMTSServer?tk=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGZkNTRjYS0zZDI3LTRkNmQtYTc3Zi1kNjU5ODA1YWZmZmQifQ.XdWKleFg_Zp2Z6QUz9cdZbPEEedLfL1bqOUDIpjk6ZI',
                            layer: 'qg50w_20210416_F7qGy9A7',
                            matrixSet: 'EPSG:4326_qg50w_20210416_F7qGy9A7_028mm_GB',
                            format: 'image/png',
                            tileGrid: new tileGrid({
                                origin: [-285, 53],
                                resolutions: resolutions,
                                matrixIds: matrixIds
                            }),
                            style: 'default',
                            projection: projection
                        })
                    })]
                });
            
        }
    }
}
</script>

<style>
    @import "../../../node_modules/ol/ol.css";
    .map {
        width: 100%;
        height: 100%;
    }
</style>
  