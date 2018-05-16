import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import ShowInfo from '../components/ShowInfo.vue'
import subjectImport from '../components/subjectImport.vue'
import generattest from '../components/generattest.vue'
import looktest from '../components/looktest.vue'
import reviewtest from '../components/reviewtest.vue'
import exporttest from '../components/exporttest.vue'
import edit from '../components/edit.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Login,
        },{
            path: '/Home',
            component: Home,
            redirect: { path: '/1' },
            children: [
                {
                    path: '/1',
                    component: welcome
                }, {
                    path: '/2',
                    component: subjectImport
                }, {
                    path: '/3',
                    component: ShowInfo
                }, {
                    path: '/4',
                    component: generattest
                }, {
                    path: '/5',
                    component: looktest
                }, {
                    path: '/6',
                    component: reviewtest
                },{
                    path: '/7',
                    component: exporttest
                },{
                    path: '/edit',
                    component: edit
                }
            ]
        }
    ]
})