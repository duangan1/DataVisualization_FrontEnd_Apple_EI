<template>
    <div class="app-container">
        <OptionBar 
        ref ="option"
        @dataChanged = "updateData"
        />
        <title-of-project 
        v-show="showVendorProjectTitle" 
        :cellQualProjName="cellQual.projName"
        :cellQualVendorName="cellQual.vendorName"
        />
        <div ref="chartDv" style="width: 100%;height: 600px"></div>
    </div>
    
</template>

<script>
import OptionBar from '../components/OptionBar.vue'
import TitleOfProject from '../components/TItleOfProject.vue'
import echarts from 'echarts';
import 'echarts/dist/extension/dataTool';

export default {
    name: 'BoxplotChart',
    components:{
        OptionBar,
        TitleOfProject
    },
    data() {
        return{
            showVendorProjectTitle:false,
            cellQual: {
                projName: '',
                vendorName: ''

            },
            plotDataAll: [],
            plotDataFormat: {}
        }
    },
    methods: {
        //将option组件request到的一些data传递到父组件使用
        updateData() {
            let option = this.$ref.option;
            this.cellQual.projName = option.cellQualProjName;
            this.cellQual.vendorName = option.cellqualVenderName;
            this.plotData = option.drawingData;
            this.plotDataAll = option.drawingData;
        },
        formatPlotData() {
            //
        }
    }
}

</script>