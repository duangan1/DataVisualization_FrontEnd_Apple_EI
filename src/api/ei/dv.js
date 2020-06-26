import request from '@/utils/request'
import QS from 'qs'
//test data
import axios from 'axios'
import testData from '@/assets/test_data/linechart_test.json'

export function initLineChartMoreSelectOption(params, name) {
  return request({
    url: `/ei/dv/line/search/param/${name}`,
    method: 'get',
    params
  })
}

// export function inithotmapData(params) {
//   console.log(request)
//   return request({
//     url: `/api_visual_heat_map`,
//     method: 'post',
//     params
//   })
// }

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
export function testData_json() {
  return testData;
}

export function getPlotDataByHeaderIdAndType(header_id, chart_type) {
  return new Promise((resolve, reject) => {
    let _url = '/python_api/api_visual_';
    let mes = window.location;
    let _baseurl = `//${mes.hostname}:${mes.port}`;
    axios({
      baseURL: _baseurl,
      url: _url + chart_type + '/',
      method: 'post',
      data: {
        header_id: header_id,
      }
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.data);
      });
  })
  // return data_json;
}

export function getOptionLookup() {
  return new Promise((resolve, reject) => {
    let mes = window.location;
    let _baseurl = `//${mes.hostname}:${mes.port}`;
    axios({
      baseURL: _baseurl,
      url: '/python_api/get_header_id/',
      method: 'get',
    })
      .then(res => {
        // console.log(res.data);
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      })
  })
}

export function getLineChartRules(header_id) {
  return new Promise((resolve, reject) => {
    let _url = '/python_api/api_visual_linechart_rules/';
    let mes = window.location;
    let _baseurl = `//${mes.hostname}:${mes.port}`;
    axios({
      baseURL: _baseurl,
      url: _url,
      method: 'post',
      data: {
        header_id: header_id,
      }
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.data);
      })
  })
}

export function getLineChartDebug(header_id) {
  return new Promise((resolve, reject) => {
    let _url = '/python_api/api_visual_line_chart_debug/';
    let mes = window.location;
    let _baseurl = `//${mes.hostname}:${mes.port}`;
    axios({
      baseURL: _baseurl,
      url: _url,
      method: 'post',
      data: {
        header_id: header_id,
      }
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.data);
      })
  })
}