<template>
  <div class="page-container">

    <!-- 头部 -->
    <h1 class="page-container-title">用户管理</h1>
    <div class="page-container-title-right">
      <el-button icon="el-icon-s-tools" type="info" @click="showSchoolYearDialog" circle
                 title="入学年设置"></el-button>
      <el-button icon="el-icon-plus" type="warning" @click="showCreateUserDialog" circle title="添加用户"></el-button>
      <el-button icon="el-icon-upload2" type="success" @click="showImportUserDialog" circle
                 title="批量导入"></el-button>
      <el-button icon="el-icon-download" type="primary" @click="realExportUser" :loading="loadingExportUserBtu"
                 circle title="导出用户"></el-button>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 表单 -->
    <div>

      <div class='filter-box'>
        <el-select v-model="pageParam.userType"
                   placeholder="用户类型"
                   style="width: 105px"
                   @change="pageFilterChange()"
                   clearable>
          <el-option
              v-for="item in userType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

        <div style="display: inline-block" v-if="pageParam.userType === '3'">

          <el-select style="width: 105px" clearable v-model="pageParam.schoolYear" filterable placeholder="入学年">
            <el-option
                v-for="item in schoolYear"
                :key="item.id"
                :label="item.schoolYear"
                @change="pageFilterChange()"
                @keyup.enter.native="page"
                :value="item.schoolYear">
            </el-option>
          </el-select>


          <el-input v-model="pageParam.class"
                    style="width: 170px;margin-left:3px"
                    placeholder="班级"
                    @keyup.enter.native="page"
                    @change="pageFilterChange()"
                    clearable></el-input>

        </div>


        <el-input v-model="pageParam.dest"
                  style="width: 170px;margin-left:3px"
                  placeholder="姓名或账号"
                  @keyup.enter.native="page"
                  @change="pageFilterChange()"
                  clearable></el-input>


        <el-button icon="el-icon-search"
                   v-loading='loadingPage'
                   @click="page"
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
            label="姓名">
        </el-table-column>

        <el-table-column prop="account">
          <template slot="header" slot-scope="scope">
            账号&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-warning" style="cursor:pointer;color: #7d7a7a" title="账号不可修改"></i>
          </template>
        </el-table-column>

        <el-table-column
            prop="type"
            label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === '3'" color="rgba(32, 126, 217, 0.78)" style="color: #f2f6fc">
              学生
            </el-tag>
            <el-tag v-if="scope.row.type === '2'" color="#67c23a" style="color: #f2f6fc">
              教师
            </el-tag>
            <el-tag v-if="scope.row.type === '1'" color="red" style="color: #f2f6fc"> 管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="account"
            label="入学年(学生)">
          <template slot-scope="scope">
            <span v-if="scope.row.type==='3'">{{ scope.row.schoolYear }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="class"
            label="班级(学生)">
          <template slot-scope="scope">
            <span v-if="scope.row.class !== ''">{{ scope.row.class }}</span>
            <span v-else>-</span>
          </template>

        </el-table-column>
        <el-table-column
            prop="ctime"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <a @click="showUpdateUser(scope.row)">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="这个用户确定删除吗？"
                  @onConfirm="realDeleteUser(scope.row)"
                  @onCancel="closeCreateUserDialog()"
              >
                <a class="click-a" slot="reference">删除</a>
              </el-popconfirm>
              <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="这个用户确定要重置密码吗？"
                  @onConfirm="resetUser(scope.row)"
                  @onCancel="closeCreateUserDialog()"
              >
                <a class="click-a" slot="reference">重置密码</a>
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
          :total="tableTotal">
      </el-pagination>

    </div>

    <!-- 更新用户弹框 -->
    <el-dialog
        width="400px"
        :title="nowIsUpdate ? '修改用户':'增加用户'"
        :visible.sync="visibleCreateUserDialog"
        :before-close="closeCreateUserDialog"
        :append-to-body="true"
        :close-on-click-modal="false">


      <el-form :model="userModel" ref="userModel" label-width="80px" size="mini">
        <el-form-item
            prop="name"
            label="姓名"
            :rules="[
                                  { required: true, message: '请输入用户姓名', trigger: 'blur' },
                                  { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                                ]">
          <el-input v-model="userModel.name"></el-input>
        </el-form-item>

        <el-form-item
            v-show="!nowIsUpdate"
            prop="account"
            label="账号"
            :rules="[
                                  { required: true, message: '请输入账号', trigger: 'blur' },
                                  { required: true,validator:validateAccount, trigger: 'blur' }
                                ]">
          <el-input v-model="userModel.account"></el-input>
        </el-form-item>

        <el-form-item
            v-show="!nowIsUpdate"
            prop="password"
            label="密码"
            :rules="[
                                  { required: true, message: '请输入密码', trigger: 'blur' },
                                  { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                                ]">
          <el-input type="password" v-model="userModel.password"></el-input>
        </el-form-item>


        <el-form-item
            prop="type"
            label="类型"
            :rules="{ required: true, message: '请选择用户类型', trigger: 'change' }">
          <el-radio-group
              v-model="userModel.type"
              text-color="white"
              fill="##1673c1"
              size="mini">
            <el-radio-button v-for="item in userType" v-bind:key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>


        <el-form-item
            v-show="userModel.type === '3'"
            label="入学年"
            prop="schoolYear"
            :rules="{required: true,validator: validateSchoolYear, trigger: 'change'}">
          <el-select clearable v-model="userModel.schoolYear" filterable placeholder="请选择入学年" style="width: 100%">
            <el-option
                v-for="item in schoolYear"
                :key="item.id"
                :label="item.schoolYear"
                :value="item.schoolYear">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
            v-show="userModel.type === '3'"
            label="班级"
            prop="class"
            :rules="[{ required: true, validator: validateClass, trigger: 'blur' }]">
          <el-input min="1" max="99999" type="number" v-model="userModel.class"></el-input>
        </el-form-item>

      </el-form>


      <div slot="footer">
        <el-button @click="closeCreateUserDialog()">取 消</el-button>
        <el-button @click="createUser()" type="primary" :loading="loadingUpdateUserBtu">确 定</el-button>
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
      <div v-show="!hasAccountIsUse" style='margin: 0 auto;text-align: center'>

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

        导入用户类型：
        <el-radio-group
            v-model="tdata.userType"
            text-color="white"
            fill="#1673c1"
            size="mini">
          <el-radio-button v-for="item in userType" v-bind:key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>

        <br>

        <el-select v-show="tdata.userType === '3'" clearable v-model="tdata.schoolYear" filterable
                   style="margin-top: 20px"
                   placeholder="请选择入学年">
          <el-option
              v-for="item in schoolYear"
              :key="item.id"
              :label="item.schoolYear"
              :value="item.schoolYear">
          </el-option>
        </el-select>


        <div style="margin-top: 20px">
          <el-upload
              :headers='headers'
              ref="upload"
              :drag="true"
              :data="tdata"
              :before-upload='beforeUpload'
              :on-success="uploadSuccess"
              :on-error="uploadFail"
              :action=uploadApi
              :limit='limitFile'
              :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>点击上传excel</em></div>
          </el-upload>
        </div>

      </div>

      <!-- 存在账号被使用 -->
      <div v-show="hasAccountIsUse" style='margin: 0 auto;text-align: center'>
        <h3 style="color: #E6A23C">下面账号被使用，导入失败</h3>

        <el-table
            :cell-style="getCell"
            :header-cell-style="getTableHeaderClass"
            :data="accountIsUseList">
          <el-table-column
              prop="name"
              label="姓名">
          </el-table-column>
          <el-table-column
              prop="account"
              label="账号">
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer">
        <el-button @click="closeImportUserDialog()">取 消</el-button>
        <el-button @click="upload()" :loading="loadingImportUserBtu" type="primary">导 入</el-button>
      </div>
    </el-dialog>

    <!-- 入学年弹框 -->
    <el-dialog
        width="400px"
        title="入学年"
        :visible.sync="visibleSchoolYearDialog"
        :before-close="closeSchoolYearDialog"
        :append-to-body="true"
        :close-on-click-modal="false">

      <div>
        <el-tag
            v-for="tag in schoolYear"
            :key="tag.id"
            closable
            effect="dark"
            el-icon-iconName="el-icon-delete"
            size="medium"
            @close="handleClose(tag)"
            style="margin-right: 5px;cursor:pointer;"
            type="success">
          {{ tag.schoolYear }}
        </el-tag>

        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputSchoolYear"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" :loading="loadingCreateSchoolYearBtn" size="small"
                   @click="showInput">+ New
        </el-button>
      </div>

      <div slot="footer">
        <el-button @click="closeSchoolYearDialog()">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {SchoolYear, UserModel} from "@/views/admin/user/model";
