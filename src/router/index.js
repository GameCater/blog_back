import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '@/views/Home.vue';

// 路由配置 注意默认路由和重定向
const routes = [
  // 根路由
  {
    path: '/',
    redirect: 'home',
    meta: { isPublic: true }
  },
  // 主页路由
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'count',
        component: () => import('@/components/CountPanel.vue'),
      },

      {
        path: 'articles',
        redirect: { name: 'articles_list' }
      },
      {
        path: 'articles/create',
        name: 'articles_create',
        component: () => import('@/components/ArticlesEdit.vue'),
      },
      {
        path: 'articles/list',
        name: 'articles_list',
        component: () => import('@/components/ArticlesList.vue'),
      },
      {
        path: 'tags',
        redirect: { name: 'tags_list' },
      },
      {
        path: 'tags/create',
        name: 'tags_create',
        component: () => import('@/components/TagsEdit.vue'),
      },
      {
        path: 'tags/list',
        name: 'tags_list',
        component: () => import('@/components/TagsList.vue'),
      },
      {
        path: 'comments',
        redirect: { name: 'comments_list' },
      },
      {
        path: 'comments/list',
        name: 'comments_list',
        component: () => import('@/components/CommentsList.vue'),
      },
      {
        path: 'messages',
        redirect: { name: 'messages_list' },
      },
      {
        path: 'messages/list',
        name: 'messages_list',
        component: () => import('@/components/MessagesList.vue'),
      },
      {
        path: 'photos',
        redirect: { name: 'photos_list' },
      },
      {
        path: 'photos/add',
        name: 'photos_add',
        component: () => import('@/components/PhotosAdd.vue'),
      },
      {
        path: 'photos/list',
        name: 'photos_list',
        component: () => import('@/components/PhotosList.vue'),
      },
      {
        path: 'users',
        redirect: { name: 'users_list' },
      },
      {
        path: 'users/list',
        name: 'users_list',
        component: () => import('@/components/UsersList.vue'),
      },
    ],
    // 设置路由元信息 只有登录路由公开
  },
  // 登录页路由
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: { isPublic: true }
  },
  // 404
  {
    path: '/error',
    component: () => import('@/views/NOT_FOUND.vue'),
    meta: { isPublic: true }
  },
  {
    path: '*',
    redirect: 'error',
  },
];


const router = new VueRouter({
  mode: "history",
  routes
});

// 配置全局路由守卫
router.beforeEach((to, from, next) => {
  // 目标路由不公开且本地缓存没token记录
  if (!to.meta.isPublic && !localStorage.token) {
    next({ path: '/login' });
  } else {
    next();
  }
})

export default router;