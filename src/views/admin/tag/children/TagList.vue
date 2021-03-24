<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">标签</h1>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <el-tag
        :key="tag.id"
        v-for="tag in tags"
        closable
        el-icon-iconName="el-icon-delete"
        size="medium"
        style="margin-right: 5px;cursor:pointer;"
        @click="jump(tag)"
        @close="handleClose(tag)">
      {{ tag.name }}
    </el-tag>
    <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" :loading="loadingCreateBtn" @click="showInput">+ 新增
    </el-button>


  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {tagCreateTag, tagListTag, tagRemoveTag} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";
import {VerifyUtil} from "@/utils/verify-util";
import {Tag} from "@/views/admin/tag/model";

@Component
export default class TagList extends Vue {
  tags: Tag[] = []
  inputValue = '';
  inputVisible = false;
  loadingCreateBtn = false;

  created() {
    this.list();
  }

  /**
   * 查询所有
   */
  list() {
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
   * 新增
   */
  handleInputConfirm() {
    this.loadingCreateBtn = true;
    let inputValue = this.inputValue;
    if (!VerifyUtil.isStringBlank(inputValue)) {
      tagCreateTag({tag: inputValue}).then((res: ResultData) => {
        this.inputVisible = false;
        this.inputValue = '';
        this.loadingCreateBtn = false;
        if (ResultUtil.success(res)) {
          this.tags.push(res.data);
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
        this.loadingCreateBtn = false;
        this.inputVisible = false;
        this.inputValue = '';
        this.$notify({
          title: '新增入学年错误',
          message: '网络错误',
          type: 'error',
        });
      });

    } else {
      this.loadingCreateBtn = false;
      this.inputVisible = false;
      this.inputValue = '';
    }
  }

  /**
   * 删除
   */
  handleClose(tag: any) {
    if (!VerifyUtil.isStringBlank(tag.id)) {
      tagRemoveTag({tag: tag.id}).then((res: ResultData) => {
        if (ResultUtil.success(res)) {
          //@ts-ignore
          let index = this.tags.findIndex(a => a.id === tag.id)
          this.tags.splice(index, 1);

          this.$notify({
            title: '删除成功',
            message: '成功',
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
          title: '新增入学年错误',
          message: '网络错误',
          type: 'error',
        });
      });
    }
  }

  /**
   * 显示
   */
  showInput() {
    this.inputVisible = true;
    //@ts-ignore
    this.$nextTick(_ => {
      //@ts-ignore
      this.$refs.saveTagInput.$refs.input.focus();
    });
  }

  jump(data: any) {
    this.$router.push({
      name: `TagConfiguration`,
      query: {data: encodeURIComponent(JSON.stringify({id: data.id, name: data.name}))}
    });
  }
}
</script>


<style lang="scss">
.input-new-tag {
  height: 28px;
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
