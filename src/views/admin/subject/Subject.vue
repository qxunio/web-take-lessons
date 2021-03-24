<template>
  <div class="page-container">

    <!-- 头部 -->
    <h1 class="page-container-title">学科库</h1>
    <div class="page-container-title-right">
      <el-button icon="el-icon-plus" type="warning" @click="showCreateSubjectDialog" circle
                 title="添加学科"></el-button>
      <el-button icon="el-icon-download" type="primary" @click="realExportSubject"
                 :loading="loadingExportSubjectBtu"
                 circle title="导出学科"></el-button>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 表格 -->
    <div>
      <el-table
          v-loading='loadingPage'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="subjectTable">
        <el-table-column
            prop="name"
            label="学科">
        </el-table-column>
        <el-table-column label="介绍">
          <template slot-scope="scope">
            <el-popover
                popper-class="subject-introduction"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row['introduction']">
              <p slot="reference" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; ">
                {{ scope.row.introduction }}</p>
            </el-popover>
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
              <a @click="showUpdateSubject(scope.row)">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="showDeleteSubject(scope.row)">删除</a>
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
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="tableTotal">
      </el-pagination>
    </div>

    <!-- 更新学科弹框 -->
    <el-dialog
        width="500px"
        :title="nowIsUpdate ? '修改学科':'增加学科'"
        :visible.sync="visibleCreateSubjectDialog"
        :before-close="closeCreateSubjectDialog"
        :append-to-body="true"
        :close-on-click-modal="false">


      <el-form :model="subjectModel" ref="subjectModel" label-width="50px" size="mini"
               style="margin: 0 auto;width: 80%">
        <el-form-item
            prop="name"
            label="学科"
            :rules="[
                                  { required: true, message: '请输入学科名', trigger: 'blur' },
                                  { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                                ]">
          <el-input v-model="subjectModel.name"></el-input>
        </el-form-item>

        <el-form-item
            prop="introduction"
            label="介绍"
            :rules="[
                                  { required: true, message: '请输入学科介绍', trigger: 'blur' }
                                ]">
          <el-input
              type="textarea"
              :rows="15"
              v-model="subjectModel.introduction"
              maxlength="300"
              show-word-limit></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer">
        <el-button @click="closeCreateSubjectDialog()">取 消</el-button>
        <el-button @click="createSubject()" type="primary" :loading="loadingUpdateSubjectBtu">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除学科弹框 -->
    <el-dialog
        width="500px"
        title="删除学科"
        :visible.sync="visibleDeleteSubjectDialog"
        :before-close="closeCreateSubjectDialog"
        :append-to-body="true"
        :close-on-click-modal="false">
      你确定要删除该学科吗?
      <div slot="footer">
        <el-button @click="closeCreateSubjectDialog()">取 消</el-button>
        <el-button @click="realDeleteSubject()" :loading="loadingUpdateSubjectBtu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {SubjectModel} from "@/views/admin/subject/model";
