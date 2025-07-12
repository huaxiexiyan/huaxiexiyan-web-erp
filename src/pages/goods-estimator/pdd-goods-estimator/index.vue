<template>
  <div>
    <t-card :bordered="false">
      <t-form :rules="dynamicRules" :data="formData" @submit="onSubmit" @reset="onReset">
        <t-row :gutter="16">
          <template v-for="field in formFieldConfig" :key="field.key">
            <t-col :span="field.span">
              <t-form-item :label="field.label" :name="field.key">
                <t-input
                  v-model="formData[field.key]"
                  :type="field.type"
                  :placeholder="`请输入${field.label}`"
                  :disabled="disabledFields.includes(field.key)"
                  class="custom-width"
                  @enter="onEnter"
                />
              </t-form-item>
            </t-col>
          </template>

          <!-- 特殊项：选择器 + 按钮 -->
          <t-col :span="3">
            <t-form-item label="计算方式">
              <t-select v-model="selectValue">
                <t-option key="price-by-roi" label="以投产比定售价" value="price-by-roi" />
                <t-option key="price-by-net-profit" label="以净利润定售价" value="price-by-net-profit" />
                <t-option key="price-by-net-margin" label="以净利率定售价" value="price-by-net-margin" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="3">
            <t-form-item>
              <t-space size="small">
                <t-button theme="primary" type="submit">计算</t-button>
                <t-button theme="success" variant="base" @click="handleSaveHistory">保存计算结果</t-button>
                <t-button theme="default" variant="base" type="reset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form> </t-card
    ><t-card class="container-base-margin-top" :bordered="false">
      <pdd-table ref="childRef"></pdd-table>
    </t-card>
  </div>
</template>
<script setup lang="ts">
import type { FormProps, InputProps } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, reactive, ref, toRaw } from 'vue';

import { calculate, saveHistory } from '@/api/goodsEstimator';
import type { PDDGoodsEstimator } from '@/api/model/goodsEstimatorModel';

import PddTable from './components/pdd-table.vue';

// 动态构造校验
type InputType = 'number' | 'text' | 'submit' | 'url' | 'tel' | 'password' | 'search' | 'hidden';

interface FieldConfig {
  key: string;
  label: string;
  type: InputType;
  span: number;
}
// 配置所有字段信息（统一管理）
const formFieldConfig: FieldConfig[] = [
  { key: 'goodsName', label: '商品名称', type: 'text', span: 6 },
  { key: 'skuName', label: 'sku名称', type: 'text', span: 6 },
  { key: 'purchaseCost', label: '商品进价', type: 'number', span: 3 },
  { key: 'deliveryCost', label: '快递费', type: 'number', span: 3 },
  { key: 'packagingCost', label: '包装费', type: 'number', span: 3 },
  { key: 'promotionCost', label: '推流费用', type: 'number', span: 3 },
  { key: 'discountRate', label: '活动折扣', type: 'number', span: 3 },
  { key: 'sellingPrice', label: '商品售价', type: 'number', span: 3 },
  { key: 'listPrice', label: '商品标价', type: 'number', span: 3 },
  { key: 'grossProfit', label: '毛利润', type: 'number', span: 3 },
  { key: 'grossMarginRate', label: '毛利率%', type: 'number', span: 3 },
  { key: 'netProfit', label: '净利润', type: 'number', span: 3 },
  { key: 'netMarginRate', label: '净利率%', type: 'number', span: 3 },
  { key: 'roi', label: '投产比', type: 'number', span: 3 },
  { key: 'netProfitRoi', label: '净利润投产比', type: 'number', span: 3 },
];
// 动态禁用字段和校验字段映射
const disabledFieldsMap = {
  'price-by-roi': ['promotionCost', 'sellingPrice', 'listPrice', 'grossProfit', 'netProfit', 'roi', 'netProfitRoi'],
  'price-by-net-profit': ['netProfit'],
  'price-by-net-margin': ['netMarginRate'],
};

