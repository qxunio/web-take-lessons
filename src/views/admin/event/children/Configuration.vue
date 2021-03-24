<template>
  <div class="page-container">

    <!-- 头部 -->
    <h1 class="page-container-title">选课</h1>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-page-header style="margin-bottom: 25px" @back="goBack" content="配置"></el-page-header>

    <p v-if="confTable !== undefined && confTable !== null" style="font-size: 12px;font-weight: bold">
      当前课程数: <span class="key-word ">{{ confTable.length }}</span>
    </p>

    <div class="page-container-title-right">
      <el-button type="success" @click="showOneKeyDialog()" icon="el-icon-copy-document" circle
                 title="一键配置"></el-button>
      <el-button icon="el-icon-plus" @click="showCreateConfigDialog" type="warning" circle title="添加"></el-button>
    </div>

    <!-- 主体区域 -->
    <div>
      <el-table
          v-loading='loadingPage'
          :cell-style="getCell"
          :header-cell-style="getTableHeaderClass"
          :data="confTable">
        <el-table-column
            prop="className"
            label="课堂名称">
        </el-table-column>
        <el-table-column
            prop="subjectName"
            label="学科">
        </el-table-column>

        <el-table-column
            prop="num"
            label="课程限制人数">
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
            prop="name"
            label="教师">
          <template slot-scope="scope">
            <div v-for="teacher in scope.row.teachers">
              <span>{{ teacher.teacherName }}#{{ teacher.teacherAccount }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <a @click="showUpdateConfig(scope.row)">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                  confirmButtonText='好的'
                  cancelButtonText='不用了'
                  icon="el-icon-info"
                  iconColor="red"
                  title="确定删除吗？"
                  @onConfirm="realDeleteConfig(scope.row)"
              >
                <a class="click-a" slot="reference">删除</a>
              </el-popconfirm>

            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- 更新学科弹框 -->
    <el-dialog
        width="850px"
        :title="nowIsUpdate ? '修改选课学科':'增加选课学科'"
        :visible.sync="visibleCreateConfigDialog"
        :before-close="closeCreateConfigDialog"
        :append-to-body="true"
        :close-on-click-modal="false">

      <div>
        <el-form :model="dynamicForm" ref="dynamicForm" label-width="100px" style="margin: 0 auto;width: 90%">

          <el-form-item
              prop="subjectId"
              label="学科"
              :rules="[
                                          { required: true, message: '请选择学科', trigger: 'change' }
                                    ]">
            <el-select v-model="dynamicForm.subjectId" filterable placeholder="请选择学科"
                       style="width: 100%">
              <el-option
                  v-for="item in subjects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
              prop="className"
              label="课堂名称">
            <template>
              <el-input v-model="dynamicForm.className" placeholder="不填写则默认为学科名称"></el-input>
            </template>
          </el-form-item>


          <el-form-item
              prop="num"
              label="限制人数"
              :rules="[
                                  { required: true, message: '请选择限制数量', trigger: 'blur' },
                                ]">
            <template>
              <el-input v-model="dynamicForm.num" type="number" placeholder="课程限制人数"></el-input>
            </template>
          </el-form-item>

          <el-form-item prop="teachAddress" label="教学地点">
            <el-input v-model="dynamicForm.teachAddress"></el-input>
          </el-form-item>

          <el-form-item prop="teachTime" label="教学时间">
            <el-input v-model="dynamicForm.teachTime"></el-input>
          </el-form-item>


          <div v-for="(teacher,index) in dynamicForm.teachers"
               style="margin: 0 auto;width: 100%;">

            <el-form-item label="上课教师"
                          :prop="'teachers.' +index+'.teacherId'"
                          :rules="{
                                                required: true, message: '请选择教师', trigger: 'change'
                                        }">

              <el-select style="width: 80%" clearable v-model="teacher.teacherId" filterable
                         placeholder="请选择教师">
                <el-option
                    v-for="item in teachers"
                    :key="item.id"
                    :label="item.tag"
                    :value="item.id">
                </el-option>
              </el-select>

              <el-button @click="remove(teacher)" :loading="loadingRemoveConfigTeacherBtn" type="danger"
                         style="margin-right: 0;width: 20%">移除
              </el-button>
            </el-form-item>

          </div>
        </el-form>
      </div>


      <div slot="footer">
        <el-button type="success" @click="add">增加授课教师</el-button>
        <el-button @click="closeCreateConfigDialog()">取 消</el-button>
        <el-button @click="updateConfig()" type="primary" :loading="loadingUpdateConfigBtu">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 一键配置弹框 -->
    <el-dialog
        width="700px"
        title="一键配置"
        :visible.sync="visibleOneKey"
        :before-close="closeOneLak"
        :append-to-body="true"
        :close-on-click-modal="false">


      <el-steps :active="active" finish-status="success">
        <el-step title="选择选课"></el-step>
        <el-step title="通用设置"></el-step>
        <el-step title="独立设置"></el-step>
      </el-steps>

      <div style="margin-top: 30px">
        <div v-if="active === 0">
          <el-transfer
              :props="{
             key: 'id',
             label: 'name'
            }"
              style="text-align: left; display: inline-block"
              :titles="['课程库', '已选择']"
              filterable
              v-model="subjectIds"
              :data="subjects">
          </el-transfer>
        </div>
        <div v-if="active === 1">
          <el-form :model="oneKeyData" ref="oneKeyData" label-width="100px" style="margin: 0 auto;width: 90%">
            <el-form-item prop="teachAddress" label="教学地点">
              <el-input v-model="oneKeyData.address"></el-input>
            </el-form-item>
            <el-form-item prop="teachTime" label="教学时间">
              <el-input v-model="oneKeyData.time"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active === 2">
          <el-form :model="ontKeyNextData" ref="oneKeyData" label-width="100px" style="margin: 0 auto;width: 90%">

            <el-form-item prop="teachAddress" label="学科">
              <el-input v-model="ontKeyNextData.subjectName" disabled></el-input>
            </el-form-item>

            <el-form-item prop="className" label="课堂名称" :rules="[
                                  { required: true, message: '请输入课堂名称', trigger: 'blur' },
                                ]">
              <el-input v-model="ontKeyNextData.className"></el-input>
            </el-form-item>

            <el-form-item prop="limit" label="限制人数" :rules="[
                                  { required: true, message: '请选择限制数量', trigger: 'blur' },
                                ]">
              <el-input v-model="ontKeyNextData.limit" type="number" min="1"></el-input>
            </el-form-item>


            <el-form-item label="上课教师"
                          prop="teacher">

              <el-select style="width: 100%"
                         collapse-tags
                         clearable
                         v-model="ontKeyNextData.teacher"
                         filterable
                         multiple
                         placeholder="请选择教师">
                <el-option
                    v-for="item in teachers"
                    :key="item.id"
                    :label="item.tag"
                    :value="item.account">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div slot="footer">
        <el-button @click="closeOneLak()">取 消</el-button>
        <el-button @click="next" v-show="active !== 2">下一步</el-button>
        <el-button @click="nextSet" v-show="active === 2 && lastIndex !== subjectIds.length">下一个</el-button>
        <el-button @click="submitOneKey" :loading="loadingOneKey" type="primary"
                   v-show="active === 2 && lastIndex === subjectIds.length">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {SubjectModel} from "@/views/admin/subject/model";
