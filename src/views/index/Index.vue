<template>
  <div class="page-container" style="padding-top: 20px; ">
    <div v-show=" this.admin">
      <el-card v-if="this.eventModel.id !== undefined" style="cursor:pointer;">
        <div @click="jumpEvent">
          <p class="event-title">
            <span class="iconfont tl-horn"></span>
            正在进行的选课
          </p>
          <p class="event-content">
            『&nbsp;2020-10-33 测试选课&nbsp;』将于
            <span class="key-word ">2020-11-22 00:00:00</span>开始，
            每名同学可以选择 <span class="key-word ">3</span>门课程，选课将于
            <span class="key-word ">2020-11-22 00:00:00</span> 结束。
          </p>
        </div>

      </el-card>

      <el-card style="margin-top: 20px; ">
        <div slot="header" class="clearfix">
          <span>平台信息统计</span>
        </div>
        <div
            style="height:150px;display: flex;flex-wrap:wrap;align-items:center;justify-content: space-between;flex-wrap:nowrap">

          <div class="Box" @click="jumpUser">
            <h2 class="Key">账号数量</h2>
            <span class="Value">{{ data.account }}</span>
          </div>

          <div class="Box" @click="jumpUser">
            <h2 class="Key">学生</h2>
            <span class="Value">{{ data.student }}</span>
          </div>

          <div class="Box" @click="jumpUser">
            <h2 class="Key">教师</h2>
            <span class="Value">{{ data.teacher }}</span>
          </div>

          <div class="Box" @click="jumpEventList">
            <h2 class="Key">历史选课次数</h2>
            <span class="Value">{{ data.eventNum }}</span>
          </div>

          <div class="Box" @click="jumpSubject">
            <h2 class="Key">学科库</h2>
            <span class="Value">{{ data.subjectNum }}</span>
          </div>

          <div class="Box" @click="jumpTag">
            <h2 class="Key">标签组</h2>
            <span class="Value">{{ data.tagNum }}</span>
          </div>
        </div>
      </el-card>

      <el-card style="margin-top: 20px; ">
        <div slot="header" class="clearfix">
          <span>热门学科排行统计</span>
        </div>

        <div>
          <el-table
              size="mini"
              stripe
              style="margin-top: 50px"
              :cell-style="getCell"
              :header-cell-style="getTableHeaderClass"
              :data="data.hotSubject">

            <el-table-column
                prop="subjectName"
                label="课堂名称">
            </el-table-column>

            <el-table-column
                prop="num"
                label="累计选择次数">
            </el-table-column>
          </el-table>

        </div>
      </el-card>

    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {adminIndex, stuEventExistEvent} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {LOCAL_STORAGE_USER_TYPE_KEY, LocalStorageUtil} from "@/utils/local-storage-util";

@Component
export default class Index extends Vue {
  data: any = {}
  eventModel: any = {}
  admin = false;

  created() {
    this.admin = LocalStorageUtil.get(LOCAL_STORAGE_USER_TYPE_KEY) === 'a';

    if (this.admin) {
      stuEventExistEvent().then((res: ResultData) => {
        if (ResultUtil.success(res)) {
          this.eventModel = res.data;
        }
      }, e => {
        this.$notify({
          title: '查询选课网络错误',
          message: '网络错误',
          type: 'error',
        });
      });

      adminIndex().then((res: ResultData) => {
        if (ResultUtil.success(res)) {
          this.data = res.data;
        } else {
          this.$notify({
            title: '查询错误',
            message: res.msg,
            type: 'warning',
          });
        }
      }, e => {
        this.$notify({
          title: '查询网络错误',
          message: '网络错误',
          type: 'error',
        });
      });
    }
  }


  jumpEvent() {
    this.$router.push({name: `Details`, query: {data: encodeURIComponent(JSON.stringify(this.eventModel))}});
  }

  jumpUser() {
    this.$router.push({path: '/home/user'});
  }

  jumpEventList() {
    this.$router.push({name: 'EventTable'});
  }

  jumpSubject() {
    this.$router.push({path: '/home/subject'});
  }

  jumpTag() {
    this.$router.push({path: '/home/tag'});
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
.event-title {
  font-size: 13px;
  font-weight: 600;
}

.event-content {
  font-size: 12px;
}

.Box {
  width: 150px;
  height: 120px;
  background: #00bcd40a;
  border-radius: 8px;
  cursor: pointer;
}

.Key {
  display: block;
  height: 60px;
  line-height: 60px;
  color: #207ed9;
  text-align: center;
  margin: 0
}

.Value {
  display: block;
  height: 60px;
  line-height: 60px;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1px;;
  text-align: center
}
</style>
