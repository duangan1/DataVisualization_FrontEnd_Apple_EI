<template>
  <div class="title-container">
    <el-row>
      <div style="text-align:center;">
        <p style="font-size:22px;">
          <span style="font-weight:bold;">{{cellQualVendorName}}</span> -
          <span style="font-weight:bold;">{{cellQualProjName}}</span> <slot></slot>
          <span style="float:right;font-size:14px;">Updated At: {{cellQualDate}}</span>
        </p>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
    props:{
        cellQualProjName: {
            type: String,
            require: true
        },
        cellQualVendorName: {
            type: String,
            require: true
        },
        cellQualDate: {
          type: String
        },
        // chartType:{
        //   type: String,
        //   required: true,
        // }
    }
}
</script>