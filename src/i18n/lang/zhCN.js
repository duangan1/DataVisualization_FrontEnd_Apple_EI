const export_ = {
  route: {
    index: '首页',
    security: '安全',
    user: '用户',
    role: '角色',
    menu: '菜单',
    lookupType: '列表值',
    userProfile: '个人信息',
    engineeringDatabase: 'Engineering Database',
    dim: 'Dim Summary',
    cellQualData: 'Cell Qual Data',
    ei: 'EI',
    masterData: '主数据',
    vendor: '供应商',
    project: '项目',
    part: '物料',
    build: '版本',
    dv: '可视化',
    lineChart: '折线图',
    histogramChart: '柱状图',
    boxplotChart: '箱线图',
    hotMapChart: '热图'
  },
  core: {
    new: '新建',
    edit: '修改',
    search: '查询',
    reset: '重置',
    upload: '上传',
    download: '下载',
    exportList: '导出',
    delete: '删除',
    confirm: '确定',
    cancel: '取消',
    noDataFound: '未找到数据 ',
    useExportAsTemplate: '使用导出的excel作为模板，拷贝Excel的数据然后粘贴',
    title: '标题',
    return: '返回',
    headerInfo: '头部信息',
    detailInfo: '明细信息',
    tips: '提示',
    refreshData: '刷新数据',
    calcData: '计算',
    saveSuccess: '保存成功',
    deletionSuccess: '删除成功',
    submitSuccess: '提交成功',
    finishSuccess: '完成成功',
    uploadSuccess: '上传成功',
    uploadCounterSSuccess: '成功上传{counnter}条 ',
    createdAt: '创建时间',
    creatorName: '创建人',
    deleteRemindMsg: '此操作将永久删除该数据, 是否继续?',
    deletionCanceled: '已取消删除',
    updateSuccess: '更新成功'
  },
  ei: {
    summary: {
      cncStation: 'CNC Station',
      ruleName: '规则',
      versionNo: '版本号',
      technician: '技术员',
      headerDate: '日期',
      faiSpcAlignmentCheck: 'FAI/SPC Alignment Check',
      faiNo: 'FAI#',
      machineNo: 'Machine#',
      checkResultInfo: '检查结果',
      refreshMsg: '刷新数据会导致明细信息和检查结果被清空，确定刷新？',
      refreshCanceled: '刷新取消',
      refreshSuccess: '刷新成功',
      calcMsg: '计算可能导致当前数据丢失，确定计算？',
      calcCanceled: '计算取消',
      calcSuccess: '计算成功',
      updateChkResult: '更新检查结果',
      chkResult: '检查结果'
    },
    part: {
      rule: {
        type: 'Type is required',
        partNo: 'Part No is required',
        version: 'version is required',
        fullName: 'Full Name is required'
      },
      partVersion: '物料版本号',
      partNo: '物料编号'
    },
    project: {
      rule: {
        projectNo: 'Project No is required',
        fullName: ' Full Name is required'
      }
    },
    vendor: {
      rule: {
        vendorNo: 'Vendor No is required',
        fullName: ' Full Name is required'
      }
    },
    cellQual: {
      title: '标题',
      project: '项目',
      build: 'Build',
      partNo: '物料',
      partVersion: 'Part Version',
      dataRound: 'Round',
      vendor: '供应商',
      generateJMP: '产生 JMP',
      generateJMPConfirm: '请等待大约1分钟',
      uploadStatus: '上传状态',
      jmpStatus: 'JMP状态',
      downloadJMP: '下载 JMP',
      message: '错误消息',
      cncSatation: 'CNC Satation'
    }
  },
  dv:{
    line: {
      title: '标题',
      selectMoreBtn: '选择更多',
      mutlipleRecsFound:'未匹配到唯一原始数据文件，请检查搜索条件！'
    }
  }
}
export default export_
