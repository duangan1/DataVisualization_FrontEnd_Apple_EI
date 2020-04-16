<template>
  <div>

    <user-detail :is-edit="true" />

  </div>
</template>
<script>
import userDetail from './components/userDetail'
export default {
  name: 'UserEditForm',
  components: { userDetail }

}
</script>
