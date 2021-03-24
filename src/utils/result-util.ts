/**
 * 后台响应判断工具
 */
import {ResultData} from "@/utils/model/ResultData";

export class ResultUtil {

    /**
     * 判断后台是否成功
     *
     * @param response 响应
     * @return 成功返回true,失败返回false
     */
    public static success(response: ResultData): Boolean {
        return null !== response.status && "success" === response.status;
    }
}
