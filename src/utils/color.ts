/**
 * 生成高对比度明亮颜色数组
 * @param {number} length - 需要的颜色数量
 * @param {boolean} [useECharts=false] - 是否使用 ECharts 的 graphic 方法
 * @returns {Array<string>} 颜色数组
 */
export function generateColorArray(length: number) {
  // 基础明亮颜色模板
  const baseColors = [
    'rgba(52, 152, 219, 0.8)',  // 蓝色
    'rgba(46, 204, 113, 0.8)',  // 绿色
    'rgba(230, 126, 34, 0.8)',  // 橙色
    'rgba(155, 89, 182, 0.8)',  // 紫色
    'rgba(231, 76, 60, 0.8)',   // 红色
    'rgba(241, 196, 15, 0.8)',  // 黄色
    'rgba(26, 188, 156, 0.8)',  // 青色
    'rgba(149, 165, 166, 0.8)'  // 灰色
  ];
  try {
    // 如果需要的长度小于等于基础颜色数量，直接返回前length个颜色
    if (length && length <= baseColors.length) {
      if (length === 1) {
        // 返回随机颜色
        return [baseColors[Math.floor(Math.random() * baseColors.length)]];
      }
      return baseColors.slice(0, length);
    } else if (!length) {
      return baseColors;
    }

    // 长度超过基础颜色数量时的处理
    // 通过 HSV 算法生成高对比度明亮颜色
    const colors = [];
    for (let i = 0; i < length; i++) {
      // 在 HSV 空间均匀分布色调，保持高饱和度和亮度
      const hue = (i * 360 / length) % 360;
      const rgb = hsvToRgb(hue, 0.85, 0.95); // 饱和度0.85，亮度0.95
      colors.push(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`);
    }
    return colors;
    // 使用 ECharts 的 graphic 方法生成高对比度颜色
    // if (useECharts && typeof echarts !== 'undefined' && echarts.graphic) {
    //   // 使用 ECharts 的 HSV 颜色空间生成高对比度颜色
    //   const colors = [];
    //   for (let i = 0; i < length; i++) {
    //     // 在 HSV 空间均匀分布色调，保持高饱和度和亮度
    //     const hue = (i * 360 / length) % 360;
    //     const color = echarts.color.hsv2rgb(hue, 0.85, 0.95); // 饱和度0.85，亮度0.95
    //     colors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`);
    //   }
    //   return colors;
    // }
  } catch (error) {
    console.error('获取颜色失败:', error);
    return baseColors;
  }


}

/**
 * HSV 转 RGB 辅助函数
 * @param {number} h - 色调 (0-360)
 * @param {number} s - 饱和度 (0-1)
 * @param {number} v - 亮度 (0-1)
 * @returns {Array<number>} RGB 值数组 [r, g, b]
 */
export function hsvToRgb(h: number, s: number, v: number) {
  h = h / 360;
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return [Math.round(r! * 255), Math.round(g! * 255), Math.round(b! * 255)];
}