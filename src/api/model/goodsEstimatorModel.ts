export interface ListPDDGoodsEstimator {
  records: Array<PDDGoodsEstimator>;
  current: number;
  size: number;
  total: number;
}

export interface PDDGoodsEstimatorQuery extends PDDGoodsEstimator {
  current: number;
  size: number;
}

export interface PDDGoodsEstimator {
  goodsName: string;
  skuName: string;
  purchaseCost: number;
  deliveryCost: number;
  packagingCost: number;
  promotionCost: number;
  discountRate: number;
  sellingPrice: number;
  listPrice: number;
  grossMarginRate: number;
  netMarginRate: number;
  grossProfit: number;
  netProfit: number;
  roi: number;
  netProfitRoi: number;
}
