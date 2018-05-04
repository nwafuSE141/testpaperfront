<template>
    <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%;margin-top:10px"
                max-height="449"
                highlight-current-row
                :cell-style="styleFunc">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                prop="id"
                label="ID"
                width="60"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="question"
                label="题干"
                width="350"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="optioncontent"
                label="选项内容"
                width="250"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="answer"
                label="答案"
                width="250"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="score"
                label="分值"
                width="80"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="usageCount"
                label="使用次数"
                width="80"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="faq"
                label="备注"
                width="150"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="操作"
                width="150"
                align="center">
                    <template slot-scope="scope">
                        <el-button  size="mini" type="warning" @click="deleteItem(scope.row.id)"><i class="el-icon-delete"></i></el-button>
                    </template>
                </el-table-column>              
                </el-table>
</template>

<script>
    import bus from './BUS.vue'
    export default {
        data(){
            return {
                tableData:[]
            }
        },
        mounted(){
            //监听组件的要求显示信息事件
            bus.$on('addData5', data =>{
                for (var index in this.tableData) {
                     if (this.tableData[index].id == data.id) {
                         return false;
                     }
                }
                this.tableData.unshift(data);
            });

            //监听组件的需要数据事件
            bus.$on('needids', data => {
                if (data) {      //将本题型所选择的题目id发往该组件
                    bus.$emit('id5',this.collectID(this.tableData));
                }
            });

        },
        methods:{
            deleteItem(id){//删除题目
                this.searchPlace(this.tableData,id);
            },
            styleFunc(row,rowIndex){   //更改表格样式
                return {padding:'5px 0',hieght:'23px',lineHeight:'23px'}
            }, 
        }
    }
</script>

<style scoped>

</style>

