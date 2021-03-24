import http from '../config/http-config';
import {UserModel} from "@/views/admin/user/model";
import {SubjectModel} from "@/views/admin/subject/model";
import {ConfigurationSubjectModel, EventModel} from "@/views/admin/event/model";

// export const BASE_URL = 'http://tl.qxun.io/v1';
// export const BASE_URL = 'http://localhost:9000';
export const BASE_URL = 'http://tk.qxun.io/tl';

export const app = () => http({method: 'post', url: `${BASE_URL}/app`});

/**
 * 登录
 * @param data 用户数据
 */
export const login = (data: any) => http({method: 'post', url: `${BASE_URL}/auth/login`, data: (data)});

/**
 * 重载
 */
export const reload = () => http({method: 'post', url: `${BASE_URL}/auth/reload`});

/**
 * 登出
 */
export const logout = () => http({method: 'post', url: `${BASE_URL}/auth/logout`});

/**
 * 获取菜单
 */
export const menu = () => http({method: 'post', url: `${BASE_URL}/menu/router`});

/**
 * 分页用户
 */
export const userPage = (data: any) => http({
    method: 'post', url: `${BASE_URL}/user/page`, data: (data)
});

/**
 * 创建用户
 */
export const userCreateUser = (data: UserModel) => http({
    method: 'post', url: `${BASE_URL}/user/create`, data: (data)
});

/**
 * 修改用户
 */
export const userUpdateUser = (data: UserModel) => http({
    method: 'post', url: `${BASE_URL}/user/update`, data: (data)
});

/**
 * 删除用户
 */
export const userDeleteUser = (data: any) => http({
    method: 'post', url: `${BASE_URL}/user/remove`, params: (data)
});

/**
 * 导出用户
 */
export const userExportUser = () => http({
    method: 'post', url: `${BASE_URL}/user/export`, responseType: 'blob'
});

/**
 * 重置用户密码
 */
export const userResetUser = (data: any) => http({
    method: 'post', url: `${BASE_URL}/user/reset`, params: (data)
});

/**
 * 创建学科
 */
export const subjectCreateSubject = (data: SubjectModel) => http({
    method: 'post', url: `${BASE_URL}/subject/create`, data: (data)
});

/**
 * 分页学科
 */
export const subjectPage = (data: any) => http({
    method: 'post', url: `${BASE_URL}/subject/page`, data: (data)
});

/**
 * 修改学科
 */
export const subjectUpdateSubject = (data: SubjectModel) => http({
    method: 'post', url: `${BASE_URL}/subject/update`, data: (data)
});

/**
 * 删除学科
 */
export const subjectDeleteSubject = (data: any) => http({
    method: 'post', url: `${BASE_URL}/subject/remove`, params: (data)
});

/**
 * 导出学科
 */
export const subjectExportSubject = () => http({
    method: 'post', url: `${BASE_URL}/subject/export`, responseType: 'blob'
});

/**
 * 创建选课
 */
export const eventCreateEvent = (data: EventModel) => http({
    method: 'post', url: `${BASE_URL}/event/create`, data: (data)
});

/**
 * 分页选课
 */
export const eventPage = (data: any) => http({
    method: 'post', url: `${BASE_URL}/event/page`, data: (data)
});

/**
 * 修改选课
 */
export const eventUpdateEvent = (data: EventModel) => http({
    method: 'post', url: `${BASE_URL}/event/update`, data: (data)
});

/**
 * 删除选课
 */
export const eventRemoveEvent = (data: any) => http({
    method: 'post', url: `${BASE_URL}/event/remove`, params: (data)
});

/**
 * 修改选课状态
 */
export const eventChangeEvent = (data: any) => http({
    method: 'post', url: `${BASE_URL}/event/change`, params: (data)
});

/**
 * 获取学科
 */
export const subjectListSimpleSubject = () => http({method: 'post', url: `${BASE_URL}/subject/list/simple/subject`});

/**
 * 获取教师
 */
export const userListSimpleTeacher = () => http({method: 'post', url: `${BASE_URL}/user/list/simple/teacher`});

/**
 * 创建选课配置
 */
export const configCreateConfig = (data: ConfigurationSubjectModel) => http({
    method: 'post', url: `${BASE_URL}/configuration/create`, data: (data)
});

/**
 * 获取单次选课下的课程配置
 */
export const configListConfig = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/configuration/list`,
    params: (data)
});


/**
 * 修改 学科配置
 */
export const configUpdateConfig = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/configuration/update`,
    data: (data)
});

/**
 * 删除 学科配置
 */
export const configRemoveConfig = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/configuration/remove`,
    data: (data),
});

/**
 * 删除 学科下的教师配置
 */
export const configRemoveConfigTeacher = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/configuration/remove/teacher`,
    params: (data),
});

/**
 * 查询入学年
 */
export const schoolYearListSchoolYear = () => http({
    method: 'post',
    url: `${BASE_URL}/sy/list`,
});

/**
 * 创建入学年
 */
