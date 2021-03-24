import Vue from 'vue'
import VueRouter from 'vue-router'
import StuHistoryList from "@/views/student/history/StuHistoryList.vue";

Vue.use(VueRouter);

const AuthRoute = () => import("@/views/auth/Auth.vue");
const HomeRoute = () => import("@/views/Home.vue");
const EventRoute = () => import("@/views/admin/event/Event.vue");
const EventTableRoute = () => import("@/views/admin/event/children/EventTable.vue");
const ConfigurationRoute = () => import("@/views/admin/event/children/Configuration.vue");
const DetailsRoute = () => import("@/views/admin/event/children/Details.vue");
const UserRoute = () => import("@/views/admin/user/User.vue");
const TagRoute = () => import("@/views/admin/tag/Tag.vue");
const TagListRoute = () => import("@/views/admin/tag/children/TagList.vue");
const TagConfigRoute = () => import("@/views/admin/tag/children/TagConfig.vue");
const SubjectRoute = () => import("@/views/admin/subject/Subject.vue");
const NoticeRoute = () => import("@/views/admin/notice/Notice.vue");
const HelpRoute = () => import("@/views/admin/help/Help.vue");
const StuEventRoute = () => import("@/views/student/event/StuEvent.vue");
const StuFocusRoute = () => import("@/views/student/focus/StuFocus.vue");
const StuHistoryRoute = () => import("@/views/student/history/StuHistory.vue");
const StuHistoryListRoute = () => import("@/views/student/history/StuHistoryList.vue");
const IndexRoute = () => import("@/views/index/Index.vue");

const routes = [
    {
        path: '/auth',
        name: 'Auth',
        component: AuthRoute
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeRoute,
        meta: {requireAuth: true},
        children: [
            {
                path: '',
                name:'Index',
                component:IndexRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'event',
                name: 'Event',
                component: EventRoute,
                meta: {requireAuth: true},
                children: [
                    {
                        path: '',
                        name: 'EventTable',
                        component: EventTableRoute,
                        meta: {requireAuth: true},
                    },
                    {
                        path: 'configuration',
                        name: 'Configuration',
                        component: ConfigurationRoute,
                        meta: {requireAuth: true},
                    },
                    {
                        path: 'details',
                        name: 'Details',
                        component: DetailsRoute,
                        meta: {requireAuth: true},
                    },
                ]
            },
            {
                path: 'user',
                name: 'User',
                component: UserRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'tag',
                name: 'Tag',
                component: TagRoute,
                meta: {requireAuth: true},
                children: [
                    {
                        path: '',
                        name: 'TagList',
                        component: TagListRoute,
                        meta: {requireAuth: true},
                    },
                    {
                        path: 'tag-configuration',
                        name: 'TagConfiguration',
                        component: TagConfigRoute,
                        meta: {requireAuth: true},
                    },
                ]
            },
            {
                path: 'subject',
                name: 'Subject',
                component: SubjectRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'notice',
                name: 'Notice',
                component: NoticeRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'help',
                name: 'Help',
                component: HelpRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'stu-focus',
                name: 'StuFocus',
                component: StuFocusRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'stu-event',
                name: 'StuEvent',
                component: StuEventRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'stu-history',
                name: 'StuHistory',
                component: StuHistoryRoute,
                meta: {requireAuth: true},
            },
            {
                path: 'stu-history',
                name: 'StuHistoryList',
                component: StuHistoryListRoute,
                meta: {requireAuth: true}
            }
        ]
    },
    {
        path: '/**',
        name: 'RootAll',
        redirect: '/home',
        meta: {requireAuth: true},
    },
];

const router = new VueRouter({
    mode: 'hash',
    routes
});

export default router