import {
  app,
  BASE_URL,
  schoolYearCreateSchoolYear,
  schoolYearListSchoolYear,
  schoolYearRemoveSchoolYear,
  userCreateUser,
  userDeleteUser, userDownExportUserTemplate,
  userExportUser,
  userPage,
  userResetUser,
  userUpdateUser
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {VerifyUtil} from "@/utils/verify-util";
import {ScryptUtil} from "@/utils/scrypt-util";
import {ResultUtil} from "@/utils/result-util";
import {DownType, DownUtil} from "@/utils/down-util";
import {LocalStorageUtil} from "@/utils/local-storage-util";
import {RsaData} from "@/views/auth/model";

@Component
export default class User extends Vue {
  headers = {'Authorization': LocalStorageUtil.getUserToken()};
  userTable: UserModel[] = [];
  userType = [{'value': "2", 'label': '教师'}, {'value': "3", 'label': '学生'}];
  tableTotal = 0;
  pageParam: any = {
    dest: '',
    limit: 20,
    page: 1,
    userType: '',
    schoolYear: '',
    class: ''
  };
  visibleCreateUserDialog = false;
  userModel: UserModel = {};
  loadingUpdateUserBtu = false;
  loadingPage = false;
  nowIsUpdate = false;
  loadingExportUserBtu = false;
  visibleImportUserDialog = false;
  loadingImportUserBtu = false;
  selectUserType = '';
  selectNowSchoolYear = '';
  tdata = {userType: '', schoolYear: ''};
  limitFile = 1;
  uploadApi = '';
  hasAccountIsUse = false;
  accountIsUseList = [];
  loadingResetUserBtu = false;
  rsa: RsaData = {};
  visibleSchoolYearDialog = false;
  schoolYear: SchoolYear[] = [];
  inputVisible = false;
  inputSchoolYear = '';
  loadingCreateSchoolYearBtn = false;

  created() {
    this.page();
    this.uploadApi = `${BASE_URL}/user/import`
    this.selectSchoolYear();
  }

  /**
   * 选择入学年的校验
   */
  validateSchoolYear(rule: any, value: any, callback: any) {
    if (this.userModel.type === "3") {
      if (VerifyUtil.isStringBlank(value)) {
        callback(new Error('请选择入学年'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  /**
   * 班级校验
   */
  validateClass(rule: any, value: any, callback: any) {
    if (this.userModel.type === "3") {
      if (VerifyUtil.isStringBlank(value)) {
        callback(new Error('请选择班级'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  /**
   * 账号校验
   */
  validateAccount(rule: any, value: any, callback: any) {
    this.userModel.account = this.userModel.account?.trim()
    // @ts-ignore
    let length = this.userModel.account.length;
    if (length < 2 || length > 16) {
      callback(new Error('长度在 2 到 16 个字符'));
    } else {
      callback();
    }
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
      this.loadingResetUserBtu = false;
      this.$notify({
        title: '查询入学年网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 显示新增入学年输入框
   */
  showInput() {
    this.inputVisible = true;
    //@ts-ignore
    this.$nextTick(_ => {
      //@ts-ignore
      this.$refs.saveTagInput.$refs.input.focus();
    });
  }

  /**
   * 新增入学年
   */
  handleInputConfirm() {
    this.loadingCreateSchoolYearBtn = true;
    let inputValue = this.inputSchoolYear.trim();
    if (!VerifyUtil.isStringBlank(inputValue)) {
      schoolYearCreateSchoolYear({schoolYear: inputValue}).then((res: ResultData) => {
        this.inputVisible = false;
        this.inputSchoolYear = '';
        this.loadingCreateSchoolYearBtn = false;
        if (ResultUtil.success(res)) {
          this.schoolYear.push(res.data);
          this.$notify({
            title: '创建成功',
            message: '成功',
            type: 'success',
          });
        } else {
          this.$notify({
            title: '新增入学年错误',
            message: res.msg,
            type: 'warning',
          });
        }
      }, () => {
        this.loadingCreateSchoolYearBtn = false;
        this.inputVisible = false;
        this.inputSchoolYear = '';
        this.$notify({
          title: '新增入学年错误',
          message: '网络错误',
          type: 'error',
        });
      });
    } else {
      this.loadingCreateSchoolYearBtn = false;
      this.inputVisible = false;
      this.inputSchoolYear = '';
    }
  }

  /**
   * 删除入学年
   */
  handleClose(tag: SchoolYear) {
    if (!VerifyUtil.isStringBlank(tag.schoolYear)) {
      schoolYearRemoveSchoolYear({schoolYear: tag.schoolYear}).then((res: ResultData) => {
        if (ResultUtil.success(res)) {
          let index = this.schoolYear.indexOf(tag);
          this.schoolYear.splice(index, 1);
          this.$notify({
            title: '删除入学年成功',
            message: '成功',
            type: 'success',
          });
        } else {
          this.$notify({
            title: '删除入学年错误',
            message: res.msg,
            type: 'warning',
          });
        }
      }, () => {
        this.$notify({
          title: '重置用户密码网络错误',
          message: '网络错误',
          type: 'error',
        });
      });
    }
  }

  /**
   * 显示入学年弹框
   */
  showSchoolYearDialog() {
    this.selectSchoolYear();
    this.visibleSchoolYearDialog = true;
  }

  /**
   * 关闭入学年弹框
   */
  closeSchoolYearDialog() {
    this.visibleSchoolYearDialog = false;
    this.inputVisible = false;
    this.inputSchoolYear = '';
    this.loadingCreateSchoolYearBtn = false;
  }

  /**
   * 显示重置用户密码
   */
  resetUser(data: any) {
    this.userModel = data;
    this.loadingResetUserBtu = true;
    if (VerifyUtil.isStringBlank(this.userModel.id)) {
      this.$notify({
        title: '重置用户密码错误',
        message: '未选择要重置密码的用户',
        type: 'warning',
      });
      this.loadingResetUserBtu = false;
      return
    }

    userResetUser({userId: this.userModel.id}).then((res: ResultData) => {
      this.loadingResetUserBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '重置用户密码成功',
          message: '成功',
          type: 'success',
        });
        this.closeCreateUserDialog();
        this.page()
      } else {
        this.$notify({
          title: '重置用户密码错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingResetUserBtu = false;
      this.$notify({
        title: '重置用户密码网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }


  /**
   *上传的方法
   */
  upload() {
    this.loadingImportUserBtu = true;
    if (VerifyUtil.isStringBlank(this.tdata.userType)) {
      this.loadingImportUserBtu = false;
      this.$notify({
        title: '上传错误',
        message: '请选择上传的用户类型',
        type: 'error',
      });
      return
    }
    if (this.tdata.userType === '3') {
      if (VerifyUtil.isStringBlank(this.tdata.schoolYear)) {
        this.loadingImportUserBtu = false;
        this.$notify({
          title: '上传错误',
          message: '选择学生必须选择入学年',
          type: 'error',
        });
        return
      }
    }
    //@ts-ignore
    this.$refs.upload.submit();
    this.loadingImportUserBtu = false;
  }

  /**
   * 上传成功的回调
   */
  uploadSuccess(res: any) {
    this.loadingImportUserBtu = false;
    if (ResultUtil.success(res)) {
      if (VerifyUtil.isArraysBlank(res.data)) {
        this.page();
        this.tdata = {userType: '', schoolYear: ''};
        this.$notify({
          title: '导入用户成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        // 账号被使用的用户
        this.hasAccountIsUse = true;
        this.accountIsUseList = res.data;
        this.$notify({
          title: '导入用户错误',
          message: '存在账号被使用的用户',
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
   * 上传之前
   */
  beforeUpload() {
  }

  /**
   * 显示导入用户弹框
   */
  showImportUserDialog() {
    this.visibleImportUserDialog = true;
    if (VerifyUtil.isArraysBlank(this.schoolYear)) {
      this.selectSchoolYear();
    }
  }

  /**
   *关闭导入用户弹框
   */
  closeImportUserDialog() {
    this.visibleImportUserDialog = false;
    this.loadingImportUserBtu = false;
    this.selectUserType = '';
    this.hasAccountIsUse = false;
    this.accountIsUseList = [];
  }

  /**
   * 导出所有用户
   */
  realExportUser() {
    this.loadingExportUserBtu = true;
    userExportUser().then((res: any) => {
      this.loadingExportUserBtu = false;
      DownUtil.down(res, DownType.EXCEL, "TakeLessons用户.xlsx");
    }, () => {
      this.loadingExportUserBtu = false;
      this.$notify({
        title: '导出用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 模板下载
   */
  realExportTemplate() {
    userDownExportUserTemplate().then((res: any) => {
      DownUtil.down(res, DownType.EXCEL, "导入模板.xlsx");
    }, () => {
      this.$notify({
        title: '导出用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 关闭弹框
   */
  closeCreateUserDialog() {
    this.visibleCreateUserDialog = false;
    this.userModel = {};
    this.loadingUpdateUserBtu = false;
    this.nowIsUpdate = false;
    this.loadingResetUserBtu = false;
  }

  /**
   * 显示删除
   */
  realDeleteUser(data: any) {
    if (data.type === "1") {
      return
    }
    this.userModel = data;
    this.loadingUpdateUserBtu = true;
    if (VerifyUtil.isStringBlank(this.userModel.id)) {
      this.$notify({
        title: '删除用户错误',
        message: '未选择要删除的用户',
        type: 'warning',
      });
      this.loadingUpdateUserBtu = false;
      return
    }

    userDeleteUser({userId: this.userModel.id}).then((res: ResultData) => {
      this.loadingUpdateUserBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '删除用户成功',
          message: '成功',
          type: 'success',
        });
        this.closeCreateUserDialog();
        this.page()
      } else {
        this.$notify({
          title: '删除用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateUserBtu = false;
      this.$notify({
        title: '删除用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 显示更新
   */
  showUpdateUser(data: any) {
    if (data.type === "1") {
      return
    }
    this.userModel = {id: data.id, type: data.type, name: data.name, schoolYear: data.schoolYear, class: data.class};
    // 因为修改和增加用户用的是同一表单，所有这里加上，过表单验证，提交数据时再去掉
    this.userModel.password = 'abc123';
    this.userModel.account = 'abc123';
    this.visibleCreateUserDialog = true;
    this.nowIsUpdate = true;
    if (VerifyUtil.isArraysBlank(this.schoolYear)) {
      this.selectSchoolYear();
    }
  }

  /**
   * 新增用户
   */
  createUser() {
    this.loadingUpdateUserBtu = true;
    // @ts-ignore
    this.$refs['userModel'].validate((valid: any) => {
      if (valid) {
        if (this.nowIsUpdate) {
          this.realUpdateUser();
        } else {
          this.get();
        }
      } else {
        this.loadingUpdateUserBtu = false;
      }
    });
    this.loadingUpdateUserBtu = false;
  }


  /**
   * 真正修改用户
   */
  realUpdateUser() {
    let data: UserModel = {
      id: this.userModel.id,
      name: this.userModel.name,
      type: this.userModel.type,
      schoolYear: this.userModel.schoolYear,
      class: this.userModel.class
    };
    userUpdateUser(data).then((res: ResultData) => {
      this.loadingUpdateUserBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '修改用户成功',
          message: '成功',
          type: 'success',
        });
        this.closeCreateUserDialog();
        this.page()
      } else {
        this.$notify({
          title: '修改用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateUserBtu = false;
      this.$notify({
        title: '修改用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 真正创建用户
   */
  realCreateUser(key: any) {
    let data: UserModel = {
      name: this.userModel.name,
      account: ScryptUtil.RSAEncrypt(this.userModel.account, key),
      password: ScryptUtil.RSAEncrypt(this.userModel.password, key),
      type: this.userModel.type,
      uid: this.rsa.uid,
      schoolYear: this.userModel.schoolYear,
      class:this.userModel.class
    };

    userCreateUser(data).then((res: ResultData) => {
      this.loadingUpdateUserBtu = false;
      if (ResultUtil.success(res)) {
        this.userTable.unshift(res.data);
        this.closeCreateUserDialog();
        this.page();
        this.$notify({
          title: '创建用户成功',
          message: '成功',
          type: 'success',
        });
      } else {
        this.$notify({
          title: '创建用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateUserBtu = false;
      this.$notify({
        title: '创建用户网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  get() {
    app().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.rsa = res.data;
        let publicKey = res.data.pk;
        if (VerifyUtil.isStringBlank(publicKey)) {
          this.$notify({
            title: '错误',
            message: '页面已过期，请重新刷新',
            type: 'warning',
          });
        } else {
          let key = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
          this.realCreateUser(key);
        }
      } else {
        this.$notify({
          title: '查创建用户错误',
          message: res.msg,
          type: 'warning',
        });
      }
    });
  }

  /**
   * 分页查询
   */
  page() {
    this.loadingPage = true;
    userPage(this.pageParam).then((res: ResultData) => {
      this.loadingPage = false;
      if (ResultUtil.success(res)) {
        this.userTable = res.data['data'];
        this.tableTotal = res.data['totalCount'];
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

  /**
   * 显示增加用户的弹框
   */
  showCreateUserDialog() {
    this.visibleCreateUserDialog = true;
    if (VerifyUtil.isArraysBlank(this.schoolYear)) {
      this.selectSchoolYear();
    }
  }

  /**
   * 过滤条件变化时，初始化分页参数
   */
  pageFilterChange() {
    this.pageParam.page = 1;
    if (this.pageParam.userType !== "3") {
      this.pageParam.class = ''
      this.pageParam.schoolYear = ''
    }
  }

  /**
   * 条数/页 变化
   */
  handleSizeChange(val: number) {
    this.pageParam.limit = val;
    this.page();
  }

  /**
   * 页变化
   */
  handleCurrentChange(val: number) {
    this.pageParam.page = val;
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
.filter-box {
  height: 50px;
  box-sizing: border-box;
  margin: 30px auto 0;
  vertical-align: center;
  text-align: center;
}

.input-new-tag {
  height: 28px;
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
