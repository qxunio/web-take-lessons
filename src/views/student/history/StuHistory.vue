<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">历史</h1>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <div>

      <el-card shadow="always" class="ClassCard" v-for="(item,index) in eventList">
        <div @click="jump(item)" style="width: 100%;height: 100%">
          <div class="EventIng" v-if="item.status === '1'">进行中</div>
          <div class="ClassCardLabIcon">{{ index + 1 }}</div>
          <div class="ClassCardLabTitle">{{ item.name }}</div>
          <div class="ClassCardInfo">
            限制人数: {{ item.num }}<br/>
            开始时间: {{ item.stime }}<br/>
            结束时间: {{ item.etime }}<br/>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {stuHistoryEvent} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";

@Component
export default class StuHistory extends Vue {
  eventList = [];

  created() {
    this.getEvent()
  }


  jump(data: any) {
    console.log(data)
    this.$router.push({name: `StuHistoryList`, query: {data: encodeURIComponent(JSON.stringify(data))}});
  }

  getEvent() {
    stuHistoryEvent().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.eventList = res.data
      } else {
        this.$notify({
          title: '查询选课错误',
          message: res.msg,
          type: 'warning',
        });
      }
    }, () => {
      this.$notify({
        title: '移除选课网络错误',
        message: '网络错误',
        type: 'error',
      });
    });
  }
}
</script>


<style lang="scss">
.ClassCard {
  width: 31.8% !important;
  height: 155px;
  margin-right: 2%;
  cursor: pointer;
  display: inline-block;
  position: relative;
  margin-bottom: 20px;
}

.ClassCard:nth-child(3n) {
  margin-right: 0
}

@media screen and (max-width: 1165px) {
  .ClassCard {
    width: 30% !important;
    margin-right: 4.5%;
  }
}

.ClassCardLabIcon {
  width: 50px;
  height: 50px;
  background: #207ed9;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
}

.ClassCardLabTitle {
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-left: 15px;
  letter-spacing: 1px;
}

.ClassCardInfo {
  margin-left: 70px;
  color: #9e9e9e;
  font-size: 12px;
  line-height: 25px;
}

.EventIng {
  color: #fff;
  height: 25px;
  width: 205px;
  position: absolute;
  right: -80px;
  text-align: center;
  line-height: 27px;
  font-family: "黑体", serif;
  background-color: #207ed9;
  -webkit-transform: rotate(45deg);
  transform: rotate(47deg);
}
</style>
