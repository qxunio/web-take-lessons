<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">历史</h1>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <el-page-header style="margin-bottom: 25px" @back="goBack" content="我的选课记录"></el-page-header>

    <div class="event-container">
      <p class="event-title">
        <span class="iconfont tl-horn"></span>
        当前选择的选课
      </p>
      <p class="event-content">
        『&nbsp;{{ this.eventModel.name }}&nbsp;』 于
        <span class="key-word ">{{ this.eventModel.stime }}</span>开始，
        每名同学可以选择 <span class="key-word ">{{ this.eventModel.num }}</span>门课程，选课于
        <span class="key-word ">{{ this.eventModel.etime }}</span>结束。
      </p>
    </div>

    <div class="page-container-title-right" style="padding-bottom: 20px;padding-top: 20px">
      <el-button icon="el-icon-refresh" type="success" :loading="loading" circle title="刷新" @click="list"></el-button>
    </div>

    <el-table
        size="mini"
        stripe
        style="margin-top: 50px"
        v-loading='loading'
        :cell-style="getCell"
        :header-cell-style="getTableHeaderClass"
        :data="listData">
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
            <p slot="reference" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
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
          prop="teacherName"
          label="教师">
      </el-table-column>

      <el-table-column
          v-if="eventModel.canUpdate === '1'"
          width="210px"
          label="操作">
        <template slot-scope="scope">
          <div class="operate">
            <el-popconfirm
                confirmButtonText='好的'
                cancelButtonText='不用了'
                icon="el-icon-info"
                iconColor="red"
                title="确定删除吗？"
                @onConfirm="realDelete(scope.row.id)"
            >
              <a class="click-a" slot="reference">删除</a>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {stuHistoryCs, stuHistoryDelCs} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";

@Component
export default class StuHistoryList extends Vue {
  eventModel: any = {}
  listData: [] = []
  loading = false

  created() {
    // @ts-ignore
    this.eventModel = JSON.parse(decodeURIComponent(this.$route.query.data));
    console.log(this.eventModel)
    this.list();
  }

  realDelete(csId: any) {
    this.loading = true;
    stuHistoryDelCs({eventId: this.eventModel.id, csId: csId}).then((res: ResultData) => {
      this.loading = false;
      if (ResultUtil.success(res)) {
        // @ts-ignore
        let index = this.listData.findIndex(a => a.id === csId);
        this.listData.splice(index,1);  this.$notify({
          title: '删除选课记录成功',
          message: res.msg,
          type: 'success',
        });

      } else {
        this.$notify({
          title: '删除选课记录错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loading = false;
      this.$notify({
        title: '删除选课记录网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  list() {
    this.loading = true;
    stuHistoryCs({id: this.eventModel.id}).then((res: ResultData) => {
      this.loading = false;
      if (ResultUtil.success(res)) {
        this.listData = res.data
      } else {
        this.$notify({
          title: '查询选课记录错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loading = false;
      this.$notify({
        title: '查询选课记录网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }


  /**
   * goBack
   */
  goBack() {
    this.$router.push({path: '/home/stu-history'});
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
