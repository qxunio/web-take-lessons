<template>
  <div class="page-container">

    <!-- 头部 -->
    <h1 class="page-container-title">选课</h1>
    <div class="page-container-title-right">
      <el-button icon="el-icon-plus" type="warning" @click="showCreateEventDialog" circle
                 title="添加选课"></el-button>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 表单 -->
    <div>
      <el-table
          v-loading='loadingPage'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="eventTable">
        <el-table-column
            prop="name"
            label="主题">
        </el-table-column>
        <el-table-column
            prop="num"
            label="限制"
            width="50">
        </el-table-column>
        <el-table-column
            prop="stime"
            label="开始时间">
        </el-table-column>
        <el-table-column
            prop="etime"
            label="结束时间">
        </el-table-column>
        <el-table-column
            prop="ctime"
            label="创建时间">
        </el-table-column>

        <el-table-column
            prop="ctime"
            label="修改课堂">
          <template slot-scope="scope">
            <el-switch
                @change="changeCanUpdate(scope.row)"
                v-model="scope.row.canUpdate === '1'"
                active-color="#13ce66">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
            prop="ctime"
            label="查询课堂">
          <template slot-scope="scope">
            <el-switch
                v-show="scope.row.status !== '2'"
                @change="realChangeEvent(scope.row)"
                v-model="scope.row.status === '1'"
                active-color="#13ce66">
            </el-switch>

            <el-tag
                v-show="scope.row.status === '2'"
                @click="showReactivation(scope.row)"
                title="点击重新激活选课"
                style="cursor:pointer"
                size="mini"
                type="info"
                effect="dark">
              已经结束
            </el-tag>

          </template>
        </el-table-column>

        <el-table-column
            width="210px"
            label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <a @click="showUpdateEvent(scope.row)">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="jump(scope.row)">配置</a>
              <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定删除吗？"
                  @onConfirm="realDeleteEvent(scope.row)">
                <a class="click-a" slot="reference">删除</a>
              </el-popconfirm>
              <el-divider direction="vertical"></el-divider>
              <a @click="jumpReport(scope.row)" style="color: rgb(19 206 102)">详情</a>
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
          :total="tableTotal">
      </el-pagination>
    </div>


    <!-- 更新选课弹框 -->
    <el-dialog
        width="630px"
        :title="nowIsUpdate ? '修改选课':'增加选课'"
        :visible.sync="visibleCreateEventDialog"
        :before-close="closeCreateEventDialog"
        :append-to-body="true"
        :close-on-click-modal="false">

      <el-form :model="eventModel" ref="eventModel" label-width="80px" size="mini"
               style="margin: 0 auto;width: 75%">


        <el-form-item
            prop="name"
            label="选课主题"
            :rules="[
                                  { required: true, message: '请输入选课主题', trigger: 'blur' },
                                  { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                                ]">
          <el-input v-model="eventModel.name" placeholder="例：2020年第一学期选课"></el-input>
        </el-form-item>


        <el-form-item
            label="参与年级"
            prop="schoolYear"
            :rules="{required: true,validator: validateSchoolYear, trigger: 'blur'}">
          <el-select
              multiple
              collapse-tags
              clearable
              v-model="eventModel.schoolYear"
              filterable
              placeholder="请选择参加选课的入学年"
              style="width: 100%">
            <el-option
                v-for="item in schoolYear"
                :key="item.id"
                :label="item.schoolYear"
                :value="item.schoolYear">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
            label="参与标签 "
            prop="tagIds"
            :rules="{required: true,validator: validateSchoolYear, trigger: 'blur'}">
          <el-select
              multiple
              collapse-tags
              clearable
              v-model="eventModel.tagIds"
              filterable
              placeholder="请选择参加选课的标签组"
              style="width: 100%">
            <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
            label="修改课堂"
            prop="canUpdate"
            :rules="{required: true,message: '请选择是否可以修改选课', trigger: 'change'}">

          <el-radio-group v-model="eventModel.canUpdate">
            <el-radio :label="'1'">可以修改</el-radio>
            <el-radio :label="'0'">不可以修改</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
            prop="num"
            label="限制数量"
            :rules="[{ required: true, message: '请选择限制数量', trigger: 'blur' }]">
          <template>
            <el-input v-model="eventModel.num" type="number" placeholder="每名学生最多可以选择多少节课"></el-input>
          </template>
        </el-form-item>


        <el-form-item
            prop="stime"
            label="开始时间"
            :rules="[{ required: true, message: '请选择开始时间', trigger: 'blur' }]">
          <template>
            <el-date-picker
                style="width: 100%"
                v-model="eventModel.stime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择开始时间">
            </el-date-picker>
          </template>
        </el-form-item>

        <el-form-item
            prop="etime"
            label="结束时间"
            :rules="[{ required: true, message: '请选择结束时间', trigger: 'blur' }]">
          <template>
            <el-date-picker
                style="width: 100%"
                v-model="eventModel.etime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择结束时间">
            </el-date-picker>
          </template>
        </el-form-item>

      </el-form>


      <div slot="footer">
        <el-button @click="closeCreateEventDialog()">取 消</el-button>
        <el-button @click="createEvent()" type="primary" :loading="loadingUpdateEventBtu">确 定</el-button>
      </div>


    </el-dialog>

    <!-- 重新激活选课 -->
    <el-dialog
        title="重新激活选课"
        :visible.sync="visible"
        width="300px"
        :append-to-body="true"
        :close-on-click-modal="false"
        :before-close="closeReactivationDialog">

      <el-date-picker
          v-model="reactivationEvent.etime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择结束时间">
      </el-date-picker>

      <span slot="footer" class="dialog-footer">
    <el-button @click="closeReactivationDialog">取 消</el-button>
    <el-button type="primary" @click="reactivation" :loading="loadingReactivation">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {EventModel} from "@/views/admin/event/model";
