# Apple Engineering Intelligence

## Build Setup

```bash
# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Development

提交前记得`npm run lint`/`npm run lint --fix`

### VSCode
插件安装: Vueur/ESLint/Path Intellisense(路径跳转)

- [使用ESLint Autofix](https://panjiachen.github.io/vue-element-admin-site/zh/guide/advanced/eslint.html#vscode-%E9%85%8D%E7%BD%AE-eslint), 保存的时候自动fix 
```
{
    "files.autoSave": "off",
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "vue-html",
        {
            "language": "vue",
            "autoFix": true
        }
    ],
    "eslint.run": "onSave",
    "eslint.autoFixOnSave": true
}    
```

## 查询lookup
```
import * as lookup from '@/utils/lookup'
<!-- 参数必须是lookupType的数组 -->
  const arr = ['CUSTOMER_INDUSTRY_TYPE', 'DATA_BELONG']
  lookup.queryLookup(arr).then(value => {
    //operation...
  })
```
## 菜单
为了缓存数据,菜单定义的“名称”要与组件的name保持一致
```JS
export default {
  name: 'UserList',
  data() {
 ```
 ## 按钮

- 命名规则

  应与后台的方法命名规则保持一致

- 按钮的隐藏(权限)使用方式
  1. 第一步 引入permission Utils
```JS
 import checkButtonPermission from '@/utils/permission'
```

  2. 第二步 在methods加入checkButtonPermission方法
```JS
methods: {
    checkButtonPermission,
```
3. 第三步 标签上使用v-if隐藏
```JS
v-if ="checkButtonPermission(['userCreate','userUpate'])"
```
其中userAdd,userEdit为菜单定义中按钮的“名称”

可参考src/views/core/security/user/list.vue的新增按钮

## 上传

- 引入组件, 注意去掉我的注释
```html
<el-upload
  class="upload-demo"
  action="default"
  :disabled="disableSaveButton"         // 需要同时disable上传组件和点击的按钮           
  :before-upload="beforeUpload"         // 这个方法里可以实现一些校验来阻止上传
  :http-request="uploadFile"            // 使用我们自己的上传api
  :on-remove="handleUploadRemove"       // 点击删除的回调
  :on-success="handleUploadSuccess"     // 上传成功的回调
  :on-error="handleUploadError"         // 上传失败的回调
  :file-list="files"                    // 已上传文件的列表, 只是存储页面数据
  list-type="picture"                   // 带缩略图
>
  <el-button :disabled="disableSaveButton" size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">上传文件提示</div>
</el-upload>
```

- 加入必要的data
```js
data() {
  return {
    files: [],
    disableSaveButton: false,
  }
}
```

- 复写重要的方法
```js
import { mapAttachmentsToFiles, mapFilesToAttachments } from '@/utils/upload-util'
import { uploadFile } from '@/api/crm/upload'
import {
  showSaveSuccess,
  MSG_UPLOAD_SUCCESS
} from '@/utils/messageUtils'

... 

beforeUpload(file) {
  // TODO validation, 返回true才会上传
  return true
},
uploadFile(request) {
  // 灰掉upload, 防止多次点击
  this.disableSaveButton = true
  // 使用我们的upload api, 因为我们还要告诉upload组件最后的结果(成功/失败), 所以需要把promise return出去
  return uploadFile('document', request.file)
},
handleUploadSuccess(response, file, files) {
  // 上传成功, 把文件列表复制到当前对象的附件列表中
  // 里面会对url进行一次转换, 上传的文件地址只是一个相对地址, 这里会拼成完整的
  this.document.attachments = mapUploadedFilesToAttachments(files)
  // 放开save按钮
  this.disableSaveButton = false
  // 成功消息
  MSG_UPLOAD_SUCCESS()
},
handleUploadError(error, file, files) {
  // 因为API调用有error msg的显示, 这里就不再弹信息
  console.error(error)
  this.disableSaveButton = false
},
handleUploadRemove(file, files) {
  // 同success
  this.document.attachments = mapUploadedFilesToAttachments(files)
},
```

## 日期格式化
引入了 moment，使用前
```sh
npm install
```
- table日期格式

    参考 src/views/process/task/list.vue

##  获取 userId / userName(账号名) / fullName(姓名)
 参考 src/views/dashboard/index.vue


## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information