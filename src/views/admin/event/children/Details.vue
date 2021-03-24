<template>
  <div class="page-container">

    <div>
      <!-- 头部 -->
      <h1 class="page-container-title">选课</h1>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-page-header style="margin-bottom: 25px" @back="goBack" content="选课详情"></el-page-header>


    <div class="event-container">
      <p class="event-title">
        <span class="iconfont tl-horn"></span>
        当前选择的选课
      </p>
      <p class="event-content">
        『&nbsp;{{ this.eventModel.name }}&nbsp;』 于
        <span class="key-word ">{{ this.eventModel.stime }}</span>开始，
        每名同学可以选择 <span class="key-word ">{{ this.eventModel.num }}</span>门课程，选课于
        <span class="key-word ">{{ this.eventModel.etime }}</span>结束，学生 <span
          class="key-word"> {{ this.eventModel.canUpdate === '1' ? '可以' : '不可以' }}</span>修改已经选择的课程。
      </p>
    </div>


    <div>

      <div class="page-container-title-right" style="margin-bottom: 20px">
        <el-button icon="el-icon-download" type="primary" :loading="loadingExportBtu" @click="exportPort" circle
                   title="导出详情"></el-button>
        <el-button icon="el-icon-refresh" type="success" :loading="loadingTable" circle title="刷新"
                   @click="getList"></el-button>
      </div>


      <el-table
          size="mini"
          stripe
          style="margin-top: 50px"
          :cell-style="getCell"
          v-loading="loadingTable"
          :header-cell-style="getTableHeaderClass"
          :data="tableData">
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
            prop="num"
            label="限制人数">
        </el-table-column>

        <el-table-column
            prop="selectedPlaces"
            label="已选人数">
        </el-table-column>

        <el-table-column
            width="110"
            label="学生">
          <template slot-scope="scope">
            <div class="operate">
              <a @click="showChooseStuDialog(scope.row)">已选</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="showAppendStuDialog(scope.row)">追加</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--已选学生-->
    <el-dialog
        width="850px"
        title="已选学生"
        :visible.sync="visibleChooseStuDialog"
        :before-close="closeChooseStuDialog"
        :append-to-body="true"
        :close-on-click-modal="false">


      <div class='filter-box'>

        <el-input v-model="pageParam.class"
                  style="width: 170px;margin-left:3px"
                  placeholder="班级"
                  @keyup.enter.native="pageStuList"
                  @change="pageStuListFilterChange()"
                  clearable></el-input>

        <el-input v-model="pageParam.dest"
                  style="width: 170px;margin-left:3px"
                  placeholder="姓名或账号"
                  @keyup.enter.native="pageStuList"
                  @change="pageStuListFilterChange()"
                  clearable></el-input>


        <el-button icon="el-icon-search"
                   v-loading='loadingStuPage'
                   @click="pageStuList"
                   circle
                   style="margin-left: 5px"></el-button>

      </div>

      <el-table
          v-loading='loadingStuPage'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="stuData">

        <el-table-column
            prop="name"
            label="姓名">
        </el-table-column>

        <el-table-column
            prop="account"
            label="账号">
        </el-table-column>

        <el-table-column
            prop="class"
            label="班级">
        </el-table-column>

        <el-table-column
            prop="schoolYear"
            label="入学年">
        </el-table-column>

        <el-table-column
            prop="selectTime"
            label="选择时间">
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="这个用户确定删除吗？"
                  @onConfirm="realDelete(scope.row)"
                  @onCancel="closeCreateDialog()"
              >
                <a class="click-a" slot="reference">删除</a>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          style='text-align: center;padding-top: 20px'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParam.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="20"
          layout="total, sizes, prev, pager, next"
          :total="totalStuData">
      </el-pagination>
    </el-dialog>


    <!--追加学生-->
    <el-dialog
        width="1111px"
        title="追加学生"
        :visible.sync="visibleAppendStuDialog"
        :before-close="closeAppendStuDialog"
        :append-to-body="true"
        :close-on-click-modal="false">


      <div class='filter-box'>
        <el-input v-model="dest"
                  style="width: 170px;margin-left:3px"
                  placeholder="姓名或账号"
                  @keyup.enter.native="toSearch"
                  clearable></el-input>
        <el-button icon="el-icon-search"
                   v-loading='loadSearchStu'
                   @click="toSearch"
                   circle
                   style="margin-left: 5px"></el-button>
      </div>

      <el-table
          v-loading='loadSearchStu'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="searchStu">

        <el-table-column
            prop="name"
            label="姓名">
        </el-table-column>

        <el-table-column
            prop="account"
            label="账号">
        </el-table-column>

        <el-table-column
            prop="class"
            label="学生班级">
        </el-table-column>

        <el-table-column
            prop="schoolYear"
            label="学生入学年">
        </el-table-column>

        <el-table-column
            prop="className"
            label="课堂">
        </el-table-column>

        <el-table-column
            prop="subjectName"
            label="课程">
        </el-table-column>

        <el-table-column
            prop="selectTime"
            label="选择时间">
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <div class="operate">

              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定替换吗？"
                  @onConfirm="realReplace(scope.row)"
                  @onCancel="closeCreateDialog()"
                  v-if="scope.row.selectTime.length !== 0"
              >
                <a class="click-a" slot="reference">替换</a>
              </el-popconfirm>
              <el-divider direction="vertical" v-if="scope.row.selectTime.length !== 0"></el-divider>

              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定追加吗？"
                  @onConfirm="realAppend(scope.row)"
                  @onCancel="closeCreateDialog()"
              >
                <a class="click-a" slot="reference">追加</a>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>


    </el-dialog>


    <!--调整学生-->
    <el-dialog
        width="750px"
        title="调整学生"
        :visible.sync="visibleAdjustmentStuDialog"
        :before-close="closeAdjustmentStuDialog"
        :append-to-body="true"
        :close-on-click-modal="false">
    </el-dialog>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {
  configDetailsAppendStuSearch,
  configDetailsList,
  configDetailsReplaceStu,
  configDetailsStuList,
  configDetailsAppendStu,
  configDetailsDeleteStu, configExportStuChooseSubject
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {DownType, DownUtil} from "@/utils/down-util";

@Component
export default class Details extends Vue {
  eventModel: any = {}
  tableData: any = []
  loadingTable = false;
  stuData: any = []
  totalStuData = 0;
  pageParam: any = {
    limit: 20,
    page: 1,
    dest: '',
    csId: '',
    class: ''
  };
  visibleChooseStuDialog = false
  selectStuCs = {}
  loadingStuPage = false;
  visibleAppendStuDialog = false
  searchStu = []
  loadSearchStu = false
  dest = ""
  visibleAdjustmentStuDialog = false
  loadingExportBtu = false;

  created() {
    // @ts-ignore
    this.eventModel = JSON.parse(decodeURIComponent(this.$route.query.data));
    this.getList()
  }

  exportPort() {
    this.loadingExportBtu = true;
    configExportStuChooseSubject({id: this.eventModel.id}).then((res: any) => {
      this.loadingExportBtu = false;
      DownUtil.down(res, DownType.EXCEL, "选课详情.xlsx");
    }, () => {
      this.loadingExportBtu = false;
      this.$notify({
        title: '导出用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  closeAdjustmentStuDialog() {
    this.visibleAdjustmentStuDialog = false
  }

  toSearch() {
    if (VerifyUtil.isStringBlank(this.dest)) {
      this.$notify({
        title: '查询错误',
        message: '请输入学生账号或者姓名',
        type: 'warning',
      });
      return
    }
    this.loadSearchStu = true;
    configDetailsAppendStuSearch({dest: this.dest, eventId: this.eventModel.id}).then((res: ResultData) => {
      this.loadSearchStu = false;
      if (ResultUtil.success(res)) {
        this.searchStu = res.data
      } else {
        this.$notify({
          title: '查询错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadSearchStu = false;
      this.$notify({
        title: '查询网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  pageStuListFilterChange() {
    this.pageParam.page = 1;
  }

  closeAppendStuDialog() {
    this.selectStuCs = {};
    this.visibleAppendStuDialog = false;
    this.searchStu = []
    this.loadSearchStu = false;
    this.dest = ''
  }

  showAppendStuDialog(data: any) {
    this.selectStuCs = data;
    this.visibleAppendStuDialog = true;
  }

  closeCreateDialog() {

  }

  realDelete(data: any) {
    let d = {
      eventId: this.eventModel.id,
      uid: data.userId,
      //@ts-ignore
      csId: this.selectStuCs.id,
    }
    configDetailsDeleteStu(d).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '删除成功',
          message: res.msg,
          type: 'success',
        });
        this.pageStuList();
      } else {
        this.$notify({
          title: '删除错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingStuPage = false;
      this.$notify({
        title: '删除网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  realReplace(data: any) {
    let d = {
      eventId: this.eventModel.id,
      uid: data.userId,
      replaceId: data.csId,
      //@ts-ignore
      csId: this.selectStuCs.id,
    }

    configDetailsReplaceStu(d).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '替换成功',
          message: res.msg,
          type: 'success',
        });
        this.toSearch();
      } else {
        this.$notify({
          title: '替换错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingStuPage = false;
      this.$notify({
        title: '替换网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  realAppend(data: any) {
    let d = {
      eventId: this.eventModel.id,
      uid: data.userId,
      //@ts-ignore
      csId: this.selectStuCs.id,
    }

    configDetailsAppendStu(d).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '追加成功',
          message: res.msg,
          type: 'success',
        });
        this.toSearch();
      } else {
        this.$notify({
          title: '追加错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingStuPage = false;
      this.$notify({
        title: '追加网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  showChooseStuDialog(data: any) {
    console.log(data)
    this.selectStuCs = data;
    this.visibleChooseStuDialog = true;
    this.pageStuList();
  }

  closeChooseStuDialog() {
    this.selectStuCs = {}
    this.visibleChooseStuDialog = false;
    this.loadingStuPage = false;
    this.pageParam = {
      limit: 20,
      page: 1,
      dest: '',
      csId: '',
      class: ''
    };
    this.selectStuCs = {};
  }

  pageStuList() {
    this.loadingStuPage = true;
    //@ts-ignore
    this.pageParam.csId = this.selectStuCs.id;
    configDetailsStuList(this.pageParam).then((res: ResultData) => {
      this.loadingStuPage = false;
      if (ResultUtil.success(res)) {
        this.stuData = res.data.data
        this.totalStuData = res.data.totalCount
      } else {
        this.$notify({
          title: '查询错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingStuPage = false;
      this.$notify({
        title: '查询网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 过滤条件变化时，初始化分页参数
   */
  pageFilterChange() {
    this.pageParam.page = 1;
    this.pageParam.class = ''
    this.pageParam.csId = ''
  }

  /**
   * 条数/页 变化
   */
  handleSizeChange(val: number) {
    this.pageParam.limit = val;
    this.pageStuList();
  }

  /**
   * 页变化
   */
  handleCurrentChange(val: number) {
    this.pageParam.page = val;
    this.pageStuList();
  }

  getList() {
    this.loadingTable = true
    configDetailsList({id: this.eventModel.id}).then((res: ResultData) => {
      this.loadingTable = false;
      if (ResultUtil.success(res)) {
        this.tableData = res.data
      } else {
        this.$notify({
          title: '查询错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingTable = false;
      this.$notify({
        title: '查询网络错误',
        message: '网络错误',
        type: 'error',
      });
    });

  }

  /**
   * goBack
   */
  goBack() {
    this.$router.push({path: '/home/event'});
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
</style>
