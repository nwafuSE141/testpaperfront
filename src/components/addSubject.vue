<template>
  <el-dialog title="增加题目" :visible.sync="dialogFormAddSubjectVisible"  :show-close="false">
            <el-form :model="form">
                <el-form-item label="选择题型">
                <el-select v-model="form.type" placeholder="请选择题型">
                    <el-option label="单项选择题" value="0"></el-option>
                    <el-option label="多项选择题" value="1"></el-option>
                    <el-option label="填空题" value="2"></el-option>
                    <el-option label="判断题" value="3"></el-option>
                    <el-option label="问答题" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="难易等级">
                    <el-input v-model="form.difficult"></el-input>
                </el-form-item>
                <el-form-item label="课程号">
                    <el-input v-model="form.courseId"></el-input>
                </el-form-item>
                <el-form-item label="考察知识点">
                    <el-input v-model="form.pointId"></el-input>
                </el-form-item>
                <el-form-item label="问题描述">
                    <el-input type="textarea" v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item label="答案">
                    <el-input type="textarea" v-model="form.answer"></el-input>
                </el-form-item>
                <el-form-item label="解析">
                  <el-input type="textarea" v-model="form.faq"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleAddClose">保 存</el-button>
            </div>
        </el-dialog>
</template>

<script>
    import bus from './BUS.vue'
    import { Loading } from 'element-ui';

    export default {
        data () {
           return {
                form:{
                    type:'',
                    difficult:'',
                    courseId:'',
                    question:'',
                    pointId:'',
                    answer:'',
                    faq:'',
                    additional:'',
                    questionImg:{},
                    answerImg:{}
                },
                dialogFormAddSubjectVisible: false,
                question_fileList:[],
                answer_fileList:[],
                isLast:false,
                questionImgCounter:0,
                answerImgCounter:0,
                questionImgNameAry:[],
                answerImgNameAry:[],
           }
        },
        watch:{
            "this.form": function (newValue) {
                console.log(newValue);
            }
        },
        methods:{
            handleAddClose(){  //点击关闭按钮后把添加的内容发送给服务器
                this.dialogFormAddSubjectVisible = false;
                var loadingInstance = Loading.service({   //读取文件时显示加载条
                    target:'#container',
                    text:'题目上传中...'
                });
                var params = new URLSearchParams();
                params.append('type',this.form.type);
                params.append('difficult',this.form.difficult);
                params.append('courseId',this.form.courseId);
                params.append('pointId',this.form.pointId);
                params.append('answer',this.form.answer);
                params.append('question',this.form.question);
                params.append('faq',this.form.faq);
                var queLen = this.questionImgNameAry.length;
                var ansLen = this.answerImgNameAry.length;
                this.axios.post('http://localhost:8888/item/add',params)
                .then( res => {
                    loadingInstance.close();
                    this.$message.success('添加成功！');
                })
                .catch( res => {
                    loadingInstance.close();
                    this.$message.error('添加失败！');
                })
                if (this.isLast) {
                    bus.$emit("isLast",true);
                }
                this.handleClose();
            },
            handleClose () {
                this.dialogFormAddSubjectVisible = false;
                  for (var index in this.form) {   //关闭弹框后把内容清空
                        if (index == 'questionImg' || index == 'answerImg') {
                            this.form[index] = {};
                        } else {
                            this.form[index] = '';
                        }
                    }
                    this.question_fileList = [];
                    this.answer_fileList = [];
                    this.questionImgCounter = 0;
                    this.answerImgCounter = 0;
                    this.questionImgNameAry = [];
                    this.answerImgNameAry = [];
            },


        },
        mounted() {    //在组件的钩子函数中监听事件
            bus.$on('addSubject', data => {   //获取值
                this.dialogFormAddSubjectVisible = data.flag;
                this.type = data.type;
                this.isLast = data.isLast;
            })
        }
    }
</script>

<style scoped>

</style>

