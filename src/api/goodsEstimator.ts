import type { ListPDDGoodsEstimator, PDDGoodsEstimator, PDDGoodsEstimatorQuery } from '@/api/model/goodsEstimatorModel';
import { request } from '@/utils/request';

const Api = {
  Calculate: '/erp/goods-estimator/pdd/calculate',
  PDDHistory: '/erp/goods-estimator/pdd/history',
};

export function calculate(type: string, pddGoodsEstimator: PDDGoodsEstimator) {
  return request.post<PDDGoodsEstimator>({
    url: `${Api.Calculate}/${type}`,
    data: pddGoodsEstimator,
  });
}

export function getHistoryList(params: PDDGoodsEstimatorQuery) {
  return request.get<ListPDDGoodsEstimator>({
    url: Api.PDDHistory,
    params,
  });
}

export function saveHistory(pddGoodsEstimator: PDDGoodsEstimator) {
  return request.post<void>({
    url: Api.PDDHistory,
    data: pddGoodsEstimator,
  });
}

export function removeHistory(id: string) {
  return request.delete<void>({
    url: `${Api.PDDHistory}/${id}`,
  });
}