import {
  eventChangeEvent,
  eventCreateEvent,
  eventPage,
  eventReactivationEvent,
  eventRemoveEvent,
  eventUpdateCanUpdate,
  eventUpdateEvent,
  schoolYearListSchoolYear,
  tagListTag
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {SchoolYear} from "@/views/admin/user/model";
import {Tag} from "@/views/admin/tag/model";

@Component
export default class EventTable extends Vue {
  loadingPage = false;
  eventTable: EventModel[] = [];
  tableTotal = 0;
  pageParam: any = {
    limit: 20,
    page: 1,
  };
  nowIsUpdate = false;
  visibleCreateEventDialog = false;
  eventModel: EventModel = {};
  loadingUpdateEventBtu = false;
  schoolYear: SchoolYear[] = [];
  tags: Tag[] = []
  reactivationEvent = {id: '', etime: ''}
  visible = false;
  loadingReactivation = false

  created() {
    this.page();
  }


  showReactivation(data: any) {
    this.visible = true;
    this.reactivationEvent.id = data.id
  }

  closeReactivationDialog() {
    this.reactivationEvent = {id: '', etime: ''};
    this.visible = false;
  }

  /**
   * 报表
   */
  jumpReport(data: any) {
    this.$router.push({name: `Details`, query: {data: encodeURIComponent(JSON.stringify(data))}});
  }

  /**
   * 重新激活
   */
  reactivation() {
    this.loadingReactivation = true
    eventReactivationEvent(this.reactivationEvent).then((res: ResultData) => {
      this.loadingReactivation = false
      if (ResultUtil.success(res)) {
        this.closeReactivationDialog()
        this.page()
      } else {
        this.$notify({
          title: '重新激活错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, (e: any) => {
      this.loadingReactivation = false
      this.$notify({
        title: '重新激活错误网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }


  changeCanUpdate(data: any) {
    let dd = {id: data.id, status: ''}
    if (data.canUpdate === "1") {
      dd.status = "0"
    } else {
      dd.status = "1"
    }

    eventUpdateCanUpdate(dd).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        data.canUpdate = dd.status
        this.$notify({
          title: '修改成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '修改错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, (e: any) => {
      this.$notify({
        title: '修改网络错误',
        message: '网络错误',
        type: 'error',
      });
    });

  }

  /**
   * 参与年级或参与标签组校验
   */
  validateSchoolYear(rule: any, value: any, callback: any) {
    if (VerifyUtil.isArraysBlank(this.eventModel.schoolYear) && VerifyUtil.isArraysBlank(this.eventModel.tagIds)) {
      callback(new Error('请选择参与年级或标签组'));
    } else {
      callback();
    }
  }

  /**
   * 查询所有标签
   */
  listTag() {
    tagListTag().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.tags = res.data
      } else {
        this.$notify({
          title: '查询标签错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, (e: any) => {
      this.$notify({
        title: '查询标签网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }


  /**
   * 查询入学年
   */
  selectSchoolYear() {
    schoolYearListSchoolYear().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.schoolYear = res.data
        this.schoolYear.unshift({id: "0", schoolYear: "全部"})
      } else {
        this.$notify({
          title: '查询入学年错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '查询入学年网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 配置选课
   */
  jump(data: any) {
    this.$router.push({name: `Configuration`, query: {data: encodeURIComponent(JSON.stringify(data))}});
  }

  /**
   * 修改选课状态
   */
  realChangeEvent(data: any) {
    if (VerifyUtil.isStringBlank(data.id)) {
      this.$notify({
        title: '修改选课状态错误',
        message: '未选择要修改的选课状态',
        type: 'warning',
      });
      return
    }

    eventChangeEvent({eventId: data.id}).then((res: ResultData) => {
      this.loadingUpdateEventBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '修改选课状态成功',
          message: '成功',
          type: 'success',
        });
        this.page()
      } else {
        this.$notify({
          title: '修改选课状态错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateEventBtu = false;
      this.$notify({
        title: '修改选课状态网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 删除
   */
  realDeleteEvent(data: any) {
    this.loadingUpdateEventBtu = true;
    if (VerifyUtil.isStringBlank(data.id)) {
      this.$notify({
        title: '删除选课错误',
        message: '未选择要删除的选课',
        type: 'warning',
      });
      this.loadingUpdateEventBtu = false;
      return
    }

    eventRemoveEvent({eventId: data.id}).then((res: ResultData) => {
      this.loadingUpdateEventBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '删除选课成功',
          message: '成功',
          type: 'success',
        });
        this.closeCreateEventDialog();
        this.page()
      } else {
        this.$notify({
          title: '删除选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateEventBtu = false;
      this.$notify({
        title: '删除选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 更新分发
   */
  createEvent() {
    this.loadingUpdateEventBtu = true;
    // @ts-ignore
    this.$refs['eventModel'].validate((valid: any) => {
      if (valid) {
        if (this.nowIsUpdate) {
          this.realUpdateEvent();
        } else {
          this.realCreateEvent();
        }
      } else {
        this.loadingUpdateEventBtu = false;
      }
    });
  }

  /**
   * 真正的创建
   */
  realCreateEvent() {
    eventCreateEvent(this.eventModel).then((res: ResultData) => {
      this.loadingUpdateEventBtu = false;
      if (ResultUtil.success(res)) {
        this.eventTable.unshift(res.data);
        this.closeCreateEventDialog();
        this.page();
        this.$notify({
          title: '创建选课成功',
          message: '成功',
          type: 'success',
        });
      } else {
        this.$notify({
          title: '创建选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateEventBtu = false;
      this.$notify({
        title: '创建选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 真正的更新
   */
  realUpdateEvent() {
    let data: EventModel = {
      id: this.eventModel.id,
      name: this.eventModel.name,
      num: this.eventModel.num,
      stime: this.eventModel.stime,
      etime: this.eventModel.etime,
      schoolYear: this.eventModel.schoolYear,
      canUpdate: this.eventModel.canUpdate,
      tagIds: this.eventModel.tagIds
    };

    eventUpdateEvent(data).then((res: ResultData) => {
      this.loadingUpdateEventBtu = false;
      if (ResultUtil.success(res)) {
        this.closeCreateEventDialog();
        this.page();
        this.$notify({
          title: '修改选课成功',
          message: '成功',
          type: 'success',
        });
      } else {
        this.$notify({
          title: '修改选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateEventBtu = false;
      this.$notify({
        title: '修改选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 关闭创建弹框
   */
  closeCreateEventDialog() {
    this.loadingUpdateEventBtu = false;
    this.eventModel = {};
    this.visibleCreateEventDialog = false;
    this.nowIsUpdate = false;
  }

  /**
   * 显示更新选课
   */
  showUpdateEvent(data
                      :
                      any
  ) {
    this.listTag();
    this.selectSchoolYear();
    this.eventModel = data;
    this.nowIsUpdate = true;
    this.visibleCreateEventDialog = true;
  }

  /**
   * 显示新增选课弹框
   */
  showCreateEventDialog() {
    this.listTag();
    this.selectSchoolYear();
    this.visibleCreateEventDialog = true
  }

  /**
   * 分页
   */
  page() {
    this.loadingPage = true;
    eventPage(this.pageParam).then((res: ResultData) => {
      this.loadingPage = false;
      if (ResultUtil.success(res)) {
        this.eventTable = res.data['data'];
        this.tableTotal = res.data['totalCount'];
      } else {
        this.$notify({
          title: '查询选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.loadingPage = false;
      this.$notify({
        title: '查询选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 页变化
   */
  handleCurrentChange(val: number) {
    this.pageParam.page = val;
    this.page();
  }

  /**
   * 条数/页 变化
   */
  handleSizeChange(val: number) {
    this.pageParam.limit = val;
    this.page();
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
