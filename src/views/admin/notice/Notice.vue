<template>
    <div class="page-container">

        <!-- 头部 -->
        <h1 class="page-container-title">公告</h1>
        <div class="page-container-title-right">
            <el-button icon="el-icon-plus" type="warning" @click="showCreateNoticeDialog" circle
                       title="添加公告"></el-button>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 表单 -->
        <div>
            <el-table
                    v-loading='loadingPage'
                    :cell-style="getCell"
                    :header-cell-style="getTableHeaderClass"
                    :data="noticeTable">
                <el-table-column
                        prop="name"
                        label="标题">
                </el-table-column>
                <el-table-column
                        prop="introduction"
                        label="内容">
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
                    :current-page="pageParam.page"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="20"
                    layout="total, sizes, prev, pager, next"
                    :total="tableTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import {NoticeModel} from "@/views/admin/notice/model";

    @Component
    export default class Notice extends Vue {
        loadingPage = false;
        noticeTable: NoticeModel[] = [];
        tableTotal = 0;
        pageParam: any = {
            limit: 20,
            page: 1,
        };

        /**
         * 分页
         */
        page() {

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
         *显示创建公告的弹框
         */
        showCreateNoticeDialog() {

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