import {
  ConfigurationSubjectModel,
  ConfigurationTeacherModel,
  EventModel,
  TeacherModel
} from "@/views/admin/event/model";
import {
  configCreateBatch,
  configCreateConfig,
  configListConfig,
  configRemoveConfig,
  configRemoveConfigTeacher,
  configUpdateConfig,
  schoolYearListSchoolYear,
  subjectListSimpleSubject,
  userListSimpleTeacher
} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {SchoolYear} from "@/views/admin/user/model";

@Component
export default class Configuration extends Vue {
  event: EventModel = {};
  subjects: SubjectModel[] = [];
  teachers: TeacherModel[] = [];
  loadingPage = false;
  confTable: ConfigurationSubjectModel[] = [];
  nowIsUpdate = false;
  visibleCreateConfigDialog = false;
  loadingUpdateConfigBtu = false;
  loadingRemoveConfigTeacherBtn = false;
  dynamicForm: ConfigurationSubjectModel = {teachers: [{}]};
  schoolYear: SchoolYear[] = [];
  visibleOneKey = false;
  loadingOneKey = false
  oneKeySoData = []
  active = 0
  subjectIds = []
  oneKeyData = {
    eventId: '',
    address: '',
    time: '',
    subject: []
  }
  ontKeyNextData = {id: '', subjectName: '', className: '', limit: '', teacher: []}
  lastIndex = 0;

