/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'shopadmin_supply',
      icon: 'truck',
      keepAlive: true,
      title: '供应'
    },
    name: 'shopadminSupply',
    path: '/shopadmin/supply',
    children: [
      {
        name: 'shopadminSupplierGoodsLibrary',
        path: 'supplier-goods/library',
        component: () => import('@/view/mall/goods/physical/distributor_supplier_goods_library'),
        meta: {
          aliasName: 'shopadmin_supplier_goods_library',
          icon: 'icon-products',
          title: '商品库',
          permissions: ['shopadmin_supply.shopadmin_supplygoods.shopadmin_supplier_goods_library']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '商品详情',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'shopadminSupplierGoodsManage',
        path: 'supplier-goods/manage',
        component: () => import('@/view/mall/goods/physical/supplier_goods_list'),
        meta: {
          aliasName: 'shopadmin_supplier_goods_manage',
          icon: 'icon-products',
          title: '商品管理',
          supplierGoodsManage: true,
          permissions: ['shopadmin_supply.shopadmin_supplygoods.shopadmin_supplier_goods_manage']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '编辑商品',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
