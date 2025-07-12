<template>
  <t-table
    row-key="index"
    :data="data"
    :columns="columns"
    :pagination="pagination"
    @page-change="rehandlePageChange"
    @change="rehandleChange"
  >
    <template #operation="{ row }">
      <t-link theme="primary" @click="handleRemove(row)"> 删除 </t-link>
    </template>
  </t-table>
</template>
<script setup lang="tsx">
import type { PageInfo, PaginationProps, TableProps, TableRowData } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';

import { getHistoryList, removeHistory } from '@/api/goodsEstimator';
import type { PDDGoodsEstimatorQuery } from '@/api/model/goodsEstimatorModel';

const columns = ref<TableProps['columns']>([
  {
    colKey: 'goodsName',
    title: '商品名称',
    fixed: 'left',
  },
  {
    colKey: 'skuName',
    title: 'sku名称',
    fixed: 'left',
  },
  {
    colKey: 'purchaseCost',
    title: '商品进价',
    align: 'center',
  },
  {
    colKey: 'sellingPrice',
    title: '商品售价',
    align: 'center',
  },
  {
    colKey: 'listPrice',
    title: '商品标价',
    align: 'center',
  },
  {
    colKey: 'promotionCost',
    title: '推流费用',
    align: 'center',
  },
  {
    colKey: 'grossProfit',
    title: '毛利润',
    align: 'center',
  },
  {
    colKey: 'grossMarginRate',
    title: '毛利率',
    align: 'center',
    cell: (h, { row }) => {
      return `${row.grossMarginRate} %`;
    },
  },
  {
    colKey: 'netProfit',
    title: '净利润',
    align: 'center',
  },
  {
    colKey: 'netMarginRate',
    title: '净利率',
    align: 'center',
    cell: (h, { row }) => {
      return `${row.netMarginRate} %`;
    },
  },
  {
    colKey: 'roi',
    title: '投产比',
    align: 'center',
  },
  {
    colKey: 'netProfitRoi',
    title: '净利润投产比',
    align: 'center',
  },
  {
    colKey: 'deliveryCost',
    title: '快递费',
    align: 'center',
  },
  {
    colKey: 'packagingCost',
    title: '包装费',
    align: 'center',
  },
  {
    colKey: 'discountRate',
    title: '活动折扣',
    align: 'center',
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right',
  },
]);

onMounted(() => {
  fetchData();
});
const data = ref([]);
// 分页
const pagination = ref({
  defaultPageSize: 5,
  total: 0,
  defaultCurrent: 1,
});
const query = ref({
  current: 1,
  size: 5,
} as unknown as PDDGoodsEstimatorQuery);
// 初始化
const fetchData = async () => {
  console.log('查询前分页', query.value.current, query.value.size);

  const { records, total } = await getHistoryList(query.value);
  data.value = records;
  pagination.value = {
    ...pagination.value,
    total,
  };
};
const rehandlePageChange = (pageInfo: PageInfo, newDataSource: TableRowData[]) => {
  console.log('分页变化', pageInfo, newDataSource);
  query.value.current = pageInfo.current;
  query.value.size = pageInfo.pageSize;
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  fetchData();
};

const handleRemove = async (context: TableRowData) => {
  await removeHistory(context.id);
  fetchData();
  MessagePlugin.success('已删除');
};

// 暴露方法给父组件
defineExpose({
  fetchData,
});
</script>
<style lang="less" scoped></style>
