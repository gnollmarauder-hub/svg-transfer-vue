// TODO:判断切换config和命令行
const fs = require('fs')
const path = require('path')
const { pathList } = require('./config.js')
const desPath = path.resolve(__dirname, './男性-四肢SVG')
const genPath = path.resolve(__dirname, './man/images')

if (!fs.existsSync('./man')) fs.mkdirSync('./man')
if (!fs.existsSync('./man/images')) fs.mkdirSync('./man/images')
if (!Array.isArray(pathList)) {
  return
}
// 判断是否
pathList.forEach(bodyPart => {
  if (bodyPart.combine) {
    genEntry(bodyPart, true)
  } else {
    genEntry(bodyPart)
  }
})

function genEntry(bodyPart, mul) {
  if (!mul) {
    // 选中
    let svgBufferFromActive = String(fs.readFileSync(path.resolve(desPath, bodyPart.activePath)))
    genPng(svgBufferFromActive, toLine(`${bodyPart.fsName}Active`))
    const activeBase64 = replaceSvg(svgBufferFromActive, toLine(`${bodyPart.fsName}Active`))

    // 热区
    let svgBufferFromNormal = String(fs.readFileSync(path.resolve(desPath, bodyPart.normalPath)))
    const normalBase64 = replaceSvg(svgBufferFromNormal, toLine(`${bodyPart.fsName}`))

    // 生成vue
    const params = genVueStr(activeBase64, normalBase64, bodyPart.fsName, bodyPart.partName)
    console.log(params, '123424')
    renderVue(params.fsName, params.vueStr, params.gVueStr, params.partName)
  } else {
    const combineList = bodyPart.combineList
    const abc = combineList.map(item => {
      // 选中
      let svgBufferFromActive = String(fs.readFileSync(path.resolve(desPath, item.activePath)))
      genPng(svgBufferFromActive, toLine(`${item.fsName}Active`))
      const activeBase64 = replaceSvg(svgBufferFromActive, toLine(`${item.fsName}Active`))
      // 熱區
      let svgBufferFromNormal = String(fs.readFileSync(path.resolve(desPath, item.normalPath)))
      const normalBase64 = replaceSvg(svgBufferFromNormal, toLine(`${bodyPart.fsName}`))
      //生成
      return genVueStr(activeBase64, normalBase64, bodyPart.fsName, item.partName)
    })
    let gVueStr = ''
    let vueStr = ''
    abc.map(item => {
      gVueStr += item.gVueStr
      vueStr += item.vueStr
    })
    renderVue(bodyPart.fsName, vueStr, gVueStr, bodyPart.partName)
  }
}

//abc

function genPng(base64, pngName) {
  const reg = /xlink:href="(data:image\/[^;]+;base64[^"]+)(\S*)"/ig
  const base64List = base64.match(reg)
  const len = base64List.length
  base64List.forEach((svg, name, index) => {
    svg = svg.replace(/^xlink:href="/, '')
    svg = svg.replace(/"/, '')
    svg = svg.replace(/^data:image\/\w+;base64,/, '')
    let pngBuffer = Buffer.from(svg, 'base64')
    // console.log(pngBuffer, 'pngBuffer')
    fs.writeFile(`./man/images/${pngName}.png`, pngBuffer, function (err) {
      if (err) {
        console.log(`${pngName}.png生产失败`)
      } else {
        console.log(`${pngName}.png生产成功`)
      }
    })
  })
}

// 驼峰转换下划线
function toLine(name) {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function replaceSvg(base64, fsName) {
  const patternReg = /pattern-(\d*)/ig
  const imageReg = /image-(\d*)/ig
  const path = /path-(\d*)/ig
  const translateReg = /translate\(-\d*\.\d*, -\d*\.\d*\)/
  base64 = base64.replace(/xlink:href="(data:image\/[^;]+;base64[^"]+)(\S*)"/ig, `xlink:href="../images/${fsName}.png"`)
  base64 = base64.replace(patternReg, `${fsName}-pattern`)
  base64 = base64.replace(imageReg, `${fsName}-image`)
  base64 = base64.replace(translateReg, 'translate(-156.000000, -208.0000)')
  base64 = base64.replace(path, `${fsName}-path`)
  return base64
}

function genVueStr(aBase64, nBase64, fsName, partName) {
  const defsStr = aBase64.match(/<defs>([\s\S]*)<\/defs>/) || []
  const gStr = aBase64.match(/<g ([\s\S]*)>([\s\S]*)<\/g>/) || []
  const nDefsStr = nBase64.match(/<defs>([\s\S]*)<\/defs>/) || []
  const nGStr = nBase64.match(/<g ([\s\S]*)>([\s\S]*)<\/g>/) || []
  const vueStr = `
      <!--${partName}默认 -->
      ${nDefsStr[1] || ''}
      <!--${partName}选中 -->
      ${defsStr[1] || ''}
  `
  const gVueStr = `
    <!--${partName} 默认-->
    ${gStr[0]}
    <!--${partName} 选中-->
    ${nGStr[0]}
  `
  return {
    vueStr,
    gVueStr,
    fsName,
    partName
  }
}

function renderVue(fsName, vueStr, gVueStr, partName) {
  vueStr = `<template>
    <defs>
      ${vueStr}
    </defs>
</template>`
  gVueStr = `<template>
  <g
   id="${partName}"
  >
    ${gVueStr}
  </g>
</template>`
  fs.writeFileSync(`./man/defs/${toLine(fsName)}-defs.vue`, vueStr)
  fs.writeFileSync(`./man/g/${toLine(fsName)}-g.vue`, gVueStr)
}

function collection(path) {
  const abc = fs.readdirSync(path)
  let a = ''
  let b = 'export default ['
  const str = abc.forEach(item => {
    a += `import ${toHump(item).split('.')[0]} from './${item}'\n`
    b += `${toHump(item).split('.')[0]},`
  })
  b = `${b}]`
  fs.writeFileSync(`${path}index.js`, a + b)
}

function toHump(name) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
collection('./man/defs/')
collection('./man/g/')