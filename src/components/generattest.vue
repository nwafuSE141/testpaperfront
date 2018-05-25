<template>
    <div class="loadingmain">
        <section>
            <h3 class="title">试卷参数设置</h3>
            试卷题目：<el-input v-model="input" placeholder="请输入试卷题目" style="width: 300px;"></el-input>
            单选题目数：<el-input v-model="singleNum" style="width: 100px;"></el-input>
            多选题目数：<el-input v-model="mutipNum" style="width: 100px;"></el-input>
            填空题目数：<el-input v-model="fillNum" style="width: 100px;"></el-input>
            判断题目数：<el-input v-model="trueoffalseNum" style="width: 100px;"></el-input>
            问答题目数：<el-input v-model="questionNum" style="width: 100px;"></el-input>
        </section>
        <section>
            <h3 class="title">抽取选题</h3>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="srcpercent" status="success"></el-progress>

            <div/>
            <el-select v-model="type" placeholder="请选择题型" class="select-type" @change="selectQuestionType">
                <el-option label="单选题" value="10001" selected="selected"></el-option>
                <el-option label="多选题" value="10002"></el-option>
                <el-option label="填空题" value="10003"></el-option>
                <el-option label="判断题" value="10004"></el-option>
                <el-option label="问答题" value="10005"></el-option>
            </el-select>
            
            <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%;margin-top:10px" max-height="449" highlight-current-row :cell-style="styleFunc">
                <el-table-column prop="id" label="ID" width="60" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="knowledge" label="知识点" width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="question" label="题干" width="350" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="optioncontent" label="选项内容" width="250" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="answer" label="答案" width="250" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="score" label="分值" width="80" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="usageCount" label="使用次数" width="80" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="faq" label="备注" width="150" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                                <el-button  size="mini" type="success" @click="selectItem(scope.row)">使用</el-button>
</template>
            </el-table-column>              
        </el-table>

         <!-- 分页 -->
        <!-- <div class="block">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="count">
            </el-pagination>
        </div> -->
        </section>
        <hr>
        <h3 class="title">已选题目：</h3>
        <el-tabs v-model="type"  type="border-card">
            <el-tab-pane label="单选题" name="10001">
                <selectproject1></selectproject1>
            </el-tab-pane>
            <el-tab-pane label="多选题" name="10002">
                <selectproject2></selectproject2>
            </el-tab-pane>
            <el-tab-pane label="填空题" name="10003">
                <selectproject3></selectproject3>
            </el-tab-pane>
            <el-tab-pane label="判断题" name="10004">
                <selectproject4></selectproject4>
            </el-tab-pane>
            <el-tab-pane label="问答题" name="10005">
                <selectproject5></selectproject5>
            </el-tab-pane>
        </el-tabs>
        <p class="product"><el-button type="primary" size="medium" @click="productProtect()">生成试卷</el-button></p>
        <lookInfo></lookInfo>
    </div>
</template>

