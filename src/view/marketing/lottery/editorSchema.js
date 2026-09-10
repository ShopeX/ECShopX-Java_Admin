/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex-ui/finder'

export const formList = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: vm.$t('de51ee4c.7bc81f')
      },
      // {
      //   label: '区域',
      //   key: 'area_id',
      //   placeholder: '请选择',
      //   defaultValue: '',
      //   required: true,
      //   type: 'select',
      //   options: vm?.areas || []
      // },
      {
        label: vm.$t('de51ee4c.902a3d'),
        key: 'activity_name',
        type: 'input',
        required: true,
        placeholder: vm.$t('de51ee4c.c0e2a5'),
        defaultValue: ''
      },
      {
        label: vm.$t('de51ee4c.c799f5'),
        key: 'start_time',
        required: true,
        placeholder: vm.$t('de51ee4c.d8e0d0'),
        defaultValue: '',
        component(_) {
          const isEdit = vm.isEditMode
          return (
            <el-date-picker
              v-model={vm.form['start_time']}
              type='datetimerange'
              disabled={vm.formReadonly}
              on-change={(val) => vm.handleDateInput(val)}
              range-separator={vm.$t('bea3f44a.981cbe')}
              start-placeholder={vm.$t('39e3acc2.592c59')}
              end-placeholder={vm.$t('39e3acc2.f78277')}
              value-format='yyyy-MM-dd HH:mm:ss'
              default-time={['00:00:00', '23:59:59']}
              picker-options={
                isEdit
                  ? {
                      // 编辑态开始时间不可改：仅通过 handleDateInput 锁住 start
                    }
                  : undefined
              }
            />
          )
        }
      },
      {
        label: vm.$t('de51ee4c.29da05'),
        key: 'cost_type',
        type: 'input',
        required: true,
        placeholder: vm.$t('de51ee4c.d836a5'),
        defaultValue: '2',
        component(_) {
          return (
            <div>
              <el-radio-group v-model={vm.form['cost_type']} disabled={true}>
                <el-radio-button label='2'>{vm.$t('9f64e002.9f68a8')}</el-radio-button>
              </el-radio-group>
              <el-input
                v-model={vm.form['cost_value']}
                placeholder={vm.$t('de51ee4c.4e44e6')}
                type='number'
                disabled={vm.isEditMode || vm.formReadonly}
                style={{ width: '120px', marginLeft: '20px' }}
                onBlur={(val) => {
                  const _val = val.target.value
                  let _num = 1
                  if (_val === '' || _val == null || Number(_val) < 1) {
                    _num = 1
                  } else {
                    _num = Number(_val)
                  }
                  vm.form = {
                    ...vm.form,
                    cost_value: _num
                  }
                }}
              />
              <span class='form-item-tip' style={{ marginLeft: '12px' }}>
                {vm.$t('de51ee4c.cf5fe4')}
              </span>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.00e557'),
        key: 'limit_total',
        type: 'input',
        placeholder: vm.$t('de51ee4c.e2e69f'),
        defaultValue: 0,
        required: false,
        component() {
          return (
            <div>
              <el-input
                v-model={vm.form['limit_total']}
                style={{ width: '120px' }}
                type='number'
                disabled={vm.formReadonly}
                placeholder={vm.$t('de51ee4c.57e514')}
                onBlur={(val) => {
                  const _val = val.target.value
                  let _num = 0
                  if (_val === '' || _val == null || Number(_val) < 0) {
                    _num = 0
                  } else {
                    _num = Number(_val)
                  }
                  let limitDay = Number(vm.form['limit_day']) || 0
                  if (_num > 0 && limitDay > _num) {
                    limitDay = _num
                  }
                  vm.form = {
                    ...vm.form,
                    limit_total: _num,
                    limit_day: limitDay
                  }
                }}
              />
              <span class='form-item-tip' style={{ marginLeft: '12px' }}>
                {vm.$t('de51ee4c.57e514')}
              </span>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.38e137'),
        key: 'limit_day',
        type: 'input',
        placeholder: vm.$t('de51ee4c.57e514'),
        defaultValue: 0,
        required: false,
        component() {
          return (
            <div>
              <el-input
                v-model={vm.form['limit_day']}
                style={{ width: '120px' }}
                type='number'
                disabled={vm.formReadonly}
                placeholder={vm.$t('de51ee4c.57e514')}
                onBlur={(val) => {
                  const _val = val.target.value
                  let _num = 0
                  if (_val === '' || _val == null || Number(_val) < 0) {
                    _num = 0
                  } else {
                    _num = Number(_val)
                  }
                  const limitTotal = Number(vm.form['limit_total']) || 0
                  if (limitTotal > 0 && _num > limitTotal) {
                    _num = limitTotal
                  }
                  vm.form = {
                    ...vm.form,
                    limit_day: _num
                  }
                }}
              />
              <span style={{ marginLeft: '8px' }}>{vm.$t('de51ee4c.7229ec')}</span>
              <span class='form-item-tip' style={{ marginLeft: '12px' }}>
                {vm.$t('de51ee4c.57e514')}
              </span>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.4cfbf6'),
        key: 'intro',
        type: 'richText',
        required: true,
        placeholder: vm.$t('de51ee4c.950b2a'),
        defaultValue: ''
      },
      {
        type: 'group',
        label: vm.$t('de51ee4c.51c33b'),
        defaultValue: ''
      },
      {
        label: vm.$t('de51ee4c.9f0391'),
        defaultValue: 'wheel',
        required: true,
        key: 'activity_type',
        component(_) {
          // 本期仅大转盘；老虎机 / 九宫格暂不开放
          return <span>{vm.$t('dd9b5a55.5fa218')}</span>
        }
      },
      {
        label: vm.$t('de51ee4c.51c33b'),
        key: 'prize_data',
        defaultValue: [],
        required: true,
        component() {
          return (
            <SpFinder
              ref='finder'
              data={vm.form['prize_data']}
              no-selection
              setting={innerSchema(vm)}
              row-actions-width='50px'
              show-pager={false}
              class='prize_data'
            >
              <div slot='tableTop'>
                <el-button plain disabled={vm.formReadonly} onClick={() => vm.addHandle()}>
                  {vm.$t('de51ee4c.d2f216')}
                </el-button>
                <span>&nbsp;{vm.$t('de51ee4c.5ef360')}</span>
                <div style={{ height: '20px' }}></div>
              </div>
            </SpFinder>
          )
        },
        validator(rule, value, callback) {
          const list = value?.filter((item) => item.type) || []
          const total = list.reduce((acc, item) => acc + (item.probability * 1 || 0), 0)
          if (total > 100 || total <= 0) {
            callback(new Error(vm.$t('de51ee4c.0649b8')))
          } else if (list.length <= 0) {
            callback(new Error(vm.$t('de51ee4c.e4ef0f')))
          } else if (!list.some((item) => item.type === 'thanks')) {
            callback(new Error('至少配置一个「无奖品/谢谢参与」奖项'))
          } else {
            callback()
          }
        }
      },
      {
        label: '抽奖区顶部高度',
        key: 'gameMarginTop',
        required: true,
        defaultValue: 150,
        component() {
          return (
            <el-input
              v-model={vm.form['gameMarginTop']}
              type='number'
              disabled={vm.formReadonly}
              style={{ width: '120px' }}
              onBlur={(e) => {
                const n = Number(e.target.value)
                vm.form = {
                  ...vm.form,
                  gameMarginTop: !n || n < 0 ? 150 : n
                }
              }}
            />
          )
        }
      },
      {
        label: vm.$t('de51ee4c.1dff74'),
        key: 'back',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <span>{vm.$t('de51ee4c.2f97db')}</span>
                <span>{vm.$t('de51ee4c.543aa6')}</span>
                <span
                  style={{ marginLeft: '40px' }}
                  onClick={() => {
                    vm.form = {
                      ...vm.form,
                      background: '',
                      backgroundColor: '#ffffff'
                    }
                  }}
                >
                  {vm.$t('de51ee4c.7468f3')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <div>
                  <el-color-picker
                    value={vm.form['backgroundColor']}
                    onChange={(val) => {
                      console.log('🚀 ~ onChange ~ val:', val)
                      vm.form = {
                        ...vm.form,
                        backgroundColor: val
                      }
                    }}
                  />
                </div>
                <div>
                  <SpImagePicker v-model={vm.form['background']} />
                </div>
              </div>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.ffa588'),
        key: 'hotArea',
        defaultValue: null,
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['hasSetHotArea'] ? vm.$t('de51ee4c.44e607') : vm.$t('de51ee4c.fe2d26')}</div>
              <div style={{ display: 'flex', fontSize: '14px' }}>
                <div onClick={() => (vm.hotAreasDialogShow = true)}>
                  {vm.$t('de51ee4c.e366cc')}&nbsp;
                </div>
                <div
                  onClick={() => {
                    vm.hotArea = {
                      backImg: '',
                      padding: 20,
                      background: '#ffffff',
                      img: ''
                    }
                    vm.hasSetHotArea = false
                  }}
                >
                  {vm.$t('de51ee4c.7468f3')}
                </div>
              </div>
            </div>
          )
        }
      },
      // {
      //   label: '抽奖规则按钮',
      //   key: 'ruleBtnStyle',
      //   defaultValue: '',
      //   component({ key }, value) {
      //     return (
      //       <div class='inputWrap'>
      //         <div>{vm['ruleFormConfig']?.img ? '已设置' : '未设置'}</div>
      //         <div style={{ display: 'flex', fontSize: '14px' }}>
      //           <div onClick={() => (vm.ruleDialogShow = true)}>设置&nbsp;</div>
      //           <div
      //             onClick={() => {
      //               vm.ruleForm = {
      //                 rule: ['#000000', '#000000'],
      //                 img: ''
      //               }
      //             }}
      //           >
      //             恢复默认
      //           </div>
      //         </div>
      //       </div>
      //     )
      //   }
      // },
      {
        label: vm.$t('de51ee4c.e3f125'),
        key: 'recordBtnStyle',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['hasSetRecord'] ? vm.$t('de51ee4c.44e607') : vm.$t('de51ee4c.fe2d26')}</div>
              <div style={{ display: 'flex' }}>
                <div onClick={() => (vm.recordDialogShow = true)}>
                  {vm.$t('de51ee4c.e366cc')}&nbsp;
                </div>
                <div
                  onClick={() => {
                    vm.recordForm = {
                      rule: ['#ffffff', '#000000'],
                      img: ''
                    }
                    vm.hasSetRecord = false
                  }}
                >
                  {vm.$t('de51ee4c.7468f3')}
                </div>
              </div>
            </div>
          )
        }
      }
      // {
      //   label: '',
      //   key: 'lotteryMonitor',
      //   defaultValue: '',
      //   component(_) {
      //     return (
      //       <div class='lottery-editor-content'>
      //         <LuckyWheel ref='luckyWheelRef' config={vm.lotteryConfig} />
      //       </div>
      //     )
      //   }
      // }
    ],
    vm
  )

