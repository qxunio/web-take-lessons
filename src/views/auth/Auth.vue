<template>
  <div class="page">
    <div class="bg">
      <span class="copy-right">2020.qxunio</span>
    </div>

    <div class="form-wrapper">
      <div class="login">
        <h1 class="log-title">Take Lessons</h1>

        <img src="../../../public/qxun.jpg" alt="" width="120" height="85"/>
        <span class="split-line"></span>

        <span class="error-tip">{{ loginTip }}</span>

        <div class="form">
          <label class="label">
            <input @keyup.enter="toLogin" v-model="loginUser.account" type="text" placeholder="请输入账号"/>
          </label>
          <label class="label">
            <input @keyup.enter="toLogin" v-model="loginUser.password" type="password" placeholder="请输入密码"/>
          </label>
          <label>
            <el-button icon="el-icon-s-promotion" class="login-btn" type="primary" @click="toLogin">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              登录
            </el-button>
          </label>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {VerifyUtil} from "@/utils/verify-util";
import {app, login} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {LoginUserData, RsaData} from "@/views/auth/model";
import {
  LOCAL_STORAGE_USER_LOGIN_TIME,
  LOCAL_STORAGE_USER_NAME_KEY,
  LOCAL_STORAGE_USER_TOKEN_KEY,
  LOCAL_STORAGE_USER_TYPE_KEY,
  LocalStorageUtil
} from "@/utils/local-storage-util";
import {ResultUtil} from "@/utils/result-util";
import {ScryptUtil} from '@/utils/scrypt-util';

@Component
export default class Auth extends Vue {
  loginUser: LoginUserData = {};
  loginTip: string = '';
  rsa: RsaData = {};

  created() {
    this.iApp();
  }

  iApp() {
    app().then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        this.rsa = res.data;
      } else {
        this.loginTip = res.msg;
      }
    });
  }

  toLogin() {
    if (VerifyUtil.isStringBlank(this.loginUser.account)) {
      this.loginTip = '请输入账号';
      return
    }
    if (VerifyUtil.isStringBlank(this.loginUser.password)) {
      this.loginTip = '请输入密码';
      return
    }
    this.get();
  }

  get() {
    let publicKey = this.rsa.pk;
    if (VerifyUtil.isStringBlank(publicKey)) {
      this.loginTip = '页面已过期，请重新刷新'
    } else {
      let key = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
      this.login(key);
    }
  }

  login(key: any) {
    login({
      a1: ScryptUtil.RSAEncrypt(this.loginUser.account, key),
      a2: ScryptUtil.RSAEncrypt(this.loginUser.password, key),
      a3: this.rsa.uid
    }).then((res: ResultData) => {
      if (ResultUtil.success(res)) {
        LocalStorageUtil.set(LOCAL_STORAGE_USER_TOKEN_KEY, res.data.token);
        LocalStorageUtil.set(LOCAL_STORAGE_USER_NAME_KEY, res.data.username);
        LocalStorageUtil.set(LOCAL_STORAGE_USER_TYPE_KEY, res.data.type);
        LocalStorageUtil.set(LOCAL_STORAGE_USER_LOGIN_TIME, res.data.loginTime);
        let obj = this
        setTimeout(function () {
          obj.$router.push({path: 'home'});
        }, 1000);
      } else {
        this.loginTip = res.msg;
      }
    }, (e => {
      console.log(e);
      this.loginTip = '网络错误！'
    }));
  }
}
</script>


<style lang="scss">
.page {
  display: flex;
  flex: 1;
  height: 100vh;
}

.bg {
  background: url("../../assets/big/login_1.jpg") no-repeat center center/cover;
  position: relative;
  flex: 3;
}

@media (max-width: 768px) {
  .bg {
    display: none;
  }
}

.bg .copy-right {
  position: absolute;
  left: 5%;
  bottom: 2%;
  color: #f3f4f8;
}

.form-wrapper {
  flex: 1;
  margin: 3.75rem;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  justify-content: center;
}

.log-title {
  margin-bottom: 0.8rem;
  color: #1673c1
}

.login {
  padding: 20px;
  text-align: center;
}

.split-line {
  margin-bottom: 10px;
  display: block;
  background: #1673c1;
  border: 1px solid #1673c1;
}

.form {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
}


.form > label {
  margin-top: 20px;
}

input {
  letter-spacing: 1px;
  outline-style: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px 14px;
  font-size: 12px;
  width: 100%;
}

.error-tip {
  font-size: 12px;
  color: red;
  display: inline-block;
  height: 15px;
  box-sizing: border-box;
  background: yellow;
  font-weight: 900
}

.login-btn {
  width: 100%;
  height: 35px
}

.label {
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>
