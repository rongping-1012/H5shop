const Layout = () => import('@/layouts/DefaultLayout.vue')
const Home = () => import('@/views/Home/Index.vue')

export default {
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: 'home',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页',
        icon: 'home-o',
        keepAlive: true
      }
    }
  ]
}
