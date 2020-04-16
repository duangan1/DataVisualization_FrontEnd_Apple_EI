<template>
  <div>
    <user-detail :is-edit="false" />
  </div>
</template>
<script>
import userDetail from './components/userDetail'
export default {
  name: 'UserCreateForm',
  components: { userDetail }

}
</script>
