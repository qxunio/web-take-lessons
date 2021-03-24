<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">标签详情</h1>

    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-page-header style="margin-bottom: 25px" @back="goBack" :content="tag.name"></el-page-header>


    <div class="page-container-title-right">
      <el-button icon="el-icon-plus" type="warning" @click="showAddDialog" circle title="添加学生"></el-button>
      <el-button icon="el-icon-upload2" type="success" @click="showImportUserDialog" circle title="导入"></el-button>
    </div>


    <div class='filter-box'>

      <el-select style="width: 105px" clearable v-model="pageParam.schoolYear" filterable placeholder="入学年">
        <el-option
            v-for="item in schoolYear"
            :key="item.id"
            :label="item.schoolYear"
            @change="pageUserFilterChange()"
            @keyup.enter.native="pageUser"
            :value="item.schoolYear">
        </el-option>
      </el-select>


      <el-input v-model="pageParam.class"
                style="width: 170px;margin-left:3px"
                placeholder="班级"
                @keyup.enter.native="pageUser"
                @change="pageUserFilterChange()"
                clearable></el-input>

      <el-input v-model="pageParam.dest"
                style="width: 170px;margin-left:3px"
                placeholder="姓名或账号"
                @keyup.enter.native="pageUser"
                @change="pageUserFilterChange()"
                clearable></el-input>


      <el-button icon="el-icon-search"
                 v-loading='loadingPage'
                 @click="pageUser"
                 circle
                 style="margin-left: 5px"></el-button>


    </div>

    <el-table
        v-loading='loadingPage'
        :cell-style="getCell"
        :header-cell-style="getTableHeaderClass"
        :data="userTable">

      <el-table-column
          prop="name"
          label="学生姓名">
      </el-table-column>

      <el-table-column
          prop="account"
          label="学生账号">
      </el-table-column>

      <el-table-column
          prop="schoolYear"
          label="入学年">
      </el-table-column>

      <el-table-column
          prop="class"
          label="班级">
      </el-table-column>

      <el-table-column
          prop="ctime"
          label="加入时间">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-popconfirm
              confirmButtonText='好的'
              cancelButtonText='不用了'
              icon="el-icon-info"
              iconColor="red"
              title="这个用户确定删除吗？"
              @onConfirm="realDeleteUser(scope.row)"
              @onCancel="closeCreateUserDialog()"
          >
            <a class="click-a" slot="reference">移除</a>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
        style='text-align: center;padding-top: 20px'
        @size-change="handleUserSizeChange"
        @current-change="handleUserCurrentChange"
        :current-page="pageParam.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="20"
        layout="total, sizes, prev, pager, next"
        :total="userTableTotal">
    </el-pagination>


    <el-dialog
        :append-to-body="true"
        :close-on-click-modal="false"
        title="添加学生"
        :visible.sync="showDialogAdd"
        width="50%"
        :before-close="handleCloseAddDialog">

      <div>

        <el-tabs type="border-card" @tab-click="clickPane">


          <el-tab-pane label="按班级添加">

            <el-select style="width: 105px" clearable v-model="inputSchoolYear" filterable placeholder="入学年">
              <el-option
                  v-for="item in schoolYear"
                  :key="item.id"
                  :label="item.schoolYear"
                  :value="item.schoolYear">
              </el-option>
            </el-select>

            <el-input v-model="inputClass"
                      style="width: 170px;margin-left:3px"
                      placeholder="班级"
                      @keyup.enter.native="createStuByClass"
            ></el-input>

            <el-button icon="el-icon-plus"
                       v-loading='loadingAddClass'
                       @click="createStuByClass"
                       circle
                       title="添加"
                       style="margin-left: 5px"></el-button>
          </el-tab-pane>

          <el-tab-pane label="自由选择">

            <el-select style="width: 105px" clearable v-model="pageStuParam.schoolYear" filterable placeholder="入学年">
              <el-option
                  v-for="item in schoolYear"
                  :key="item.id"
                  :label="item.schoolYear"
                  @change="pageFilterChange()"
                  @keyup.enter.native="pageStu"
                  :value="item.schoolYear">
              </el-option>
            </el-select>


            <el-input v-model="pageStuParam.class"
                      style="width: 170px;margin-left:3px"
                      placeholder="班级"
                      @keyup.enter.native="pageStu"
                      @change="pageFilterChange()"
                      clearable></el-input>

            <el-input v-model="pageStuParam.dest"
                      style="width: 170px;margin-left:3px"
                      placeholder="姓名或账号"
                      @keyup.enter.native="pageStu"
                      @change="pageFilterChange()"
                      clearable></el-input>


            <el-button icon="el-icon-search"
                       v-loading='loadingStuPage'
                       @click="pageStu"
                       circle
                       style="margin-left: 5px"></el-button>

            <el-button type="success"
                       style="margin-left: 5px"
                       size="small"
                       :disabled="multipleSelection.length === 0"
                       :loading="loadingStuList"
                       @click="createStuList">
              添加学生
            </el-button>


            <el-table
                ref="multipleTable"
                @selection-change="handleStuSelectionChange"
                v-loading='loadingStuPage'
                :cell-style="getCell"
                :header-cell-style="getTableHeaderClass"
                :data="stuTable">

              <el-table-column type="selection"></el-table-column>

              <el-table-column
                  prop="name"
                  label="学生姓名">
              </el-table-column>

              <el-table-column
                  prop="account"
                  label="学生账号">
              </el-table-column>

              <el-table-column
                  prop="schoolYear"
                  label="入学年">
              </el-table-column>

              <el-table-column
                  prop="class"
                  label="班级">
              </el-table-column>

              <el-table-column
                  prop="ctime"
                  label="创建时间">
              </el-table-column>
            </el-table>

            <el-pagination
                style='text-align: center;padding-top: 20px'
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageStuParam.page"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="20"
                layout="total, sizes, prev, pager, next"
                :total="stuTableTotal">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>

      </div>
    </el-dialog>

    <!-- 上传用户弹框 -->
    <el-dialog
        width="630px"
        title="批量导入用户"
        :visible.sync="visibleImportUserDialog"
        :before-close="closeImportUserDialog"
        :append-to-body="true"
        :close-on-click-modal="false">

      <!-- 上传文件框 -->
      <div style='margin: 0 auto;text-align: center'>

        <el-collapse accordion style="margin-bottom: 20px">
          <p style="margin-left: 10px">
            导入说明&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="font-size: 10px !important;">
                                请按照模板导入，只支持后缀为 <span class="key-word"
                                                     style="display: inline">xlsx</span> 的文件，只解析<span
                class="key-word" style="display: inline">第一个sheet</span>的内容，且不能存在空行</span>

          </p>
          <div class="operate" style="padding-bottom: 8px;">
            <a @click="realExportTemplate" style="font-size: 10px">点击下载模板</a>
          </div>
        </el-collapse>

        <br>


        <div style="margin-top: 20px">
          <el-upload
              :headers='headers'
              ref="upload"
              :drag="true"
              :before-upload='beforeUpload'
              :on-success="uploadSuccess"
              :on-error="uploadFail"
              :action=uploadApi
              :data="tdata"
              :limit='limitFile'
              :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>点击上传excel</em></div>
          </el-upload>
        </div>

      </div>

      <div slot="footer">
        <el-button @click="closeImportUserDialog()">取 消</el-button>
        <el-button @click="upload()" :loading="loadingImportUserBtu" type="primary">导 入</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {Tag} from "@/views/admin/tag/model";
