export const setProperty = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val);
};

export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
  let color = '#';
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16);
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16);
    const c = Math.round(c1 * weight + c2 * (1 - weight));
    color += c.toString(16).padStart(2, '0');
  }
  return color;
};

export function escapeRegExp(str: string) {
  // 转义所有正则特殊字符（包括 /）
  return str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  // 解释：
  // [.*+?^${}()|[\]\\/] 匹配所有正则特殊字符和 /
  // \\$& 表示将匹配到的字符前添加反斜杠转义（如 / → \/）
}

// 驼峰命名转为 kebab-case
export function camelToKebab(str: string) {
  if (typeof str !== 'string') return '';

  return str
    // 1. 替换所有空格为中划线
    .replace(/\s+/g, '-')
    // 2. 处理驼峰：在非开头的大写字母前插入中划线
    .replace(/(?<!^)([A-Z])/g, '-$1')
    // 3. 统一转小写
    .toLowerCase()
    // 4. 移除开头的中划线（如果有）
    .replace(/^-+/, '')
    // 5. 合并连续的中划线（如多个空格或驼峰连续大写导致的重复）
    .replace(/-+/g, '-');
}

// uuid
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
/**
 * 密钥生成配置类型声明
 */
interface GenerationConfig {
  keyType?: string;        // 密钥类型（例如：'school'）
  useLetters?: boolean;   // 是否包含字母
  letterCase?: 'uppercase' | 'lowercase' | 'mixed'; // 字母大小写模式
  useNumbers?: boolean;    // 是否包含数字
  numberCount?: number;    // 最少数字个数
  useSymbols?: boolean;    // 是否包含符号
  symbolChars?: string;    // 允许使用的符号字符
  usePrefix?: boolean;     // 是否使用前缀
  prefix?: string;         // 密钥前缀内容
  length?: number;         // 密钥总长度
  separator?: string;      // 分隔符字符
  group_size?: number;      // 分组长度
}

/**
 * 生成单个密钥的优化实现（参数边界安全处理）
 * 默认逻辑：始终包含字母（即使未勾选 useLetters 也会包含）
 *
 * @param {GenerationConfig} config - 密钥生成配置（带边界安全处理）
 * @returns {string} 生成的密钥
 * @throws {Error} 当配置无效时抛出错误
 */
export function generateKeyWithConfig(config: GenerationConfig = {}): string {
  // 1. 参数边界安全处理（设置默认值并验证参数）
  const safeConfig = {
    keyType: config.keyType || 'school',
    useLetters: config.useLetters !== false, // 默认包含字母
    letterCase: ['uppercase', 'lowercase', 'mixed'].includes(config.letterCase || '')
      ? config.letterCase
      : 'uppercase', // 默认大写
    useNumbers: config.useNumbers !== false, // 默认包含数字
    numberCount: Math.max(0, config.numberCount || 0), // 确保非负
    useSymbols: config.useSymbols || false,
    symbolChars: config.symbolChars || '',
    usePrefix: config.usePrefix !== false, // 默认使用前缀
    prefix: config.prefix || '',
    length: Math.max(4, config.length || 12), // 最小长度4
    separator: config.separator || '',
    group_size: Math.max(1, config.group_size || 4) // 最小分组1
  };

  // 2. 准备字符集 - 默认包含字母（即使未勾选 useLetters 也会包含）
  let chars = '';
  let nonDigitChars = '';

  // 字母处理逻辑（始终包含）
  switch (safeConfig.letterCase) {
    case 'uppercase':
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      nonDigitChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    case 'lowercase':
      chars += 'abcdefghijklmnopqrstuvwxyz';
      nonDigitChars += 'abcdefghijklmnopqrstuvwxyz';
      break;
    case 'mixed':
    default:
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      nonDigitChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      break;
  }

  // 数字处理逻辑（可选）
  if (safeConfig.useNumbers) {
    chars += '0123456789';
  }

  // 符号处理逻辑（可选）
  if (safeConfig.useSymbols && safeConfig.symbolChars) {
    // 过滤掉字母和数字，避免重复
    const symbolSet = new Set(safeConfig.symbolChars.split(''));
    const validSymbols = Array.from(symbolSet).filter(char =>
      !/[a-zA-Z0-9]/.test(char)
    ).join('');

    chars += validSymbols;
    nonDigitChars += validSymbols;
  }

  // 3. 确保字符集不为空
  if (chars.length === 0) {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    nonDigitChars = chars;
  }

  // 4. 计算密钥主体长度（不包括前缀）
  const prefixLength = safeConfig.usePrefix ? safeConfig.prefix.length : 0;
  let keyLength = safeConfig.length - prefixLength;

  // 5. 验证密钥主体长度
  if (keyLength <= 0) {
    // 自动调整：增加密钥长度以容纳前缀
    keyLength = Math.max(4, prefixLength + 4) - prefixLength;
  }

  // 6. 处理数字数量要求
  const actualNumberCount = Math.min(
    safeConfig.numberCount,
    Math.max(0, keyLength - 1) // 至少保留一个非数字位置
  );

  let keyBody = '';

  // 添加指定数量的数字
  if (safeConfig.useNumbers && actualNumberCount > 0) {
    for (let i = 0; i < actualNumberCount; i++) {
      keyBody += '0123456789'.charAt(Math.floor(Math.random() * 10));
    }
  }

  // 7. 填充剩余字符（确保包含非数字字符）
  const remainingLength = keyLength - actualNumberCount;
  if (remainingLength > 0) {
    for (let i = 0; i < remainingLength; i++) {
      // 在非数字字符集中随机选择
      keyBody += nonDigitChars.charAt(Math.floor(Math.random() * nonDigitChars.length));
    }
  }

  // 8. 打乱字符顺序
  keyBody = keyBody.split('').sort(() => Math.random() - 0.5).join('');

  // 9. 添加前缀
  let finalKey = safeConfig.usePrefix ? safeConfig.prefix + keyBody : keyBody;

  // 10. 添加分隔符（处理边界情况）
  if (safeConfig.group_size > 0) {
    // 计算实际分组大小（确保不超过密钥长度）
    const group_size = Math.min(safeConfig.group_size, finalKey.length);

    // 仅当分组有意义时添加分隔符
    if (group_size > 1 && group_size < finalKey.length) {
      const regex = new RegExp(`.{1,${group_size}}`, 'g');
      const matchResult = finalKey.match(regex);
      if (matchResult) {
        finalKey = matchResult.join(safeConfig.separator || '');
      } else {
        finalKey = finalKey;
      }
    }
  }

  return finalKey;
}

export function isValidNumber(value: any) {
  // 检查是否为数字类型（包括原始值和包装对象）
  const isNumber = typeof value === 'number' || value instanceof Number;

  // 排除 NaN（NaN 是唯一不等于自身的值）
  return isNumber && value === value;
}