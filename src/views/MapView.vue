<template>
    <div>
        <div ref="charts" style="width: 100vw; height: 100vh"></div>
        <div class="float" style="top: 3%; left: 3%; display: flex; align-items: center; justify-content: center; height: 42px">
            <el-button plain size="medium" style="margin-right: 25px"
            @click="back">
                <i class="el-icon-caret-left"></i>&nbsp;回退
            </el-button>
            <el-cascader style="margin-right: 25px"
                placeholder="搜索城市"
                :options="cities"
                filterable
                :props="{ expandTrigger: 'hover' }"
                @change="chooseCity">
            </el-cascader>
            <el-color-picker 
                v-model="backgroundColor"
                show-alpha
                @active-change="colorChange"
                :predefine="predefineColors">
            </el-color-picker>
        </div>
        <div class="float" style="top: 5%; right: 3%; display: grid; width: 40px">
            <el-button circle size="medium" style="margin-bottom: 25px" id="b1" @click="changeInfo"> 1 </el-button>
            <el-button circle size="medium" style="margin-bottom: 25px; margin-left: 0px" id="b2" @click="changeInfo"> 2 </el-button>
            <el-button circle size="medium" style="margin-bottom: 25px; margin-left: 0px" id="b3" @click="changeInfo"> 3 </el-button>
            <el-button circle size="medium" style="margin-bottom: 25px; margin-left: 0px" id="b4" @click="changeInfo"> 4 </el-button>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import mapData from "../assets/jsonData/china.json"
