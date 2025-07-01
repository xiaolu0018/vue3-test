import * as XLSX from 'xlsx';
/**
 * 将二维数组数据导出为XLSX格式文件
 * @param data - 二维数组数据，例如 [["姓名","年龄"],["张三",25]]
 * @param filename - 导出文件名，默认为"新建文件"
 */
export const exportToCsv = (data: Array<Array<any>>, filename: string = '新建文件') => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data); // data为二维数组，如[["姓名","年龄"],["张三",25]]

  // 添加工作表并导出
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};


// 导出为TXT
export const exportToTxt = (data: string = '', filename: string = '新建文件') => {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export const copyToClip = async (data: string = '') => {
  await navigator.clipboard.writeText(data)
}