/**
 * 正则验证
 */
export class VerifyUtil {
    /**
     * 判断字符串是否是null/undefined/空格
     *
     * @param str 字符串
     * @return boolean
     */
    public static isStringBlank(str: string | undefined | null): boolean {
        return str === undefined || str === null || str.toString().trim() === '';
    }


    /**
     * 判断数据是否为空
     *
     * @param arr 数组
     */
    public static isArraysBlank(arr: any[] | undefined | null): boolean {
        return arr === undefined || arr === null || arr.length === 0;
    }


    /**
     * 验证是否是有效手机号
     *
     * @param phone 手机号字符串
     */
    public static isPone(phone: string): boolean {
        const reg = /^1([3456789])\d{9}$/;
        return reg.test(phone);
    }

    /**
     * 验证身份证
     * https://www.cnblogs.com/pelli/p/6112996.html
     *
     * @param idCard 身份证
     */
    public static isIdCard(idCard: string): boolean {
        const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        const code = idCard + '';
        const last = idCard[17];
        const seventeen = code.substring(0, 17);
        const arr: any = seventeen.split('');
        const len = arr.length;
        let num = 0;
        for (let i = 0; i < len; i++) {
            num = num + arr[i] * weightFactor[i];
        }
        const resisue = num % 11;
        const lastNo = checkCode[resisue];
        const patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        const format = patter.test(idCard);
        return last === lastNo && format;
    }

    /**
     * 验证邮箱
     *
     * @param email 邮箱
     */
    public static isMail(email: string): boolean {
        const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        return reg.test(email);
    }

    /**
     * 时间比较，如：22:10:50 和 21:00:00 比较
     * @param t1 时间1
     * @param t2 时间1
     * @return t1时间大于t2返回1，t1时间小于t2返回-1，t1等于t2返回0
     */
    public static timeComparison(t1: string, t2: string): number {
        const a = t1.split(':');
        const b = t2.split(':');
        const aHour = parseInt(a[0]);
        const bHour = parseInt(b[0]);
        const aMin = parseInt(a[1]);
        const bMin = parseInt(b[1]);

        if (aHour > bHour) {
            return 1;
        }
        if (aHour < bHour) {
            return -1;
        }

        if (aMin > bMin) {
            return 1;
        }
        if (aMin < bMin) {
            return -1;
        }

        if (undefined !== a[2] && undefined !== b[2]) {
            const aSen = a[2];
            const bSen = b[2];
            if (aSen > bSen) {
                return 1;
            }
            if (aSen < bSen) {
                return -1;
            }
        }
        return 0;
    }
}
