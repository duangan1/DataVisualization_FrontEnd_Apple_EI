const export_ = {
  route: {
    index: 'Dashboard',
    security: 'Security',
    user: 'User',
    role: 'Role',
    menu: 'Menu',
    lookupType: 'Lookup',
    userProfile: 'User Profile',
    engineeringDatabase: 'Engineering Database',
    dim: 'Dim Summary',
    cellQualData: 'Cell Qual Data',
    ei: 'EI',
    masterData: 'Master Data',
    vendor: 'Vendor',
    project: 'Project',
    part: 'Part',
    build: 'Build'
  },
  core: {
    new: 'New',
    edit: 'Edit',
    search: 'Search',
    reset: 'Reset',
    upload: 'Upload',
    download: 'Download',
    exportList: 'Export List',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    noDataFound: 'Data can ',
    error: 'Error',
    useExportAsTemplate: 'Copy and paste data from excel using exported as template',
    title: 'Title',
    return: 'Return',
    headerInfo: 'Header',
    detailInfo: 'Detail',
    tips: 'Tip',
    refreshData: 'Refresh Data',
    saveSuccess: 'Save Success',
    deletionSuccess: 'Deletion Success',
    submitSuccess: 'Submit Success',
    finishSuccess: 'Finish Success',
    uploadSuccess: 'Upload Success',
    uploadCounterSSuccess: 'Upload Success {counnter} ',
    createdAt: 'Creation Time',
    creatorName: 'Creater',
    deleteRemindMsg: 'This operation will permanently delete the data, do you want to continue?',
    deletionCanceled: 'Deletion canceled',
    updateSuccess: 'Update success'
  },
  ei: {
    summary: {
      cncStation: 'CNC Station',
      ruleName: 'Rule',
      versionNo: 'Version#',
      technician: 'Technician',
      headerDate: 'Date',
      faiSpcAlignmentCheck: 'FAI/SPC Alignment Check',
      faiNo: 'FAI#',
      machineNo: 'Machine#',
      checkResultInfo: 'Checking Result',
      refreshMsg: 'Refreshing will delete current Detail list and Checking Result, confirm to refresh?',
      refreshCanceled: 'Refreshing Canceled',
      refreshSuccess: 'Refreshing Success',
      updateChkResult: 'Update Checking Result',
      chkResult: 'Checking Result'
    },
    part: {
      rule: {
        type: 'Type is required',
        partNo: 'Part No is required',
        version: 'version is required',
        fullName: 'Full Name is required'
      },
      partNo: 'Part Number',
      partVersion: 'Part Version'
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
      title: 'Title',
      project: 'Project',
      build: 'Build',
      partNo: 'Part No',
      dataRound: 'Round',
      partVersion: 'Part Version',
      vendor: 'Vendor',
      generateJMP: 'Generate JMP',
      generateJMPConfirm: 'please wait about 1 minute',
      uploadStatus: 'Upload Status',
      jmpStatus: 'JMP Status',
      downloadJMP: 'Downlaoad JMP',
      message: 'Error Message',
      cncSatation: 'CNC Satation',
      updatedAt: 'updated At'
    }
  }
}
export default export_
