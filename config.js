exports.pathList = [
  {
    activePath: './膀胱.svg',
    normalPath: './膀胱路径.svg',
    fsName: 'gladder',
    partName: '膀胱'
  },
  {
    activePath: './大肠.svg',
    normalPath: './大肠路径.svg',
    fsName: 'bigIntestine',
    partName: '大肠'
  },
  {
    activePath: './胆囊.svg',
    normalPath: './胆囊路径.svg',
    fsName: 'gallbladder',
    partName: '胆囊'
  },
  {
    activePath: './肺.svg',
    normalPath: './肺.svg',
    fsName: 'lung',
    partName: '肺'
  },
  {
    combine: true,
    fsName: 'lowerLimb',
    partName: '下肢',
    combineList: [
      {
        activePath: './右小腿.svg',
        normalPath: './右小腿路径.svg',
        partName: '右小腿',
        fsName: 'rightLeg'
      },
      {
        activePath: './左脚.svg',
        normalPath: './左脚路径.svg',
        partName: '左腳',
        fsName: 'leftFoot'
      },
      {
        activePath: './左大腿.svg',
        normalPath: './左大腿热区.svg',
        partName: '左大腿',
        fsName: 'leftThigh'
      }
    ]
  }
]
