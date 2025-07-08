import type { ListPDDGoodsEstimator, PDDGoodsEstimator, PDDGoodsEstimatorQuery } from '@/api/model/goodsEstimatorModel';
import { request } from '@/utils/request';

const Api = {
  Calculate: '/erp/goods-estimator/pdd/calculate',
  HistoryList: '/erp/goods-estimator/pdd/history',
};

export function calculate(type: string, pddGoodsEstimator: PDDGoodsEstimator) {
  return request.post<PDDGoodsEstimator>({
    url: `${Api.Calculate}/${type}`,
    data: pddGoodsEstimator,
  });
}

export function getHistoryList(params: PDDGoodsEstimatorQuery) {
  return request.get<ListPDDGoodsEstimator>({
    url: Api.HistoryList,
    params,
  });
}
