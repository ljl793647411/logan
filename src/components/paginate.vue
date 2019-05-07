<template>
  <div class="block top">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizesList"
      :page-size="pageSizes"
      :prev-text="pageVo.prevText"
      :next-text="pageVo.nextText"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSizeChange (val) {
        this.pageSizes = val
        this.$emit('changePage', 1, val)
      },
      handleCurrentChange (val) {
        this.$emit('changePage', val, this.pageSizes)
      }
    },
    mounted () {
      this.$nextTick(() => {
        console.log('currentPage', this.currentPage, 'pageSize', this.pageSize)
        if (this.pageSizesLists && this.pageSizesLists.length !== 0) {
          this.pageSizesList = this.pageSizesLists
        }
      })
    },
    props: ['pageVo', 'currentPage', 'count', 'totalRecs', 'pageSize', 'pageSizesLists'],
    data () {
      return {
        pageSizesList: [10, 20, 30, 40, 50],
        pageSizes: this.pageSize
      }
    },
    computed: {
      total () {
        return parseInt(this.totalRecs)
      }
    }
  }
</script>

<style scoped>
  .top {
    margin-top: 20px;
  }
</style>