const validateFieldsMap = {
  'price-by-roi': [
    'goodsName',
    'skuName',
    'purchaseCost',
    'deliveryCost',
    'packagingCost',
    'discountRate',
    'grossMarginRate',
    'netMarginRate',
  ],
  'price-by-net-profit': ['goodsName', 'skuName', 'netProfit'],
  'price-by-net-margin': ['goodsName', 'skuName', 'netMarginRate'],
};
type SelectMode = 'price-by-roi' | 'price-by-net-profit' | 'price-by-net-margin';
const selectValue = ref<SelectMode>('price-by-roi');
const disabledFields = computed(() => disabledFieldsMap[selectValue.value] || []);
const validateFields = computed(() => validateFieldsMap[selectValue.value] || []);

// 动态构造校验规则
const FORM_RULES_BASE: FormProps['rules'] = {
  goodsName: [{ required: true, message: '商品名称必填' }],
  skuName: [{ required: true, message: 'SKU名称必填' }],
  purchaseCost: [{ required: true, message: '商品进价必填' }],
  deliveryCost: [{ required: true, message: '快递费必填' }],
  packagingCost: [{ required: true, message: '包装费必填' }],
  promotionCost: [{ required: true, message: '推流费用必填' }],
  discountRate: [{ required: true, message: '折扣必填' }],
  sellingPrice: [{ required: true, message: '售价必填' }],
  listPrice: [{ required: true, message: '标价必填' }],
  grossProfit: [{ required: true, message: '毛利润必填' }],
  grossMarginRate: [{ required: true, message: '毛利率必填' }],
  netProfit: [{ required: true, message: '净利润必填' }],
  netMarginRate: [{ required: true, message: '净利率必填' }],
  roi: [{ required: true, message: '投产比必填' }],
  netProfitRoi: [{ required: true, message: '净利润投产比必填' }],
};

const dynamicRules = computed<FormProps['rules']>(() => {
  const rules: FormProps['rules'] = {};
  validateFields.value.forEach((key) => {
    if (!disabledFields.value.includes(key)) {
      rules[key] = FORM_RULES_BASE[key];
    }
  });
  return rules;
});

const formData: FormProps['data'] = reactive({
  purchaseCost: null,
  deliveryCost: 1.8,
  packagingCost: 0,
  promotionCost: null,
  discountRate: 8,
  sellingPrice: null,
  listPrice: null,
  grossMarginRate: null,
  netMarginRate: null,
  grossProfit: null,
  netProfit: null,
  roi: null,
  netProfitRoi: null,
});
// 2. 用泛型类型约束 ref
const childRef = ref<ChildExposed | null>(null);

const onReset: FormProps['onReset'] = () => {
  MessagePlugin.success('重置成功');
};
const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    // 转换为非响应式对象后传参
    const rawFormData = toRaw(formData) as PDDGoodsEstimator;
    const res = await calculate(selectValue.value, rawFormData); // 异步请求
    Object.assign(formData, res);
    MessagePlugin.success('计算完成');
  } else {
    console.log('Validate Errors: ', firstError, validateResult);
    MessagePlugin.warning(firstError);
  }
};

const handleSaveHistory = async () => {
  // 转换为非响应式对象后传参
  const rawFormData = toRaw(formData) as PDDGoodsEstimator;
  await saveHistory(rawFormData); // 异步请求
  MessagePlugin.success('结果已保存');
  childRef.value?.fetchData();
  console.log('执行了');
};

// 禁用 Input 组件，按下 Enter 键时，触发 submit 事件
const onEnter: InputProps['onEnter'] = (_, { e }) => {
  e.preventDefault();
};

// 1. 定义子组件暴露的方法类型
interface ChildExposed {
  fetchData: () => void;
}
</script>
<style lang="less" scoped>
.custom-width {
  width: 100px;
}
</style>
