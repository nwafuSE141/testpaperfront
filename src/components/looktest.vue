<template>
    <div>
        <section>
            <h3 class="title">试卷列表</h3>
            <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%;margin-top:10px" max-height="449" highlight-current-row :cell-style="styleFunc">
                <el-table-column prop="id" label="ID" width="60" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="试卷名字" width="300" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="createTime.time" label="创建时间" width="300" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                                    <el-button  size="mini" type="success" @click="viewDetail(scope.row)"><i class="el-icon-view"></i></el-button>
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
        <el-dialog
            :title="curRow.name"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <div>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>一、单选题</span>
                    </div>
                    <div v-for="o in paperInfo.singleChoicList" :key="o.id" class="text item">
                        {{ o.serialNumber + '.' + o.question + ' （' + o.answer + '）' + ' （' + o.score + '分）' }}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.a}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.b}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.c}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.d}}
                    </div>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>二、多选题</span>
                    </div>
                    <div v-for="o in paperInfo.multipleChoicList" :key="o.id" class="text item">
                        {{ o.serialNumber + '.' + o.question + ' （' + o.answer + '）' + ' （' + o.score + '分）' }}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.a}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.b}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.c}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.d}}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{o.e}}
                    </div>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>三、填空题</span>
                    </div>
                    <div v-for="o in paperInfo.fillBlankList" :key="o.id" class="text item">
                        {{ o.serialNumber + '.' + o.question + ' （' + o.answer + '）' + ' （' + o.score + '分）' }}
                    </div>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>四、判断题</span>
                    </div>
                    <div v-for="o in paperInfo.trueOrFalseList" :key="o.id" class="text item">
                        {{ o.serialNumber + '.' + o.question + ' （' + o.answer + '）' + ' （' + o.score + '分）' }}
                    </div>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>五、问答题</span>
                    </div>
                    <div v-for="o in paperInfo.quesAndAnsList" :key="o.id" class="text item">
                        {{ o.serialNumber + '.' + o.question + ' （' + o.score + '分）' }}
                        </br>
                        &nbsp;&nbsp;&nbsp;{{'答：' + o.answer}}
                    </div>
                </el-card>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userInfo: {},
                currentPage: 1,
                count: 400,
                loading: true,
                tableData: [],
                dialogVisible: false,
                curRow: {},
                paperInfo: {}
            };
        },
        methods: {
            handleClose() {
                this.dialogVisible = false
            },
            handleCurrentChange(val) {
                //更改当前页,重新发起请求
                let _this = this;
                _this.loading = true;
                setTimeout(() => {
                    _this.loading = false;
                }, 500);
                this.currentPage = val;
            },
            styleFunc(row, rowIndex) {
                //更改表格样式
                return {
                    padding: "5px 0",
                    hieght: "23px",
                    lineHeight: "23px"
                };
            },
            viewDetail(row) {
                this.curRow = row
                let params = new URLSearchParams();
                params.append("paperId", row.id);
                this.axios.post('http://172.19.12.23:8888/paperinfo/getpapercompleteinfo', params)
                    .then(res => {
                        this.paperInfo = res.data.data;
                        this.loading = false;
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log("error");
                    })
                this.dialogVisible = true
            },
            getPaperList() {
                let params = new URLSearchParams();
                params.append("userId", Number(this.userInfo.username));
                this.axios
                    .post("http://172.19.12.23:8888/paper/getpaperwithid", params)
                    .then(res => {
                        this.tableData = res.data.data;
                        this.loading = false;
                    })
                    .catch(res => {
                        this.loading = false;
                        console.log("error");
                    });
            }
        },
        mounted() {
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            this.getPaperList();
        }
    };
</script>

<style scoped>
    .title {
        font-size: 26px;
        font-family: "楷体";
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

