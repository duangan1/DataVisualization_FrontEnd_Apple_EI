<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

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
      </el-popover>-->
      <el-dropdown
        class="right-menu-item hover-effect"
        trigger="click"
        style="line-height: 40px;top:10px;"
        @command="handleChangeLang"
      >
        <div>
          <svg-icon class-name="language" icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item of langOptions"
            :key="item.value"
            :disabled="lang===item.value"
            :command="item.value"
          >
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
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { setLang, getLang } from "@/utils/auth";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      lang: getLang(),
      langOptions: [
        { value: "en", label: "English" },
        { value: "zhCN", label: "简体中文" }
      ]
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "fullName"])
  },
  methods: {
    getLang,
    handleChangeLang(lang) {
      this.lang = lang;
      setLang(this.lang);
      this.$i18n.locale = this.lang;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 5px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
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
          right: -10px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
