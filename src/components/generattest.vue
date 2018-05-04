<template>
    <div class="loadingmain">
        <section>
            <h3 class="title">抽取选择题</h3>
            <el-form v-model="select" :inline="true" class="form-inline">
                <el-form-item label="简单" class="point">
                    <el-input v-model="select.esay" class="myinput" type="number"></el-input>%
                </el-form-item>
                <el-form-item label="复杂" class="point">
                    <el-input v-model="select.normal" class="myinput" type="number"></el-input>%
                </el-form-item>
                <el-form-item label="题量" class="point">
                    <el-input v-model="select.number" class="myinput" type="number"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section>
            <h3 class="title">抽取非选择题</h3>
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
                                <el-button  size="mini" type="success" @click="selectItem(scope.row)"><i class="el-icon-plus"></i></el-button>
</template>
            </el-table-column>              
        </el-table>

         <!-- 分页 -->
        <div class="block">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="count">
            </el-pagination>
        </div>
        </section>
        <hr>
        <h3>已选题目：</h3>
        <el-tabs v-model="activeName"  type="border-card">
            <el-tab-pane label="单选题" name="first">
                <selectproject1></selectproject1>
            </el-tab-pane>
            <el-tab-pane label="多选题" name="second">
                <selectproject2></selectproject2>
            </el-tab-pane>
            <el-tab-pane label="填空题" name="third">
                <selectproject3></selectproject3>
            </el-tab-pane>
            <el-tab-pane label="判断题" name="fourth">
                <selectproject4></selectproject4>
            </el-tab-pane>
            <el-tab-pane label="问答题" name="fifth">
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
                select: {
                    esay: 80,
                    normal: 20,
                    number: 25
                },
                type: '10001',
                currentPage: 1,
                count: 400,
                tableData: [],
                loading: true,
                activeName: 'first', //标签页当前激活位置
                //保存发往服务器端的各题型数据
                simpleSelect: '', //选择题
                multipleSelect: '', //简答题
                fillblank: '', //求解题
                tureorfalse: '', //设计题
                quesAndAns: '' //应用题
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
                if (number === 10001) {
                    bus.$emit("addData1", param);
                } else if (number === 10002) {
                    bus.$emit("addData2", param);
                } else if (number === 10003) {
                    bus.$emit("addData3", param);
                } else if (number === 10004) {
                    bus.$emit("addData4", param);
                } else if (number === 10005) {
                    bus.$emit("addData5", param);
                }
            },
            handleCurrentChange(val) { //更改当前页,重新发起请求
                let _this = this
                _this.loading = true;
                setTimeout(() => {
                    _this.loading = false
                }, 500)
                this.currentPage = val;
                // this.axios.get('http://localhost:8080/getQuestions', {
                //         params: {
                //             page: val,
                //             limit: 20,
                //             type: this.type
                //         }
                //     })
                //     .then(res => {
                //         this.loading = false;
                //         this.tableData = res.data.data;
                //         this.count = res.data.count;
                //     })
                //     .catch(res => {
                //         this.loading = false;
                //         console.log("error");
                //     })
            },
            styleFunc(row, rowIndex) { //更改表格样式
                return {
                    padding: '5px 0',
                    hieght: '23px',
                    lineHeight: '23px'
                }
            },
            productProtect() { //生成试卷
            bus.$emit('needids', true);
            console.log(this.shortAnswers)
            // console.log(this.selectQuestions)
            // console.log(this.shortAnswers)
            // console.log(this.solvingProblems)
            // console.log(this.designQuestions)
                //判断抽取的选择题比例之和是否为100%
                // if (Number(this.select.esay) + Number(this.select.normal) != 100) {
                //     this.$message.error('单项选择题所选比例之和必须为100！');
                //     return false;
                // }
                // if (Number(this.select.number) < 10) {
                //     this.$message.error('您选择的单项选择题题量过少，请重新选择！');
                //     return false;
                // }
                // this.selectQuestions = `${this.select.esay},${this.select.normal}`;
                // //向各保存非选择题题型的组件发送信息，让它们传送所保存题目的id过来，以便上传服务器
                // bus.$emit('needids', true);
                // //等获取了各组件发来的题型数据以后再发送请求（DOM更新后）
                // this.$nextTick(function() {
                //     let loadingInstance = Loading.service({
                //         lock: true,
                //         text: '正在生成试卷...',
                //         spinner: 'el-icon-loading',
                //         background: 'rgba(0, 0, 0, 0.8)'
                //     }); //加载加载条
                //     //将抽题信息发往服务端
                //     var params = new URLSearchParams();
                //     params.append("selectQuestionsNumber", this.select.number);
                //     params.append("selectQuestions", this.selectQuestions);
                //     params.append("shortAnswers", this.shortAnswers);
                //     params.append("solvingProblems", this.solvingProblems);
                //     params.append("designQuestions", this.designQuestions);
                //     params.append("applicationProblems", this.applicationProblems);
                //     this.axios.post('http://localhost:8080/takeQuestionnaire', params)
                //         .then(res => {
                //             loadingInstance.close(); //关闭加载条
                //             this.$message.success('生成成功！');
                //         })
                //         .catch(res => {
                //             loadingInstance.close(); //关闭加载条
                //             this.$message.error('生成失败！');
                //         })
                // })
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
            //默认请求第一类数据
            this.getQuestionHandle()
            //获取各保存非选择题题型的组件发来的数据
            bus.$on('id1', data => {
                this.simpleSelect = data;
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
        font-family: '楷体'
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
