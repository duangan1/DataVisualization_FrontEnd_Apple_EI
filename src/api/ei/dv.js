import request from '@/utils/request'
import QS from 'qs'
//test data
import axios from 'axios'
import testData from '@/assets/test_data/raw_data.json'

export function initLineChartMoreSelectOption(params,name) {
    return request({
      url: `/ei/dv/line/search/param/${name}`,
      method: 'get',
      params
    })
}

export const initLineChartData = (params) => {
    const form = QS.stringify(params, { arrayFormat: 'repeat' })
    return request({
      url: `/ei/dv/line/data/machine?${form}`,
      method: 'get',
      form
    })
  }

  export const initLineChartRiskSuggest = (params) => {
    const form = QS.stringify(params, { arrayFormat: 'repeat' })
    return request({
      url: `/ei/dv/line/risk/suggest?${form}`,
      method: 'get',
      form
    })
  }

  export const initLineChartRiskMachine = (params) => {
    const form = QS.stringify(params, { arrayFormat: 'repeat' })
    return request({
      url: `/ei/dv/line/risk/machine?${form}`,
      method: 'get',
      form
    })
  }


  export function submitRiskChkResult(params) {
    return request({
      url: `/ei/dv/line/risk/chk/submit`,
      method: 'post',
      data: params
    })
  }

  //boxplot test data
  // export const boxplotTestData = () => {
  //   var data = [];
  //   axios.get('../../assets/test_data/raw_data.json').then(response => {
  //     data = response.raw_data;
  //   },response => {
  //     console.log("error")
  //   });
  //   return data;
  // }
  export function testData_json(){
    return testData;
  }