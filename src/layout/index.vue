<template>
  <div :class="classObj" class="app-wrapper">
    <div class="topHeader">
      <img src="@/assets/img/logo.png" class="logo">
      <h1 class="title">Engineering Intelligence</h1>
      <div class="right-menu">

        <!-- <el-popover
          ref="popover"
          placement="bottom"
          width="300"
          :visible-arrow="false"
          popper-class="popoverDialog"
        >
          <el-tabs v-model="activeMessageTab" type="card">
            <el-tab-pane :label="labelOfNotifications" name="notification">
              <div class="notification-container">
                <div
                  v-for="item in notifications"
                  :key="item.id"
                  :class="`item ${item.read?'read-item':'unread-item'}`"
                  @click="handleNotification(item)"
                >
                  <i class="icon el-icon-message" />
                  <div>
                    <div class="message">{{ item.message }}</div>
                    <div class="createdAt">{{ item.creatorName || "系统消息" }} - {{ item.createdAt }}</div>
                  </div>
                </div>
                <div v-show="totalCount>notifications.length" class="more">
                  <el-link
                    type="primary"
                    icon="el-icon-arrow-down"
                    @click="fetchNotifications()"
                  >更多消息</el-link>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="labelOfTodos" name="todo">
              <ul>
                <li>
                  <el-link @click="handleMyTask('myTask')">
                    我的任务 (
                    <span class="myTask">{{ countOfTodo }}</span>)
                  </el-link>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
          <div slot="reference" class="right-menu-item hover-effect" style="padding-top: 6px;">
            <i class="el-icon-bell">
              <el-badge v-show="unreadCount>0" :value="unreadCount" :max="99" class="item" />
            </i>
          </div>
        </el-popover> -->
        <el-dropdown class=" right-menu-item hover-effect" trigger="click" style="line-height: 40px;" @command="handleChangeLang">
          <div>
            <svg-icon class-name="language" icon-class="language" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of langOptions" :key="item.value" :disabled="lang===item.value" :command="item.value">
              {{
                item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper" style="font-size: 13px;font-weight: bold;height: 34px;">
            {{ fullName }}
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/userProfile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container hasTagsView">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'
import { setLang, getLang } from '@/utils/auth'
import { dateTimeFormat } from '@/utils/formatUtils'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      activeMessageTab: 'notification',
      lang: getLang(),
      langOptions: [{ value: 'en', label: 'English' }, { value: 'zhCN', label: '简体中文' }],
      dialogVisible: false,
      // notifications
      notifications: [],
      currentPage: 1,
      totalCount: Number.MAX_VALUE,
      unreadCountOfNotifications: 0,
      // my task
      countOfTodo: 0
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'fullName']),
    sidebar() {
      return this.$store.state.app.sidebar
    },

    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    unreadCount() {
      return this.unreadCountOfNotifications + this.countOfTodo
    },
    labelOfNotifications() {
      return this.unreadCountOfNotifications > 0
        ? `系统通知(${this.unreadCountOfNotifications})`
        : '系统通知'
    },
    labelOfTodos() {
      return this.countOfTodo > 0 ? `待办事项(${this.countOfTodo})` : '待办事项'
    }
  },
  created() {

  },
  methods: {
    getLang,
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },

    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    fetchMessages() {

    },
    setData(systemMessage) {
      const {
        notifications,
        countOfTodo,
        totalCountOfNotifications,
        unreadCountOfNotifications
      } = systemMessage

      this.notifications = notifications.map(item => ({
        ...item,
        createdAt: this.formatDateTime(item.createdAt)
      }))
      this.countOfTodo = countOfTodo
      this.totalCount = totalCountOfNotifications
      this.unreadCountOfNotifications = unreadCountOfNotifications
    },
    handleNotification(notification) {

    },
    fetchNotifications() {
      this.currentPage += 1
    },
    handleChangeLang(lang) {
      this.lang = lang
      setLang(this.lang)
      this.$i18n.locale = this.lang
      document.location.reload()
    },
    handleMyTask(task) {
      this.$router.push({
        path: `/todo/list`,
        query: { task }
      })
    },
    formatDateTime(dateTime) {
      return dateTimeFormat(dateTime, 'MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.topHeader{
  display: none;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: $topHeaderHeight;
  right: 0;
  z-index: 2000;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 30px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #fff;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    &:after {
      contain: "";
      height: 9px;
      widows: 9px;
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -12px;
        top: 10px;
        font-size: 12px;
      }
    }
  }
}

.notification-container {
  max-height: 500px;
  overflow-y: scroll;

  .item {
    padding: 12px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
  }
  .read-item {
    .icon {
      background-color: rgb(135, 208, 104);
    }
  }
  .unread-item {
    .icon {
      background-color: rgb(254, 92, 87);
    }
    .message {
      font-weight: bold;
    }
  }
  .unread-item:hover {
    background-color: #f8f8f9;
  }
  .icon {
    font-size: 20px;
    margin-right: 10px;
    border-radius: 50%;
    padding: 6px;
    color: white;
  }
  .message {
    margin-bottom: 5px;
    white-space: pre-wrap;
  }
  .createdAt {
    font-size: 12px;
    color: #808695;
  }
  .more {
    text-align: center;
    padding: 10px;
  }
}
</style>
