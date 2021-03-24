/**
 * 本地缓存的用户token key
 */
export const LOCAL_STORAGE_USER_TOKEN_KEY: string = 'qxun_user_token';

/**
 * 本地缓存的用户姓名 key
 */
export const LOCAL_STORAGE_USER_NAME_KEY: string = 'qxun_user_name';

/**
 * 本地缓存的用户类型 key
 */
export const LOCAL_STORAGE_USER_TYPE_KEY: string = 'qxun_user_type';

/**
 * 本地缓存的菜单 key
 */
export const LOCAL_STORAGE_USER_MENU_KEY: string = 'qxun_menu';

/**
 * 本地缓存的登录时间 key
 */
export const LOCAL_STORAGE_USER_LOGIN_TIME: string = 'qxun_login_time';

/**
 * 本地缓存的用户类型 key
 */
export const LOCAL_STORAGE_EFFECTIVE_EVENT_KEY: string = 'qxun_effective_event';


/**
 * 本地缓存 是否显示提示
 */
export const LOCAL_STORAGE_SHOW_TIP_KEY: string = 'qxun_show_tip';

/**
 * 本地缓存工具类
 */
export class LocalStorageUtil {

    /**
     * 设置 [k:v]
     * @param k key
     * @param v value
     */
    static set(k: string, v: any) {
        localStorage.setItem(k, v);
    }

    /**
     * 移除 [k:v]
     * @param k key
     */
    static remove(k: string) {
        localStorage.removeItem(k);
    }

    /**
     * 获取 v
     * @param k key
     */
    static get(k: string): any {
        return localStorage.getItem(k);
    }

    /**
     * 获取用户TOKEN
     */
    static getUserToken(): string {
        return this.get(LOCAL_STORAGE_USER_TOKEN_KEY);
    }

    /**
     * 获取用户菜单
     */
    static getMenus(): any {
        return this.get(LOCAL_STORAGE_USER_MENU_KEY);
    }

    /**
     * 获取用户姓名
     */
    static getUserName(): string {
        return this.get(LOCAL_STORAGE_USER_NAME_KEY);
    }


    /**
     * 移除用户缓存
     */
    static removeLoginUser(): void {
        this.remove(LOCAL_STORAGE_USER_TOKEN_KEY);
        this.remove(LOCAL_STORAGE_USER_NAME_KEY);
        this.remove(LOCAL_STORAGE_USER_MENU_KEY);
        this.remove(LOCAL_STORAGE_USER_TYPE_KEY);
        this.remove(LOCAL_STORAGE_USER_LOGIN_TIME);
    }
}