import cityData from "../assets/jsonData/city.json"
import { getCityJson } from "../api/staticApi";
import { getCityData } from "../api/dataApi"
const predefineColors = ['#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585']
const emphasis = {
    label: {
        fontSize: 14,
        textStyle: {
            color: "#eee",
        }
    },
    itemStyle: {
        areaColor: "#rgb(147, 235, 248)",
        opacity: 0.2,
        borderWidth: 0,
    }
}
const geoOption = {
    zoom: 1,
    emphasis: emphasis,
    label: {
        show: true,
        fontSize: 14,
        textStyle: {
            color: "#1e1e1e",
        }
    },
    itemStyle: {
        borderWidth: 0,
        areaColor: {                        
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
                {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)",
                },
                {
                    offset: 1,
                    color: "rgba(147, 235, 248, 0.2)",
                }
            ],
            globalCoord: false
        },
         /*
        shadowColor: "rgba(128, 217, 248, 1)",
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        */
    }
};
const option = {
    animation: false,
    animationDuration: 0,
    animationDurationUpdate: 0,
    backgroundColor: "#cccccc",
};
export default {
    data() {
        return {
            backgroundColor: '#cccccc',
            predefineColors: predefineColors,
            emphasis: emphasis,
            geoOption: geoOption,
            option: option,
            charts : null,
            layer: 0,
            map1: null,
            geo1: null,
            glabalBounding: [],
            cities: []
        };
    },
    created() {
        this.$nextTick(() => {
            this.initMap();
            this.initCities();
        })
    },
    methods: {
        changeInfo(p) {
            console.log(p)
            this.showData("test")
        },
        initCities() {
            const that = this
            mapData.features.forEach(function(feature) {
                if (feature.properties.adcode != 100000) {
                    const pro = {value: feature.properties.adcode, label: feature.properties.name, children: []}
                    getCityJson(feature.properties.adcode).then((res) => {
                        res.data.features.forEach(function(childFeature) {
                            const city = {value: childFeature.properties.adcode, label: childFeature.properties.name}
                            pro.children.push(city)
                        })
                    })
                    that.cities.push(pro)
                }
            })
        },
        colorChange(color) {
            const option = this.charts.getOption()
            option.backgroundColor = color
            this.charts.setOption(option)
        },
        back() {
            const option = this.charts.getOption();
            if (this.layer == 1) {
                this.layer = 0;
                this.map1 = null;
                this.geo1 = null;
                option.geo[2] = null;
                option.geo[0].boundingCoords = this.glabalBounding;
                option.geo[1].boundingCoords = this.glabalBounding;
                this.charts.setOption(option, true);
            }/* else if (this.layer == 2) {
                this.layer = 1;
                const newBoundingCoords = this.calBounding(this.map1);
                option.geo[1] = this.geo1;
                echarts.registerMap(this.geo1.map, this.map1);
                option.geo[0].boundingCoords = newBoundingCoords;
                option.geo[1].boundingCoords = newBoundingCoords;
                this.charts.setOption(option, true);
            }*/
        },
        calBounding(geoJsonData) {
            let boundingCoords = [
                [Infinity, -Infinity],
                [-Infinity, Infinity],
            ];
            geoJsonData.features.forEach(function (feature) {
                const coordinates = feature.geometry.coordinates;
                coordinates.forEach(function ([coords]) {
                    coords.forEach(function (coord) {
                        boundingCoords[0][0] = Math.min(boundingCoords[0][0], coord[0]);
                        boundingCoords[0][1] = Math.max(boundingCoords[0][1], coord[1]);
                        boundingCoords[1][0] = Math.max(boundingCoords[1][0], coord[0]);
                        boundingCoords[1][1] = Math.min(boundingCoords[1][1], coord[1]);
                    
                    })
                })
            });
            return boundingCoords;
        },
        async getAllData(type) {
            const data = []
            cityData.features.forEach(function(feature) {
                getCityData(feature.properties.adcode, type).then((res) => {
                    data.push({name: feature.properties.name, value: res})
                })
            })
            return data
        },
        showData(type) {
            var option = this.charts.getOption();
            this.getAllData(type).then((res) => {
                option = {...option, ...{
                    visualMap: {
                        type: 'continuous',
                        min: 0,
                        max: 100,
                        left: '6%',
                        bottom: '5%',
                        itemWidth: 30,
                        itemHeight: 180,
                        inRange: {
                            color: ['#fff', '#415325']
                        },
                        text: ['100', '0']
                    },
                    series: [
                        {
                            type: 'map',
                            geoIndex: 0,
                            data: res
                        }
                    ]
                }}
                this.charts.setOption(option, true)
                })
        },
        chooseCity(city) {
            const option = this.charts.getOption()
            mapData.features.forEach((feature) => {
                if (feature.properties.adcode === city[0]) {
                    getCityJson(feature.properties.adcode).then((res) => {
                        const newBoundingCoords = this.calBounding(res.data);
                        const newGeo = {
                            ...{map: feature.properties.name, boundingCoords: this.glabalBounding, zlevel: 1},
                            ...this.geoOption
                        }
                        option.geo[2] = newGeo;
                        echarts.registerMap(feature.properties.name, res.data);
                        this.charts.setOption(option);
                        option.geo[0].boundingCoords = newBoundingCoords;
                        option.geo[1].boundingCoords = newBoundingCoords;
                        option.geo[2].boundingCoords = newBoundingCoords;
                        this.charts.setOption(option);
                        this.layer = 1;
                        this.map1 = res.data;
                        this.geo1 = newGeo;
                    })
                }
            })
        },
        initMap() {
            this.charts = echarts.init(this.$refs["charts"]);
            const boundingCoords = this.calBounding(mapData);
            this.glabalBounding = [[boundingCoords[0][0] + 20, boundingCoords[0][1] - 2], [boundingCoords[1][0] - 20, boundingCoords[1][1] + 17]];
            this.option.geo = [
                {...{map: "china_second", 
                boundingCoords: this.glabalBounding, 
                zlevel: 0, 
                roam: false,
                show: true,
                emphasis: this.emphasis,
                scaleLimit: {
                    min: 1,
                    max: 13
                }}}, 
                {...{map: "china", 
                boundingCoords: this.glabalBounding, 
                zlevel: 1,
                roam: false,
                show: true, 
                scaleLimit: {
                    min: 1,
                    max: 13
                },}, ...this.geoOption}]
            echarts.registerMap("china", mapData);
            echarts.registerMap("china_second", cityData);
            this.charts.setOption(this.option);
            this.showData("test")
            const that = this;
            this.charts.on('click', function(param) {
                if (that.layer == 0) {
                    mapData.features.forEach((feature) => {
                        if (feature.properties.name === param.name) {
                            getCityJson(feature.properties.adcode).then((res) => {
                                const newBoundingCoords = that.calBounding(res.data);
                                const newGeo = {
                                    ...{map: param.name, boundingCoords: that.glabalBounding, zlevel: 1},
                                    ... that.geoOption
                                }
                                that.option.geo[2] = newGeo;
                                echarts.registerMap(param.name, res.data);
                                that.charts.setOption(that.option);
                                that.option.geo[0].boundingCoords = newBoundingCoords;
                                that.option.geo[1].boundingCoords = newBoundingCoords;
                                that.option.geo[2].boundingCoords = newBoundingCoords;
                                that.charts.setOption(that.option);
                                that.layer = 1;
                                that.map1 = res.data;
                                that.geo1 = newGeo;
                            })
                        }
                    })
                }/* else if (that.layer == 1) {
                    that.map1.features.forEach((feature) => {
                        if (feature.properties.name === param.name) {
                            getCityJson(feature.properties.adcode).then((res) => {
                                const newBoundingCoords = that.calBounding(res.data);
                                const newGeo = {
                                    ...{map: param.name, boundingCoords: boundingCoords, zlevel: 1},
                                    ... geoOption
                                }
                                option.geo[1] = newGeo;
                                echarts.registerMap(param.name, res.data);
                                that.charts.setOption(option);
                                option.geo[0].boundingCoords = newBoundingCoords;
                                option.geo[1].boundingCoords = newBoundingCoords;
                                that.charts.setOption(option);
                                that.layer = 2;
                            })
                        }
                    })
                }*/
            });
            /*
            this.charts.on('geoRoam', function(params) {
                var newOption = that.charts.getOption()
                if (that.layer == 0) {
                    if (params.zoom != null && params.zoom != undefined) {
                        newOption.geo[0].zoom = newOption.geo[1].zoom
                    }
                    newOption.geo[0].center = newOption.geo[1].center
                } else {
                    if (params.zoom != null && params.zoom != undefined) {
                        newOption.geo[1].zoom = newOption.geo[0].zoom
                    }
                    newOption.geo[1].center = newOption.geo[0].center
                }
                that.charts.setOption(newOption)
            });
            */
        }
    }
}
</script>

<style>
*{
    margin:0;
    padding:0;
}
.move_button,
.float {
    position: fixed;
    z-index: 5;
}

.move_button {
    opacity: 0.5;
}

.move_button:hover {
    opacity: 0.8;
}
</style>