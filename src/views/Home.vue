<template>
  <div class="page">
    <div class="index">
      <div class="header">
        <div class="nav">
          <div class="menu">
            <li>
              <router-link to="/home" active-class="nav-active" exact>
                首页
              </router-link>
            </li>
            <li v-for="item in menus">
              <router-link :to="item.router" active-class="nav-active">
                {{ item.name }}
                <el-badge v-if="item.router ==='/home/stu-event' && eventModel.id !== undefined" is-dot
                          class="item"></el-badge>
              </router-link>
            </li>
          </div>
          <div class="person">
            <li class="nickname">{{ userName }}</li>
            <li class="exit"><a @click="exit">退出</a></li>
          </div>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {ResultUtil} from "@/utils/result-util";
import {ResultData} from "@/utils/model/ResultData";
import {
  LOCAL_STORAGE_EFFECTIVE_EVENT_KEY,
  LOCAL_STORAGE_USER_MENU_KEY,
  LOCAL_STORAGE_USER_NAME_KEY,
  LOCAL_STORAGE_USER_TYPE_KEY,
  LocalStorageUtil
} from "@/utils/local-storage-util";
import {VerifyUtil} from "@/utils/verify-util";
import {logout, menu, stuEventExistEvent} from '@/api/api';
import {EventModel} from "@/views/admin/event/model";

@Component
export default class Home extends Vue {
  menus = [];
  userName = LocalStorageUtil.get(LOCAL_STORAGE_USER_NAME_KEY);
  eventModel: EventModel = {};

  created() {
    this.initMenu();
    if (LocalStorageUtil.get(LOCAL_STORAGE_USER_TYPE_KEY) === "s") {
      this.selectExistEvent();
    }
  }

  /**
   * 查询当前有效的选课活动
   */
  selectExistEvent() {
    stuEventExistEvent().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.eventModel = res.data;
        LocalStorageUtil.set(LOCAL_STORAGE_EFFECTIVE_EVENT_KEY, JSON.stringify(this.eventModel))
      } else {
        if (!VerifyUtil.isStringBlank(LocalStorageUtil.get(LOCAL_STORAGE_EFFECTIVE_EVENT_KEY))) {
          LocalStorageUtil.remove(LOCAL_STORAGE_EFFECTIVE_EVENT_KEY)
        }
      }
    }, e => {
      this.$notify({
        title: '查询用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  exit() {
    this.$router.push({name: `Auth`});
    logout().then(() => {
    }, (() => {
    }));
    LocalStorageUtil.removeLoginUser();
  }

  initMenu() {
    const m = LocalStorageUtil.getMenus();
    if (!VerifyUtil.isStringBlank(m)) {
      this.menus = JSON.parse(decodeURIComponent(m));
      return;
    }
    menu().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.menus = res.data;
        LocalStorageUtil.set(LOCAL_STORAGE_USER_MENU_KEY, JSON.stringify(res.data));
      } else {
        this.$notify({
          title: '初始化菜单失败',
          message: res.msg,
          type: 'warning',
        });
      }
    }, (e => {
      this.$notify({
        title: '网络错误',
        message: '网络错误',
        type: 'error',
      });
    }));
  }

  /**
   * 表cell样式回调
   */
  public getCell() {
    return 'text-align:center;color:#000000';
  }

  /**
   * 表头样式回调
   */
  public getTableHeaderClass() {
    return 'color:#000000;text-align:center';
  }
}
</script>


<style lang="scss">
$width-max: 1160px;
$width-min: 980px;
$height: 50px;

.page {
  height: 100vh;
  min-width: $width-min;
}

.index {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start
}

.header {
  width: 100%;
  height: 50px;
  background: #207ed9;
}

.nav {
  width: $width-max;
  margin: 0 auto;
  height: $height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 13px;
}

.main {
  box-sizing: border-box;
  width: $width-max;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 1160px) {
  .nav {
    width: $width-min !important;
  }
  .main {
    width: $width-min !important;
  }

}

.menu li {
  margin: 0 10px;
  display: inline-block;
  height: $height;
  line-height: $height;
  width: 60px;
  text-align: center;
}

.person li {
  padding: 0 10px;
  display: inline-block;
  height: $height;
  line-height: $height;
}

.nav-active {
  box-sizing: border-box;
  border-bottom: #d0c2c2 5px solid;
  border-right: 1px solid #d0d9ea5e;
  border-top: 1px solid #d0d9ea5e;
  border-left: 1px solid #d0d9ea5e;
  background: #d0d9ea5e;
  border-radius: 3px;
}

a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
  cursor: pointer;
}

.tag {
  display: block;
  color: #1673c1;
  font-size: 1.25em;
}

.title {
  font-size: 12px;
  display: block;
  letter-spacing: 1px;
}

.time {
  font-size: 12px;
  display: block;
  letter-spacing: 1px;
}

.last-event {
  text-align: center;
}

.item {
  position: absolute;
}
</style>