// 抽奖奖品配置（字段与 INT-01 prize_data 契约一致：name/type/value/probability/dailyStock/image/backgroundColor）
export const innerSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: vm.$t('de51ee4c.2f4aad'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        },
        visible: (row) => row?.type !== 'thanks'
      }
    ],
    columns: [
      {
        name: vm.$t('de51ee4c.a927ed'),
        key: 'name',
        width: '240px',
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          const isThanks = row['type'] === 'thanks'
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <el-input
                value={row['name']}
                style={{ width: '220px' }}
                maxLength={5}
                disabled={isThanks}
                on-input={(val) => vm.handleInput(val, row, $index, 'name')}
                show-word-limit
                placeholder={vm.$t('de51ee4c.f91e51')}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.df4f60'),
        key: 'probability',
        width: '190px',
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          return (
            <div>
              <el-input
                value={row['probability']}
                type='number'
                placeholder={vm.$t('de51ee4c.f9f5e4')}
                on-input={(val) => {
                  if (val > 100) {
                    vm.handleInput(99, row, $index, 'probability')
                  } else if (val <= 0) {
                    vm.handleInput(0, row, $index, 'probability')
                  } else {
                    vm.handleInput(Number(val)?.toFixed(0), row, $index, 'probability')
                  }
                }}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.b47382'),
        key: 'type',
        width: '300px',
        // Finder 默认 show-overflow-tooltip=true；奖品表含操作控件时易误触发溢出气泡。
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          const isThanks = row['type'] === 'thanks'
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={row['type']}>
              <el-select
                value={row['type']}
                placeholder={vm.$t('de51ee4c.708c9d')}
                style={{ width: '100px' }}
                disabled={isThanks}
                on-change={(val) => {
                  if (isThanks) return
                  vm.handleInput(val, row, $index, 'type')
                }}
              >
                {vm?.options?.map((item) => {
                  return (
                    <el-option label={item.label} value={item.value} key={item.value}></el-option>
                  )
                })}
              </el-select>
              {row['type'] == 'coupon' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['value']?.title}
                  <span
                    class='lottery-prize-select-btn'
                    onClick={() => vm.onCouponSubmit(row, $index, 'value')}
                  >
                    {vm.$t('de51ee4c.153fa6')}
                  </span>
                </div>
              )}
              {row['type'] == 'coupons' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['value']?.title}
                  <span
                    class='lottery-prize-select-btn'
                    onClick={() => vm.onCouponPackSubmit(row, $index, 'value')}
                  >
                    {vm.$t('de51ee4c.153fa6')}
                  </span>
                </div>
              )}
              {row['type'] == 'points' && (
                <el-input
                  value={row['value']}
                  on-input={(val) => vm.handleInput(val, row, $index, 'value')}
                  style={{ width: '80px', marginLeft: '4px' }}
                />
              )}
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.924543'),
        key: 'dailyStock',
        width: '160px',
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          if (row['type'] == 'coupon' || row['type'] == 'coupons') {
            return (
              <div>
                <el-input
                  value={row['dailyStock']}
                  placeholder={vm.$t('de51ee4c.eb99be')}
                  on-input={(val) => {
                    if (val <= 0) {
                      vm.handleInput(0, row, $index, 'dailyStock')
                    } else if (
                      row.prize_detail?.['quantity'] &&
                      val > row.prize_detail?.['quantity']
                    ) {
                      vm.handleInput(row.prize_detail?.['quantity'], row, $index, 'dailyStock')
                    } else {
                      vm.handleInput(Number(val)?.toFixed(0), row, $index, 'dailyStock')
                    }
                  }}
                  type='number'
                />
              </div>
            )
          }
        }
      },
      {
        name: vm.$t('de51ee4c.bcc437'),
        key: 'backgroundColor',
        width: '80px',
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          return (
            <div>
              <el-color-picker
                value={row['backgroundColor']}
                on-change={(val) => vm.handleInput(val, row, $index, 'backgroundColor')}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.5bef5b'),
        key: 'image',
        width: '80px',
        'show-overflow-tooltip': false,
        render(_, { row, $index }) {
          return (
            <div class='imgWrap'>
              <SpImagePicker
                size='mini'
                value={row['image'] || ''}
                on-input={(val) => vm.handleInput(val, row, $index, 'image')}
              />
            </div>
          )
        }
      }
    ]
  })

