<template>
  <el-dialog title="查看详情" :visible.sync="dialogFormlookVisible">
            <el-form :model="form">
                <el-form-item>
                    <h3>难易等级</h3>
                    <el-input v-model="form.difficult" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>课程号</h3>
                    <el-input v-model="form.courseId" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>考察知识点</h3>
                    <el-input v-model="form.pointId" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3 ref="question">问题描述</h3>
                    <el-input type="textarea" v-model="form.question" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item>
                    <h3>答案</h3>
                    <el-input type="textarea" v-model="form.answer" disabled="disabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose">关 闭</el-button>
            </div>
        </el-dialog>
</template>

<script>
    import Vue from 'vue'
    import bus from './BUS.vue' //导入事件总线，监听事件

    export default {
        data () {
           return {
                form:'',
                dialogFormlookVisible: false,
                imgsrc:'',
                showImg:false,
                showTip:true
           }
        },
        watch: {
            form: function (newForm) {
                var formData = newForm.imgName;
                if (formData != '' && !(formData == 'null')) {
                    this.showImg = true;
                    this.showTip = false;
                    var arr = formData.split(',');
                    if (arr[0] === " ") {
                        this.appendImg(arr[1],'answerimgdiv');
                    } else if (arr[1] === " ") {
                        this.appendImg(arr[0],'questionimgdiv');
                    } else {
                        this.appendImg(arr[0],'questionimgdiv');
                        this.appendImg(arr[1],'answerimgdiv');
                    }
                }
            }
        },
        methods:{
            appendImg (imgStr,divType) {
                let imgs = imgStr.split('-');
                for (let i = 0; i < imgs.length; i ++) {
                    let myimg = document.createElement('img');
                    myimg.src = 'http://localhost:8080/quest/layui/images/' + imgs[i];
                    myimg.className = 'myimg';
                    myimg.style = "width:50%;height:50%;margin:0 auto";
                    // DOM 更新了
                    this.$nextTick(function () {
                        this.$refs[divType].appendChild(myimg);
                    })
                }
            },
            handleClose(){
                this.dialogFormlookVisible = false;
                this.$refs.questionimgdiv.innerHTML = "";
                this.$refs.answerimgdiv.innerHTML = "";
            }
        },
        mounted() {    //在组件的钩子函数中监听事件
            bus.$on('look', data => {   //获取值
                this.dialogFormlookVisible = data.flag;
                this.form = data.value;
            })
        }
    }
</script>

<style scoped>
    .showimg {
        width: 300px!important;
        margin: 0;
        float: left!important;
        margin-left: 15px;
    }
    .tip{
        color:grey;
        display: block;
        padding: 15px ;
        font-size: 16px;
    }
    .myimg{
        display: block;
        width: 300px;
        height: 250px;
    }
</style>