  submitOneKey() {
    // @ts-ignore
    this.$refs['oneKeyData'].validate((valid: any) => {
      if (valid) {
        this.oneKeyData.subject.push({
          // @ts-ignore
          id: this.ontKeyNextData.id,
          // @ts-ignore
          subjectName: this.ontKeyNextData.subjectName,
          // @ts-ignore
          className: this.ontKeyNextData.className,
          // @ts-ignore
          limit: this.ontKeyNextData.limit,
          // @ts-ignore
          teacher: this.ontKeyNextData.teacher
        });
        // @ts-ignore
        this.oneKeyData.eventId = this.event.id
        this.loadingOneKey = true;

        configCreateBatch(this.oneKeyData).then((res: ResultData) => {
          this.loadingOneKey = false;
          if (ResultUtil.success(res)) {
            this.closeOneLak();
            this.all();
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success',
            });
          } else {
            this.$notify({
              title: '批量新增失败',
              message: res.msg,
              type: 'warning',
            });
          }
        }, () => {
          this.loadingOneKey = false;
          this.$notify({
            title: '批量新增网络错误',
            message: '网络错误',
            type: 'error',
          });
        });
        this.loadingUpdateConfigBtu = false;
        this.closeOneLak();
      }
    })
  }

  nextSet() {
    // 数据校验
    // @ts-ignore
    this.$refs['oneKeyData'].validate((valid: any) => {
      if (valid) {
        this.oneKeyData.subject.push({
          // @ts-ignore
          id: this.ontKeyNextData.id,
          // @ts-ignore
          subjectName: this.ontKeyNextData.subjectName,
          // @ts-ignore
          className: this.ontKeyNextData.className,
          // @ts-ignore
          limit: this.ontKeyNextData.limit,
          // @ts-ignore
          teacher: this.ontKeyNextData.teacher
        });
        // @ts-ignore
        let a = this.subjects[this.subjects.findIndex(a => a.id === this.subjectIds[this.lastIndex])];
        // @ts-ignore
        this.ontKeyNextData.id = a.id
        // @ts-ignore
        this.ontKeyNextData.subjectName = a.name
        this.ontKeyNextData.className = this.ontKeyNextData.subjectName
        this.ontKeyNextData.limit = ''
        this.ontKeyNextData.teacher = []
        this.lastIndex++;
        console.log(this.oneKeyData)
      }
    });
  }

  next() {
    if (this.active === 0) {
      if (VerifyUtil.isArraysBlank(this.subjectIds)) {
        this.$notify({
          title: '错误',
          message: '请选择学科',
          type: 'warning',
        });
        return
      }
    }
    if (this.active === 1) {
      // @ts-ignore
      let a = this.subjects[this.subjects.findIndex(a => a.id === this.subjectIds[this.lastIndex])];
      // @ts-ignore
      this.ontKeyNextData.id = a.id
      // @ts-ignore
      this.ontKeyNextData.subjectName = a.name
      // @ts-ignore
      this.ontKeyNextData.className = this.ontKeyNextData.subjectName
      this.lastIndex++;
      console.log(this.ontKeyNextData)
    }
    this.active++;
  }

  showOneKeyDialog() {
    this.listAllSimpleSubject()
    this.visibleOneKey = true;
  }

  closeOneLak() {
    this.loadingOneKey = false;
    this.visibleOneKey = false;
    this.oneKeySoData = []
    this.active = 0
    this.subjectIds = []
    this.oneKeyData = {
      eventId: '',
      address: '',
      time: '',
      subject: []
    }
    this.lastIndex = 0
    this.ontKeyNextData = {id: '', subjectName: '', className: '', limit: '', teacher: []}
  }

  created() {
    // @ts-ignore
    this.event = JSON.parse(decodeURIComponent(this.$route.query.data));
    this.all();
  }

  /**
   * 查询入学年
   */
  selectSchoolYear() {
    schoolYearListSchoolYear().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.schoolYear = res.data;
        this.schoolYear.forEach(a => {
          a.v = a.schoolYear
        });
        this.schoolYear.push({id: "0", schoolYear: "0", v: "通用"})
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
   * 真正的删除
   */
  realDeleteConfig(data: any) {
    configRemoveConfig({eventId: this.event.id, csId: data.id}).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.all();
        this.closeCreateConfigDialog();
        this.$notify({
          title: '删除学科配置成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '删除学科配置错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '删除学科配置网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 真正的创建
   */
  realCreateConfig(data: any) {
    configCreateConfig(data).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.all();
        this.dynamicForm = {teachers: [{}]};
        this.$notify({
          title: '创建学科配置成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '创建学科配置错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '创建学科配置网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 真正的更新
   */
  realUpdateConfig(data: ConfigurationSubjectModel) {
    let teacherList = this.dynamicForm.teachers;
    // @ts-ignore
    for (let i = 0; i < data.teachers.length; i++) {
      // @ts-ignore
      data.teachers[i].ctime = teacherList[teacherList.findIndex(a => a.id == data.teachers[i].id)].ctime
    }

    configUpdateConfig(data).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.all();
        this.closeCreateConfigDialog();
        this.$notify({
          title: '更新学科配置成功',
          message: res.msg,
          type: 'success',
        });
      } else {
        this.$notify({
          title: '更新学科配置错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '更新学科配置网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 更新
   */
  updateConfig() {
    // @ts-ignore
    this.$refs['dynamicForm'].validate((valid: any) => {
      if (valid) {
        let data: ConfigurationSubjectModel = {
          eventId: this.event.id,
          subjectId: this.dynamicForm.subjectId,
          num: this.dynamicForm.num,
          subjectName: this.subjects[this.subjects.findIndex(a => a.id == this.dynamicForm.subjectId)].name,
          className: VerifyUtil.isStringBlank(this.dynamicForm.className)?this.subjects[this.subjects.findIndex(a => a.id == this.dynamicForm.subjectId)].name:this.dynamicForm.className,
          teachAddress: this.dynamicForm.teachAddress,
          teachTime: this.dynamicForm.teachTime,
          teachers: []
        };
        let ts: [ConfigurationTeacherModel] = JSON.parse(JSON.stringify(this.dynamicForm.teachers));
        for (let i = 0; i < ts.length; i++) {
          let teacherModel = this.teachers[this.teachers.findIndex(a => a.id == ts[i].teacherId)];
          ts[i].teacherName = teacherModel.name;
          ts[i].teacherAccount = teacherModel.account;
          // @ts-ignore
          data.teachers.push(ts[i])
        }

        if (this.nowIsUpdate) {
          data.id = this.dynamicForm.id;
          this.realUpdateConfig(data);
        } else {
          this.realCreateConfig(data);
        }
      }
    });
  }

  /**
   * 显示修改弹框
   */
  showUpdateConfig(data: any) {
    this.nowIsUpdate = true;
    this.dynamicForm = data;
    this.visibleCreateConfigDialog = true;
    if (VerifyUtil.isArraysBlank(this.schoolYear)) {
      this.selectSchoolYear();
    }
  }

  /**
   * 查询当前选课下的学科配置
   */
  all() {
    configListConfig({eId: this.event.id}).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.confTable = res.data;
        this.listAllSimpleTeacher();
      } else {
        this.$notify({
          title: '查询学科配置错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '查询学科配置网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 增加学科配置弹框，移除项目
   */
  remove(data: any) {
    // @ts-ignore
    let index = this.dynamicForm.teachers.indexOf(data);
    this.loadingRemoveConfigTeacherBtn = true;
    if (index !== -1 && index > 0) {
      if (VerifyUtil.isStringBlank(data['id'])) {
        // @ts-ignore
        this.dynamicForm.teachers.splice(index, 1);
        this.loadingRemoveConfigTeacherBtn = false;
      } else {
        configRemoveConfigTeacher({id: data['id']}).then((res: ResultData) => {
          this.loadingRemoveConfigTeacherBtn = false;
          if (ResultUtil.success(res)) {
            // @ts-ignore
            this.dynamicForm.teachers.splice(index, 1);
            this.all();
            this.$notify({
              title: '移除教师配置成功',
              message: res.msg,
              type: 'success',
            });
          } else {
            this.$notify({
              title: '移除教师配置错误',
              message: res.msg,
              type: 'warning',
            });
          }
        }, () => {
          this.loadingRemoveConfigTeacherBtn = false;
          this.$notify({
            title: '移除教师配置网络错误',
            message: '网络错误',
            type: 'error',
          });
        });
      }
    }
    this.loadingRemoveConfigTeacherBtn = false;
  }

  /**
   *  增加学科配置弹框，增加项目
   */
  add() {
    if (VerifyUtil.isArraysBlank(this.dynamicForm.teachers)) {
      this.dynamicForm.teachers = [{}]
    } else {
      // @ts-ignore
      this.dynamicForm.teachers.push({});
    }
  }

  /**
   *显示 更新弹框
   */
  showCreateConfigDialog() {
    if (VerifyUtil.isArraysBlank(this.schoolYear)) {
      this.selectSchoolYear();
    }
    this.visibleCreateConfigDialog = true;
  }

  /**
   * 关闭 更新弹框
   */
  closeCreateConfigDialog() {
    this.visibleCreateConfigDialog = false;
    this.nowIsUpdate = false;
    this.loadingUpdateConfigBtu = false;
    this.dynamicForm = {teachers: [{}]};
  }

  /**
   * 查询所有教师列表
   */
  listAllSimpleTeacher() {
    userListSimpleTeacher().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.teachers = res.data;
        this.listAllSimpleSubject();
      } else {
        this.$notify({
          title: '查询教师错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '查询教师网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }

  /**
   * 查询所有学科列表
   */
  listAllSimpleSubject() {
    subjectListSimpleSubject().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.subjects = res.data;
      } else {
        this.$notify({
          title: '查询学科错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '查询学科网络错误',
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