<script>
    import Vue from 'vue'
    import bus from './BUS.vue'
    import {
        Loading
    } from 'element-ui';
    import lookInfo from './lookInfo.vue'
    import selectproject1 from './selectproject1.vue'
    import selectproject2 from './selectproject2.vue'
    import selectproject3 from './selectproject3.vue'
    import selectproject4 from './selectproject4.vue'
    import selectproject5 from './selectproject5.vue'
    export default {
        data() {
            return {
                input: '',
                userInfo: {},
                type: '10001',
                currentPage: 1,
                count: 20,
                tableData: [],
                loading: true,
                activeName: 'first', //标签页当前激活位置
                //保存发往服务器端的各题型数据
                singleSelect: '', //选择题
                multipleSelect: '', //简答题
                fillblank: '', //求解题
                tureorfalse: '', //设计题
                quesAndAns: '' ,//应用题,

                singleNum: 10,//选择题数
                mutipNum: 10,//多选题
                fillNum: 10,//填空
                trueoffalseNum: 10,//判断题
                questionNum: 4,//问答题

                srcpercent: 0
            }
        },
        methods: {
            selectQuestionType(v) {
                this.type = v
            },
            getQuestionHandle() {
                let params = new URLSearchParams();
                params.append("type", this.type);
                this.axios.post('http://172.19.12.23:8888/paperorganize/getquestions', params)
                    .then(res => {
                        this.tableData = res.data.data;
                        this.loading = false;
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log("error");
                    })
            },
            reset() { //重置选择题难易比例
                for (var val in this.select) {
                    this.select[val] = 0;
                }
            },
            selectItem(param) { //单个增加题目
                var number = Number(this.type);
                bus.$emit('needids', true);
                let _this = this
                if (number === 10001) {
                    let curNum = Number(_this.singleNum) - 1
                    if(curNum < _this.singleSelect.length ){
                        _this.$confirm('单选题已选满' + _this.singleNum + '道！ 请重新检查')
                        return false
                    }
                    bus.$emit("addData1", param);
                    this.srcpercent += param.score
                    
                } else if (number === 10002) {
                    let curNum = Number(_this.mutipNum) - 1
                    if(curNum < _this.multipleSelect.length ){
                        _this.$confirm('多选题已选满' + _this.mutipNum + '道！ 请重新检查')
                        return false
                    }
                    bus.$emit("addData2", param);
                    this.srcpercent += param.score
                } else if (number === 10003) {
                    let curNum = Number(_this.fillNum) - 1
                    if(curNum < _this.fillblank.length ){
                        _this.$confirm('填空选题已选满' + _this.fillNum + '道！ 请重新检查')
                        return false
                    }
                    bus.$emit("addData3", param);
                    this.srcpercent += param.score
                } else if (number === 10004) {
                    let curNum = Number(_this.trueoffalseNum) - 1
                    if(curNum < _this.tureorfalse.length ){
                        _this.$confirm('判断题已选满' + _this.trueoffalseNum + '道！ 请重新检查')
                        return false
                    }
                    bus.$emit("addData4", param);
                    this.srcpercent += param.score
                } else if (number === 10005) {
                    let curNum = Number(_this.questionNum) - 1
                    if(curNum < _this.quesAndAns.length ){
                        _this.$confirm('判断题已选满' + _this.questionNum + '道！ 请重新检查')
                        return false
                    }
                    bus.$emit("addData5", param);
                    this.srcpercent += param.score
                }
            },
            handleCurrentChange(val) { //更改当前页,重新发起请求
                let _this = this
                _this.loading = true;
                setTimeout(() => {
                    _this.loading = false
                }, 500)
                this.currentPage = val;
            },
            styleFunc(row, rowIndex) { //更改表格样式
                return {
                    padding: '5px 0',
                    hieght: '23px',
                    lineHeight: '23px'
                }
            },
            productProtect() { //生成试卷
                this.$confirm('确定不需要再检查试卷吗, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                        bus.$emit('needids', true);
                        let resObj = {'userid': Number(this.userInfo.username)}
                        resObj.name = this.input
                        resObj.singleSelect = this.singleSelect.map(v => Number(v))
                        resObj.multipleSelect = this.multipleSelect.map(v => Number(v))
                        resObj.fillblank = this.fillblank.map(v => Number(v))
                        resObj.tureorfalse = this.tureorfalse.map(v => Number(v))
                        resObj.quesAndAns = this.quesAndAns.map(v => Number(v))
                        if(this.input.length == 0){
                            this.$confirm('试卷题目不能为空')
                            return false
                        }
                    
                        if(this.multipleSelect.length == 0 || this.fillblank.length == 0 || this.tureorfalse.length == 0 || this.quesAndAns == 0){
                            this.$confirm('所有题型不能为空')
                            return false
                        }
                        this.$nextTick(function() {
                            this.axios.post('http://172.19.12.23:8888/paperorganize/addpaper', resObj)
                            .then(res => {
                                console.log(res.data.stat)
                                if(res.data.stat === 'no'){
                                    this.$confirm(res.data.msg)
                                    this.$message.error(res.data.msg);
                                    return
                                }
                                this.$confirm(res.data.msg)
                                this.$message.success(res.data.msg);
                                this.loading = false;
                            })
                            .catch(res => {
                                this.loading = false;
                                console.log("error");
                            })
                        })
                }).catch(() => {    
                });

            }
        },
        components: {
            lookInfo,
            selectproject1,
            selectproject2,
            selectproject3,
            selectproject4,
            selectproject5,
        },
        mounted() {
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            //默认请求第一类数据
            this.getQuestionHandle()
            //获取各保存非选择题题型的组件发来的数据
            bus.$on('id1', data => {
                this.singleSelect = data;
            });
            bus.$on('id2', data => {
                this.multipleSelect = data;
            });
            bus.$on('id3', data => {
                this.fillblank = data;
            });
            bus.$on('id4', data => {
                this.tureorfalse = data;
            });
            bus.$on('id5', data => {
                this.quesAndAns = data;
            });
        },
        watch: {
            // 如果 `question` 类型发生改变，这个函数就会运行
            type: function() {
                this.getQuestionHandle()
            }
        },
    }
</script>

<style scoped>
    .title {
        font-size: 26px;
        font-family: '楷体';
        text-align: center
    }
    .point {
        margin-left: 15px;
    }
    .myinput {
        width: 100px;
        text-align: center;
    }
    .form-inline {
        padding-top: 5px;
        padding-left: 50px;
    }
    .select-type {
        width: 150px;
    }
    .product {
        margin: 30px auto;
        text-align: center;
    }
</style>