export const schoolYearCreateSchoolYear = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/sy/create`,
    params: (data),
});

/**
 * 移除入学年
 */
export const schoolYearRemoveSchoolYear = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/sy/remove`,
    params: (data),
});

/**
 * 查询有效选课
 */
export const stuEventExistEvent = () => http({
    method: 'post',
    url: `${BASE_URL}/event/exist/event`,
});

/**
 * 查询有效选课
 */
export const stuEventListConfigSubject = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/configuration/list/stu`,
    params: (data),
});

/**
 * 学生创建关注选课
 */
export const stuFocusCreateConfigSubject = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/focus/create`,
    data: (data),
});

/**
 * 学生移除关注选课
 */
export const stuFocusRemoveConfigSubject = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/focus/remove`,
    data: (data),
});

/**
 * 学生查询自己的关注选课
 */
export const stuFocusListConfigSubject = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/focus/list`,
    params: (data),
});


/**
 * 导出导入用户模板
 */
export const userDownExportUserTemplate = () => http({
    method: 'post', url: `${BASE_URL}/user/export/template`, responseType: 'blob'
});


/**
 * 创建标签
 */
export const tagCreateTag = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/tag/create`,
    params: (data),
});

/**
 * 查询标签
 */
export const tagListTag = () => http({
    method: 'post',
    url: `${BASE_URL}/tag/list`,
});


/**
 * 删除标签
 */
export const tagRemoveTag = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/tag/remove`,
    params: (data),
});


/**
 * 根据班级创建 PostCreateStuByClass
 */
export const tagStuCreateByClass = (data: any) => http({
    method: 'post',
    url: `${BASE_URL}/tag/create/stu/by/class`,
    data: (data),
});

/**
 * 分页
 */
export const tagStuPage = (data: any) => http({
    method: 'post', url: `${BASE_URL}/tag/page`, data: (data)
});


/**
 * 移除 PostCreateTagStuList
 */
export const tagStuRemove = (data: any) => http({
    method: 'post', url: `${BASE_URL}/tag/remove/tag/stu`, data: (data)
});

/**
 * 批量创建
 */
export const tagStuCreateList = (data: any) => http({
    method: 'post', url: `${BASE_URL}/tag/create/tag/stu/list`, data: (data)
});

/**
 * 导出导入用户模板
 */
export const tagStuDownExportTemplate = () => http({
    method: 'post', url: `${BASE_URL}/tag/export/template`, responseType: 'blob'
});

/**
 * 重新激活选课
 */
export const eventReactivationEvent = (data: any) => http({
    method: 'post', url: `${BASE_URL}/event/reactivation`, data: (data)
});

/**
 * 修改是否可以修改选课
 */
export const eventUpdateCanUpdate = (data: any) => http({
    method: 'post', url: `${BASE_URL}/event/update/can/update`, data: (data)
});

/**
 * 批量创建
 */
export const configCreateBatch = (data: any) => http({
    method: 'post', url: `${BASE_URL}/configuration/create/batch`, data: (data)
});

/**
 * 批量创建
 */
export const stuLock = (data: any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/lock`, data: (data)
});

/**
 * 学生历史查询选课事件
 */
export const stuHistoryEvent = () => http({method: 'post', url: `${BASE_URL}/event/stu/history/event`});

/**
 * 学生历史查询选课事件
 */
export const stuHistoryCs = (data: any) => http({
    method: 'post', url: `${BASE_URL}/configuration/stu/history/stu/selected`, data: (data)
});

/**
 * 管理员查询首页统计
 */
export const adminIndex = () => http({method: 'post', url: `${BASE_URL}/app/admin/index`})

/**
 * 学生历史删除选课
 */
export const stuHistoryDelCs = (data: any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/delete`, data: (data)
});

/**
 * 查询选课详情列表
 */
export const configDetailsList = (data: any) => http({
    method: 'post', url: `${BASE_URL}/configuration/cs/details`, data: (data)
});

/**
 * 查询选课详情列表
 */
export const configDetailsStuList = (data: any) => http({
    method: 'post', url: `${BASE_URL}/configuration/page/cs/details/stu`, data: (data)
});

/**
 * 管理员追加学生到课堂 搜索学生
 */
export const configDetailsAppendStuSearch = (data: any) => http({
    method: 'post', url: `${BASE_URL}/configuration/append/stu/search`, data: (data)
});


/**
 * 管理员追加学生到课堂
 */
export const configDetailsAppendStu = (data: any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/append/stu`, data: (data)
});


/**
 * 管理员替换学生到课堂
 */
export const configDetailsReplaceStu = (data: any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/replace/stu`, data: (data)
});

/**
 * 管理员删除学生到课堂
 */
export const configDetailsDeleteStu = (data: any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/delete/stu`, data: (data)
});

/**
 * 导出用户
 */
export const configExportStuChooseSubject = (data:any) => http({
    method: 'post', url: `${BASE_URL}/choose-subject/export`, responseType: 'blob',data: (data)
});