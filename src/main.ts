import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import {LOCAL_STORAGE_USER_TOKEN_KEY, LOCAL_STORAGE_USER_TYPE_KEY, LocalStorageUtil} from "@/utils/local-storage-util";
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css';
import '@/styles/global.scss'
import {
    Alert,
    Badge,
    Button,
    Card,
    Collapse,
    CollapseItem,
    DatePicker,
    Dialog,
    Divider,
    Form,
    FormItem,
    Image,
    Input,
    Loading,
    Message,
    MessageBox,
    Notification,
    Option,
    PageHeader,
    Pagination, Popconfirm, Popover,
    Radio,
    RadioButton,
    RadioGroup,
    Select, Step, Steps, Switch,
    Table,
    TableColumn, TabPane, Tabs,
    Tag, Tooltip, Transfer,
    Upload
} from "element-ui";


Vue.config.productionTip = false;
Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox;
Vue.prototype.$message = Message;
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;

Vue.use(Alert);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Divider);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Upload);
Vue.use(DatePicker);
Vue.use(PageHeader);
Vue.use(Badge);
Vue.use(Image);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Popconfirm);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Switch);
Vue.use(Transfer);
Vue.use(Steps);
Vue.use(Step);
/**
 * 校验是否已经登录，如果登录则执行下一步，如果没有登录则跳转到登录页
 */
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        const token = LocalStorageUtil.get(LOCAL_STORAGE_USER_TOKEN_KEY);
        if (token === '' || token === undefined || token === null) {
            next('/auth');
        } else {
            next();
        }
    } else {
        next();
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

