import axios, {AxiosRequestConfig} from 'axios';
import {VerifyUtil} from "@/utils/verify-util";
import {
    LOCAL_STORAGE_USER_LOGIN_TIME,
    LOCAL_STORAGE_USER_TOKEN_KEY,
    LocalStorageUtil
} from "@/utils/local-storage-util";
import router from "@/router/router";
import {reload} from "@/api/api";
import {ResultData} from "@/utils/model/ResultData";
import {ResultUtil} from "@/utils/result-util";

interface Item {
    url: string;
    cancel: () => void;
}

const CancelToken = axios.CancelToken;

const pending: Item[] = [];

const removePending = (config: AxiosRequestConfig) => {
    for (const p in pending) {
        if (pending.hasOwnProperty(p)) {
            const list = pending[p];
            if (list.url === config.url + '&request_type=' + config.method) {
                list.cancel();
                pending.splice(+p, 1);
            }
        }
    }
};

/**
 * 创建axios实例
 */
const service = axios.create({
    timeout: 200000, // 请求超时时间
});
let nowIsRefreshTime = false;
let test = false;
/**
 * 网络请求拦截器
 */
service.interceptors.request.use(
    (config) => {
        let time = new Date().getTime() - new Date(LocalStorageUtil.get(LOCAL_STORAGE_USER_LOGIN_TIME)).getTime();
        if (time >= 1200000 && time <= 1800000 && !VerifyUtil.isStringBlank(LocalStorageUtil.get(LOCAL_STORAGE_USER_TOKEN_KEY))) {
            test = true;
            if (test && (!nowIsRefreshTime)) {
                nowIsRefreshTime = true;
                reload().then((res: ResultData) => {
                    if (ResultUtil.success(res)) {
                        LocalStorageUtil.set(LOCAL_STORAGE_USER_TOKEN_KEY, res.data.token);
                        LocalStorageUtil.set(LOCAL_STORAGE_USER_LOGIN_TIME, res.data.loginTime);
                    } else {
                        console.log(res.msg);
                    }
                    nowIsRefreshTime = false;
                }, (e => {
                    nowIsRefreshTime = false;
                    console.log(e);
                }));
            }
        }
        removePending(config);
        let token = LocalStorageUtil.getUserToken();
        if (VerifyUtil.isStringBlank(token)) {
            return config;
        }
        // 添加HTTP TOKEN头
        config.headers.Authorization = token;
        config.cancelToken = new CancelToken((c) => {
            pending.push({
                url: config.url + '&request_type=' + config.method,
                cancel: c,
            });
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

/**
 * 网络响应拦截器
 */
service.interceptors.response.use(
    (res) => {
        removePending(res.config);
        // 如果登录过期，则移除本地token缓存，跳转登录页面
        if (res.data.code === '555') {
            LocalStorageUtil.removeLoginUser();
            router.push({name: 'Auth'}).then(r => console.log(r));
            return null;
        }
        return res.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default service;
