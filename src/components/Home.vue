<template>
    <div id="root">
        <my-header></my-header>
        <div class="clearfix"></div>
        <section class="myrow" >
            <nav>
                <left-nav></left-nav>
            </nav>
            
            <section id="container">
                  <keep-alive>
                      <transition name="el-fade-in">
                         <router-view></router-view>
                      </transition>  
                  </keep-alive>
            </section>
        </section>

        <notice></notice>
    </div>
</template>

<script>

import Header from './Header.vue'
import leftNav from './leftNav.vue'
import notice from './notice.vue'

export default {
    name: 'root',
    data () {
      return {
        msg: 'Hello vue.js'
      }
    },
    components:{
      'myHeader':Header,
      'leftNav':leftNav,
      'notice':notice
    }
}
</script>

<style  scoped>
    #root{
      height: 100%;
    }
    .clearfix{
      clear: both;
    }
    .myrow{
      height: 90.5%;
      margin-top: -1px;
    }

    .el-pager li .number{
      border: 1px solid gray!important;
      border-radius: 4px!important;
    }

    nav {
      width: 17%;
      height: 100%;
      float: left;
    }

    #container{
      width: 82.9%;
      height:100%;
      float: right;
      overflow-y: auto;
    }
</style>
