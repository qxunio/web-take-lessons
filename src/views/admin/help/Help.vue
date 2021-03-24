<template>
  <div class="page-container">
    <!-- 头部 -->
    <h1 class="page-container-title">帮助中心</h1>

    <!-- 分割线 -->
    <el-divider></el-divider>


    <el-alert
        title="选课系统为学校提供了基于网络，学生可以远程在线选课的系统。在本页面将会对系统做出介绍及具体的操作，通过阅读本页面的内容，相信您将会快速的掌握该系统的操作。"
        type="info"
        :closable="false"
        show-icon
        effect="dark"
    >
    </el-alert>


    <el-card style="margin-top: 20px; ">

      <div slot="header" class="clearfix">
        <span>管理员端模块介绍</span>
      </div>

      <el-collapse v-model="activeNames">

        <el-collapse-item title="『用户』 模块" name="1">

          <div style="padding: 10px">

            <p>用户分为两大类型:</p>
            <li>教师</li>
            <li>学生</li>

            <p>教师，学生的账号由管理员进行导入生成。注意，本系统只支持后缀为 <span class="key-word">xlsx</span>的表格导入。其中包含三项信息： </p>
            <li>姓名 <span class="key-word">必填</span></li>
            <li>账号 <span class="key-word">必填</span></li>
            <li>班级（导入教师忽略该项，导入学生<span class="key-word">必填</span>，只能是数字格式)</li>

            <p>导入教师，可以直接导入电子表格，并无其它前置限制条件。</p>
            <p>导入学生，在导入学生之前，您需要 <span class="key-word">设置入学年</span>，并在电子表格中填写学生的班级编号（数字格式），且每一次导入只能导入同一个年级的学生。</p>
            <p>导入后的用户默认密码是：<span class="key-word">tl123456</span>。</p>
            <p>注意，导入后的账号不可以进行修改。</p>

            <p>提供功能列表：</p>
            <li>入学年设置</li>
            <li>添加单个用户（添加学生前，请先设置入学年）</li>
            <li>批量导入用户</li>
            <li>导出平台的所有用户</li>
            <li>编辑单个用户信息</li>
            <li>删除单个用户信息</li>
            <li>重置单个用户的密码为tl123456</li>
          </div>


        </el-collapse-item>

        <el-collapse-item title="『标签』 模块" name="2">
          <div style="padding: 10px">
            <p>标签，在设置选课时灵活的限制参与的学生，选课的时候可以设置某一个标签下的学生才能参与选课，在之后的『选课』 模块会详细介绍。</p>
            <p>标签可以理解为小组、分组，在标签下面可以加入不同年级，不同班级的学生从而组成一个标签，一个分组。</p>
            <p>标签名字可以任意设置，只作为一个标识使用，点击标签后即可进入标签详情页面，在详情页面您可以加入，删除学生。</p>

            <p>添加学生的方式有两种：</p>
            <li>系统内选择</li>
            <li>批量导入</li>


            <p>系统内选择分为两种方式</p>
            <li>按照班级添加，添加同一个班级下面的学生到当前标签</li>
            <li>自由选择，查询学生后，选择多个学生添加到当前标签</li>


            <p>批量导入电子表格，您需要在电子表格中提供两项信息，注意，本系统只支持后缀为 <span class="key-word">xlsx</span>的表格导入。</p>
            <li>姓名 <span class="key-word">系统内的学生姓名</span> </li>
            <li>账号 <span class="key-word">系统内的学生账号</span> </li>

            <p>提供功能列表：</p>
            <li>新增标签</li>
            <li>删除标签</li>
            <li>添加学生到标签</li>
            <li>批量导入学生到标签</li>
          </div>
        </el-collapse-item>

        <el-collapse-item title="『学科』 模块" name="3">
          <div style="padding: 10px">
            <p>学科，即学科库，在设置选课的时候需要设置参与选课的课程，课程数据就是从学科库里面获取。</p>

            <p>学科包含两种属性：</p>
            <li>学科名称</li>
            <li>学科介绍</li>

            <p>添加学科，您需要一个学科一个学科的添加。</p>

            <p>提供功能列表：</p>
            <li>新增学科</li>
            <li>编辑学科</li>
            <li>删除学科</li>
            <li>导出所有学科</li>
          </div>
        </el-collapse-item>

        <el-collapse-item title="『选课』 模块" name="4">
          <div style="padding: 10px">

            <p>选课模块，稍稍有些复杂，大致分为一下几个大的功能点：</p>
            <li>选课设置</li>
            <li>选课下面的课程设置</li>
            <li>选课详情</li>


            <p>选课设置，即发起一次选课。注意，系统中只能同时存在一次正在进行的选课。新增一次选课需要设置：</p>
            <li>选课主题，即该次选课的主题名称，最好有一个标识度，如：2020年秋季学期2019级选课</li>
            <li>参与年级，参与标签，这两个选项至少选择一项以上，选择的范围，既是参与该次选课的学生</li>
            <li>修改课堂，是否允许学生在选完课程后，突然反悔，可以删除已选的课程，再次选择其它课程，该项可以在选课期间自由的修改</li>
            <li>限制数量，每名学生在该次选课活动中最多可以选择多少门课程</li>
            <li>开始时间，选课的开始时间</li>
            <li>结束时间，选课的结束时间</li>

            <p>其它设置</p>
            <li>修改课堂，参见上面的修改课堂</li>
            <li>查询课堂，创建选课后，默认为学生不可查询，需要手动开启，学生才能查询该次选课</li>
            <li>重新激活选课，如果选课结束后，还想要延长选课时间可以选择该项重新激活，该设置只有在选课结束后才回出现</li>
            <li>编辑，编辑选课设置，选课开始前10分钟不能进行编辑</li>
            <li>删除，删除该次选课</li>
            <li>详情，详情里面可以看到，该次选课活动下面，各个学科的选择情况</li>
            <li>配置，即新增学科到该次选课活动中</li>

            <p>配置，添加学科到选课中，有两种方式：</p>
            <li>一键配置</li>
            <li>添加单个科目</li>


            <p>一键配置，可以一次选择多个课程，然后配置相同的教学地点和教学时间，授课教师和课程限制人数需要单独设置，但是对于需要添加大量学科还是比较方便的。</p>
            <p>注意，课堂名称和学科的区别，如 有【篮球】一门学科，但是开设了两个篮球班，篮球一班（课堂名称），篮球二班（课堂名称），但是它们都属于【篮球】这一同一学科这一特殊情况</p>
            <p>学科下面，可以选择多个授课教师，或者也可以不选择授课教师</p>


            <p>
              详情，详情页面包含了各个学科的选择统计情况，管理员可以移除某一课堂下的某一学生，可以在某一课堂下追加学生，
              <span class="key-word">追加学生不会受到学科限制人数的限制，即使课堂学生已经选满，管理员仍然能够成功的将学生追加到课堂下面</span>，或者可以替换学生选择的学科。还能导出该次选课活动的详情电子表格
            </p>

     </div>
        </el-collapse-item>

      </el-collapse>


    </el-card>


    <el-card style="margin-top: 20px; ">

      <div slot="header" class="clearfix">
        <span>学生端模块介绍</span>
      </div>

      <el-collapse v-model="activeNames">

        <el-collapse-item title="『选课』 模块" name="5">
          <div style="padding: 10px">

            <p>选课模块能够查询出针对学生自己当前存在的有效选课活动，即其课堂信息。学生可以在当前页面进行选课操作。</p>

            <p>
              由于一次选课下面可能有很多节课堂，不便于学生进行快速的选择，学生可以提前找到自己想要的课堂和备选的课堂加入我的关注，等到选课开始的时候，直接从
              『我的关注』 模块选择课堂。
            </p>

          </div>
        </el-collapse-item>

        <el-collapse-item title="『我的关注』 模块" name="6">
          <div style="padding: 10px">

            <p>我的关注，包含了学生在有效选课活动下面，提前筛选出的课堂，在选课开始后，可以快速的进行选择课堂。</p>

          </div>
        </el-collapse-item>

        <el-collapse-item title="『历史』 模块" name="7">
          <div style="padding: 10px">

            <p>历史模块包含了当前学生参加的所有选课活动，如果在选课设置时，设置了学生可以修改课堂，那么学生能够在当前模块下删除自己已经选择了的课程，然后返回重新选择自己的课程。</p>

          </div>
        </el-collapse-item>

      </el-collapse>


    </el-card>


    <el-card style="margin-top: 20px; ">

      <div slot="header" class="clearfix">
        <span>选课流程</span>
      </div>

      <el-collapse v-model="activeNames">

        <el-collapse-item title="一、基础数据准备" name="8">
          <div style="padding: 10px">

            <p>
              ①，学生数据准备，在『用户』 模块中先设置 <span class="key-word">入学年</span> ，以年级（入学年）为单位，统计好学生信息电子表格
              <span class="key-word">后缀为xlsx</span> ，在表格中填写学生姓名（必填），账号（必填），班级（必填）三项信息，依次导入系统中，一次导入只能导入一个电子表格，
              一个年级的学生数据，导入的用户默认密码是<span class="key-word">tl123456</span>，导入的电子表格模板在导入页面中可以下载。
            </p>

            <p>
              ②，教师数据准备，教师数据非必须数据，目前仅用来关联课堂下的授课教师，教师数据电子表格中班级列不必填写，保持空白即可。
            </p>

            <p>
              ③，学科数据准备，在『学科』 模块中，依次添加学科数据即可。
            </p>

            <p>
              ④，如果参加选课的学生由不同年级，不同班级的学生组成，那么请在『标签』 模块添加学生分组，为后面的选课设置做学生限制的准备。
            </p>

          </div>
        </el-collapse-item>

        <el-collapse-item title="二、选课设置" name="9">
          <div style="padding: 10px">

            <p>
              ①，发起选课活动，设置选课的基本条件和信息。
            </p>

            <p>
              ②，开启 学生可查询，如果不开启，学生会查询不到选课。
            </p>

            <p>
              ③，配置 选课活动下参与的学科课堂信息。
            </p>

          </div>
        </el-collapse-item>

        <el-collapse-item title="三、学生选课" name="10">
          <div style="padding: 10px">

            <p>
              ①，学生可以提前进入系统中，筛选出自己关注的课堂。
            </p>


            <p>
              ②，选课时间开始，学生开始选课。
            </p>


            <p>
              ③，如果选课设置，设置了学生能够修改课程，且学生需要重新选择，可以在历史中找到当前进行的选课活动，删除自己已经选择的课程，返回再次选课。
            </p>

          </div>
        </el-collapse-item>

        <el-collapse-item title="四、管理员统计" name="11">
          <div style="padding: 10px">

            <p>
              在『选课』 模块中，找到进行的选课，点击【详情】，即可查看当前选课的情况，及导出。
            </p>

          </div>
        </el-collapse-item>
      </el-collapse>


    </el-card>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";

@Component
export default class Help extends Vue {
  activeNames = '-1'
}
</script>


<style lang="scss">

</style>