import {SchoolYear, UserModel} from "@/views/admin/user/model";
import {
  BASE_URL,
  schoolYearListSchoolYear,
  tagStuCreateByClass,
  tagStuCreateList, tagStuDownExportTemplate,
  tagStuPage,
  tagStuRemove,
  userPage
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {DownType, DownUtil} from "@/utils/down-util";
import {LocalStorageUtil} from "@/utils/local-storage-util";

@Component
export default class TagList extends Vue {
  tag: Tag = {}
  userTable: UserModel[] = [];
  userTableTotal = 0;
  stuTable: UserModel[] = [];
  stuTableTotal = 0;
  loadingPage = false;
  loadingStuPage = false;
  showDialogAdd = false;
  inputClass = '';
  inputSchoolYear = '';
  loadingAddClass = false;
  schoolYear: SchoolYear[] = [];
  pageStuParam: any = {
    dest: '',
    limit: 20,
    page: 1,
    userType: '3',
    schoolYear: '',
    class: ''
  };

  pageParam: any = {
    dest: '',
    limit: 20,
    page: 1,
    schoolYear: '',
    class: '',
    tagId: ''
  };
  multipleSelection = []
  loadingStuList = false;
  visibleImportUserDialog = false;
  headers = {'Authorization': LocalStorageUtil.getUserToken()};
  loadingImportUserBtu = false
  uploadApi = '';
  limitFile = 1;
  tdata = {tagId: ''};


  created() {
    // @ts-ignore
    this.tag = JSON.parse(decodeURIComponent(this.$route.query.data));
    this.pageUser();
    this.selectSchoolYear();
    this.uploadApi = `${BASE_URL}/tag/import`
  }

  showImportUserDialog() {
    this.visibleImportUserDialog = true;
  }

  /**
   *上传的方法
   */
  upload() {
    //@ts-ignore
    this.tdata.tagId = this.tag.id
    this.loadingImportUserBtu = true;
    //@ts-ignore
    this.$refs.upload.submit();
    this.loadingImportUserBtu = false
  }


  /**
   * 上传失败的回调
   */
  uploadFail(err: any) {
    this.loadingImportUserBtu = false;
    console.log(err);
    this.$notify({
      title: '上传错误',
      message: err.message,
      type: 'error',
    });
  }

  /**
   * 上传成功的回调
   */
  uploadSuccess(res: any) {
    this.loadingImportUserBtu = false;
    if (ResultUtil.success(res)) {
      if (VerifyUtil.isArraysBlank(res.data)) {
        this.pageUser();
        this.$notify({
          title: '导入成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '导入用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    } else {
      this.$notify({
        title: '导入用户错误',
        message: res.msg,
        type: 'warning',
      });
    }
    //@ts-ignore
    this.$refs.upload.clearFiles();
  }

  /**
   *关闭导入用户弹框
   */
  closeImportUserDialog() {
    this.visibleImportUserDialog = false;
    this.loadingImportUserBtu = false;
  }

  /**
   * 上传之前
   */
  beforeUpload() {
  }

  /**
   * 模板下载
   */
  realExportTemplate() {
    tagStuDownExportTemplate().then((res: any) => {
      DownUtil.down(res, DownType.EXCEL, "导入模板.xlsx");
    }, () => {
      this.$notify({
        title: '导出模板网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  createStuList() {
    this.loadingStuList = true;
    console.log(this.multipleSelection)
    if (VerifyUtil.isArraysBlank(this.multipleSelection)) {
      this.$notify({
        title: '没有选择学生',
        message: '请先选择学生',
        type: 'warning',
      });
      this.loadingStuList = false;
      return
    }

    tagStuCreateList({StuList: this.multipleSelection, tagId: this.tag.id}).then((res: ResultData) => {
      this.loadingStuList = false;
      if (ResultUtil.success(res)) {
        this.pageUser()
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '保存错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingStuList = false;
      this.$notify({
        title: '保存网络错误',
        message: '网络错误',
        type: 'error',
      });
    });


  }

  handleStuSelectionChange(val: any) {
    this.multipleSelection = val;
  }

  realDeleteUser(data: any) {
    if (VerifyUtil.isStringBlank(data.id)) {
      this.$notify({
        title: '删除失败',
        message: '参数缺省',
        type: 'warning',
      });
      return
    }
    tagStuRemove({uid: data.id, tagId: this.tag.id}).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.pageUser()
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '删除错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '删除网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  closeCreateUserDialog() {

  }


  createStuByClass() {
    this.loadingAddClass = true;
    if (VerifyUtil.isStringBlank(this.inputClass) || VerifyUtil.isStringBlank(this.inputSchoolYear) || VerifyUtil.isStringBlank(this.tag.id)) {
      this.$notify({
        title: '=添加失败',
        message: '参数缺省',
        type: 'warning',
      });
      this.loadingAddClass = false;
      return
    }

    tagStuCreateByClass({
      schoolYear: this.inputSchoolYear,
      class: this.inputClass,
      tagId: this.tag.id
    }).then((res: ResultData) => {
      this.loadingAddClass = false;
      if (ResultUtil.success(res)) {
        this.pageUser()
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '查询入学年错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingAddClass = false;
      this.$notify({
        title: '查询入学年网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  clickPane(data: any) {
    if (data.index === "1") {
      this.pageStu()
    }
  }

  pageStu() {
    this.loadingStuPage = true;
    userPage(this.pageStuParam).then((res: ResultData) => {
      this.loadingStuPage = false;
      if (ResultUtil.success(res)) {
        this.stuTable = res.data['data'];
        this.stuTableTotal = res.data['totalCount'];
      } else {
        this.$notify({
          title: '查询用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.loadingStuPage = false;
      this.$notify({
        title: '查询用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  pageUser() {
    this.pageParam.tagId = this.tag.id
    this.loadingPage = true;
    tagStuPage(this.pageParam).then((res: ResultData) => {
      this.loadingPage = false;
      if (ResultUtil.success(res)) {
        this.userTable = res.data['data'];
        this.userTableTotal = res.data['totalCount'];
      } else {
        this.$notify({
          title: '查询用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.loadingPage = false;
      this.$notify({
        title: '查询用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  showAddDialog() {
    this.showDialogAdd = true;
  }

  handleCloseAddDialog() {
    this.showDialogAdd = false;
    this.pageStuParam = {
      dest: '',
      limit: 20,
      page: 1,
      userType: '3',
      schoolYear: '',
      class: ''
    };
    this.inputClass = '';
    this.inputSchoolYear = '';
  }

  goBack() {
    this.$router.push({path: '/home/tag'});
  }

  /**
   * 过滤条件变化时，初始化分页参数
   */
  pageFilterChange() {
    this.pageStuParam.page = 1;
  }

  /**
   * 条数/页 变化
   */
  handleSizeChange(val: number) {
    this.pageStuParam.limit = val;
    this.pageStu();
  }

  /**
   * 页变化
   */
  handleCurrentChange(val: number) {
    this.pageStuParam.page = val;
    this.pageStu();
  }


  /**
   * 过滤条件变化时，初始化分页参数
   */
  pageUserFilterChange() {
    this.pageParam.page = 1;
  }

  /**
   * 条数/页 变化
   */
  handleUserSizeChange(val: number) {
    this.pageParam.limit = val;
    this.pageUser();
  }

  /**
   * 页变化
   */
  handleUserCurrentChange(val: number) {
    this.pageParam.page = val;
    this.pageUser();
  }

  /**
   * 查询入学年
   */
  selectSchoolYear() {
    schoolYearListSchoolYear().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.schoolYear = res.data
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