import {
  subjectCreateSubject,
  subjectDeleteSubject,
  subjectExportSubject,
  subjectPage,
  subjectUpdateSubject
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {DownType, DownUtil} from "@/utils/down-util";

@Component
export default class Subject extends Vue {
  loadingPage = false;
  subjectTable: SubjectModel[] = [];
  loadingExportSubjectBtu = false;
  tableTotal = 0;
  pageParam: any = {
    limit: 10,
    page: 1,
  };
  nowIsUpdate = false;
  subjectModel: SubjectModel = {};
  loadingUpdateSubjectBtu = false;
  visibleCreateSubjectDialog = false;
  visibleDeleteSubjectDialog = false;


  created() {
    this.page();
  }

  /**
   * 真正删除学科
   */
  realDeleteSubject() {
    this.loadingUpdateSubjectBtu = true;
    if (VerifyUtil.isStringBlank(this.subjectModel.id)) {
      this.$notify({
        title: '删除学科错误',
        message: '未选择要删除的学科',
        type: 'warning',
      });
      this.loadingUpdateSubjectBtu = false;
      return
    }

    subjectDeleteSubject({subjectId: this.subjectModel.id}).then((res: ResultData) => {
      this.loadingUpdateSubjectBtu = false;
      if (ResultUtil.success(res)) {
        this.$notify({
          title: '删除学科成功',
          message: '成功',
          type: 'success',
        });
        this.closeCreateSubjectDialog();
        this.page()
      } else {
        this.$notify({
          title: '删除学科错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateSubjectBtu = false;
      this.$notify({
        title: '删除学科网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 显示删除
   */
  showDeleteSubject(data: any) {
    this.subjectModel = data;
    this.visibleDeleteSubjectDialog = true;
  }

  /**
   * 显示更新
   */
  showUpdateSubject(data: any) {
    this.subjectModel = data;
    this.nowIsUpdate = true;
    this.visibleCreateSubjectDialog = true;
  }

  /**
   * 更新学科分发
   */
  createSubject() {
    this.loadingUpdateSubjectBtu = true;
    // @ts-ignore
    this.$refs['subjectModel'].validate((valid: any) => {
      if (valid) {
        if (this.nowIsUpdate) {
          this.realUpdateUser();
        } else {
          this.realCreateUser();
        }
      } else {
        this.loadingUpdateSubjectBtu = false;
      }
    });
  }

  /**
   * 真正的创建
   */
  realCreateUser() {
    subjectCreateSubject(this.subjectModel).then((res: ResultData) => {
      this.loadingUpdateSubjectBtu = false;
      if (ResultUtil.success(res)) {
        this.subjectTable.unshift(res.data);
        this.subjectModel = {};
        this.page();
        this.$notify({
          title: '创建学科成功',
          message: '成功',
          type: 'success',
        });
      } else {
        this.$notify({
          title: '创建学科错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateSubjectBtu = false;
      this.$notify({
        title: '创建学科网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 真正的更新
   */
  realUpdateUser() {
    subjectUpdateSubject(this.subjectModel).then((res: ResultData) => {
      this.loadingUpdateSubjectBtu = false;
      if (ResultUtil.success(res)) {
        this.closeCreateSubjectDialog();
        this.page();
        this.$notify({
          title: '修改学科成功',
          message: '成功',
          type: 'success',
        });
      } else {
        this.$notify({
          title: '修改学科错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.loadingUpdateSubjectBtu = false;
      this.$notify({
        title: '修改学科网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   *显示创建学科的弹框
   */
  showCreateSubjectDialog() {
    this.visibleCreateSubjectDialog = true;
  }

  /**
   * 关闭增加学科弹框
   */
  closeCreateSubjectDialog() {
    this.visibleCreateSubjectDialog = false;
    this.subjectModel = {};
    this.nowIsUpdate = false;
    this.visibleDeleteSubjectDialog = false
  }

  /**
   * 分页
   */
  page() {
    this.loadingPage = true;
    subjectPage(this.pageParam).then((res: ResultData) => {
      this.loadingPage = false;
      if (ResultUtil.success(res)) {
        this.subjectTable = res.data['data'];
        this.tableTotal = res.data['totalCount'];
      } else {
        this.$notify({
          title: '查询学科错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, e => {
      this.loadingPage = false;
      this.$notify({
        title: '查询学科网络错误',
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
   * 导出学科
   */
  realExportSubject() {
    this.loadingExportSubjectBtu = true;
    subjectExportSubject().then((res: any) => {
      this.loadingExportSubjectBtu = false;
      DownUtil.down(res, DownType.EXCEL, "TakeLessons学科.xlsx");
    }, () => {
      this.loadingExportSubjectBtu = false;
      this.$notify({
        title: '导出学科网络错误',
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
.filter-box {
  height: 50px;
  box-sizing: border-box;
  margin: 30px auto 0;
  vertical-align: center;
  text-align: center;
}
</style>
