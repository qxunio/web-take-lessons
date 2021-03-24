<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">关注</h1>

    <div v-if="this.eventModel.id !== undefined">
      <div class="event-container">
        <p class="event-title">
          <span class="iconfont tl-horn"></span>
          当前存在选课
        </p>
        <p class="event-content">
          『&nbsp;{{ this.eventModel.name }}&nbsp;』将于
          <span class="key-word ">{{ this.eventModel.stime }}</span>开始，
          每名同学可以选择 <span class="key-word ">{{ this.eventModel.num }}</span>门课程，选课将于
          <span class="key-word ">{{ this.eventModel.etime }}</span>，请不要错过哦~
        </p>
      </div>

      <div class="page-container-title-right" style="padding-bottom: 20px;padding-top: 20px">
        <el-tooltip class="item" effect="dark" :manual=true v-model="showRefreshTip" content="推荐使用刷新按钮~"
                    placement="left">
          <el-button icon="el-icon-refresh" type="success" :loading="loadingPage" circle title="刷新"
                     @click="list"></el-button>
        </el-tooltip>
      </div>


      <el-table
          size="mini"
          stripe
          style="margin-top: 50px"
          v-loading='loadingPage'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="configSubject">
        <el-table-column
            prop="className"
            label="课堂名称">
        </el-table-column>

        <el-table-column
            prop="subjectName"
            label="学科">
        </el-table-column>

        <el-table-column
            prop="introduction"
            label="介绍">

          <template slot-scope="scope">
            <el-popover
                popper-class="subject-introduction"
                placement="top-start"
                width="280"
                trigger="hover"
                :content="scope.row['introduction']">
              <p slot="reference" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; ">
                {{ scope.row.introduction }}</p>
            </el-popover>
          </template>

        </el-table-column>

        <el-table-column
            prop="teachAddress"
            label="教学地点">
        </el-table-column>

        <el-table-column
            prop="teachTime"
            label="教学时间">
        </el-table-column>

        <el-table-column
            prop="teacher"
            label="教师">
        </el-table-column>

        <el-table-column
            width="80"
            prop="remainingPlaces"
            label="剩余名额">
          <template slot-scope="scope">
            <el-tag effect="dark" type="success" style="width: 40px"
                    v-if="scope.row['remainingPlaces'] / scope.row['num'] >0.3">
              {{ scope.row['remainingPlaces'] }}
            </el-tag>
            <el-tag effect="dark" type="danger" v-else style="width: 30px">
              {{ scope.row['remainingPlaces'] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
            width="110"
            label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <a @click="lock(scope.row.id)">选课</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="remove(scope.row.subjectId)">移除关注</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else>
      <div class="event-container">
        <p class="event-title">
          <span class="iconfont tl-horn"></span>
          当前没有选课哦~
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {
  LOCAL_STORAGE_EFFECTIVE_EVENT_KEY,
  LOCAL_STORAGE_SHOW_TIP_KEY,
  LocalStorageUtil
} from "@/utils/local-storage-util";
import {ConfigurationSubjectSimpleModel, EventModel} from "@/views/admin/event/model";
import {stuFocusListConfigSubject, stuFocusRemoveConfigSubject, stuLock} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";

@Component
export default class StuFocus extends Vue {
  eventModel: EventModel = {};
  loadingPage = false;
  configSubject: ConfigurationSubjectSimpleModel[] = [];
  showRefreshTip = false;

  created() {
    let a = JSON.parse(LocalStorageUtil.get(LOCAL_STORAGE_EFFECTIVE_EVENT_KEY));
    if (a !== null) {
      this.eventModel = a;
    }
    this.list();
    if (VerifyUtil.isStringBlank(LocalStorageUtil.get(LOCAL_STORAGE_SHOW_TIP_KEY))) {
      this.showRefreshTip = true;
      setTimeout(() => {
        this.showRefreshTip = false;
        LocalStorageUtil.set(LOCAL_STORAGE_SHOW_TIP_KEY, "show")
      }, 3000)
    }

  }

  /**
   * 查询所有
   */
  list() {
    this.loadingPage = true;
    if (this.eventModel === null || VerifyUtil.isStringBlank(this.eventModel.id)) {
      this.loadingPage = false;
      return
    }
    stuFocusListConfigSubject({eventId: this.eventModel.id}).then((res: ResultData) => {
      this.loadingPage = false;
      if (ResultUtil.success(res)) {
        this.configSubject = res.data;
      } else {
        this.$notify({
          title: '查询关注错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.loadingPage = false;
      this.$notify({
        title: '查询关注网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 移除关注
   */
  remove(subjectId: string) {
    if (VerifyUtil.isStringBlank(subjectId) || VerifyUtil.isStringBlank(this.eventModel.id)) {
      this.$notify({
        title: '移除关注错误',
        message: '参数缺失',
        type: 'warning',
      });
      return
    }
    let data = {
      eventId: this.eventModel.id,
      configSubjectId: subjectId
    }
    stuFocusRemoveConfigSubject(data).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.configSubject = this.configSubject.filter(a => a.subjectId == subjectId);
      } else {
        this.$notify({
          title: '移除选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.$notify({
        title: '移除选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 选课
   */
  lock(csId: string) {
    stuLock({csId: csId,eventId:this.eventModel.id}).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '选课成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '选课异常',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.$notify({
        title: '选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 表cell样式回调
   */
  getCell() {
    return 'text-align:center;color:#000000';
  }

  /**
   * 表头样式回调
   */
  getTableHeaderClass() {
    return 'color:#000000;font-size:13px;text-align:center';
  }
}
</script>


<style lang="scss">
.event-container {
  width: 100%;
  padding: 5px 5px 5px 10px;
  -webkit-box-shadow: 0 1px 9px -3px rgba(169, 168, 171, 1);
  -moz-box-shadow: 0 1px 9px -3px rgba(169, 168, 171, 1);
  box-shadow: 0 1px 9px -3px rgba(169, 168, 171, 1);
}

.event-title {
  font-size: 13px;
  font-weight: 600;
}

.event-content {
  font-size: 12px;
}
</style>