// 抽奖区域
export const lotteryAreaSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.d74849'),
        key: 'backImg',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div key='backImg'>
              <SpImagePicker v-model={vm.hotArea['backImg']} />
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.841d77'),
        key: 'padding',
        required: true,
        defaultValue: 20,
        component(_) {
          return (
            <div key='padding'>
              <el-input v-model={vm.hotArea['padding']} type='number' />
              <div>{vm.$t('de51ee4c.631eda')}</div>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.3cccd8'),
        key: 'background',
        required: true,
        defaultValue: '#ffffff',
        component(_) {
          return (
            <div>
              <el-color-picker v-model={vm.hotArea['background']} />
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.da61d6'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.hotArea['img']} key='img' />
              <div>{vm.$t('de51ee4c.e128c7')}</div>
            </div>
          )
        }
      }
      // {
      //   label: '中奖抽奖图片',
      //   key: 'icon',
      //   required: true,
      //   defaultValue: '',
      //   component(_) {
      //     return <div>
      //       <SpImagePicker v-model={vm.hotArea['icon']} key='icon' />
      //       <div>建议尺寸 270px * 270px 像素</div>
      //     </div>
      //   }
      // }
    ],
    vm
  )

// 抽奖规则按钮
export const ruleFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.6ed535'),
        key: 'rule',
        required: true,
        defaultValue: ['#000000', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.ruleForm['rule'][0]} /> &nbsp;{vm.$t('de51ee4c.149f64')}
              &nbsp;
              <el-color-picker v-model={vm.ruleForm['rule'][1]} /> &nbsp;{vm.$t('de51ee4c.89ad37')}
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.47cf22'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.ruleForm['img']} />
              <div>{vm.$t('de51ee4c.974a1b')}</div>
            </div>
          )
        }
      }
    ],
    vm
  )

// 抽奖记录按钮
export const recordFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.6ed535'),
        key: 'rule',
        required: true,
        defaultValue: ['#ffffff', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.recordForm['rule'][0]} /> &nbsp;
              {vm.$t('de51ee4c.149f64')}&nbsp;
              <el-color-picker v-model={vm.recordForm['rule'][1]} /> &nbsp;
              {vm.$t('de51ee4c.89ad37')}
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.47cf22'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.recordForm['img']} />
              <div>{vm.$t('de51ee4c.974a1b')}</div>
            </div>
          )
        }
      }
    ],
    vm
  )
