
interface ExportFileParams<T> {
  url: string;
  data?: T; // 支持泛型请求参数
  fileName?: string; // 可选手动文件名
  fileType?: string; // 默认 application/octet-stream
}

/**
 * 封装fetch导出文件方法
 * @param {ExportFileParams} params 请求参数
 * @returns {Promise<void>}
 */
export async function exportFile<T = Record<string, any>>(
  params: ExportFileParams<T>
): Promise<void> {
  const { url, data, fileName, fileType = 'application/octet-stream' } = params;

  try {
    // 1. 发起POST请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 示例认证
      },
      body: JSON.stringify(data),
    });

    // 2. 错误处理
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // throw new Error(errorData?.message || `导出失败: ${response.statusText}`);
      throw new Error(errorData?.error || errorData?.message || `导出失败: ${response.statusText}`);
    }

    // 3. 解析文件名（优先级：手动指定 > 响应头 > 默认）
    let finalFileName = fileName;
    if (!finalFileName) {
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition?.includes('filename=')) {
        finalFileName = decodeURIComponent(
          contentDisposition.split('filename=')[1].replace(/['"]/g, '')
        );
      } else {
        finalFileName = `export_${new Date().getTime()}`;
      }
    }

    // 4. 创建Blob并下载
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(
      new Blob([blob], { type: fileType })
    );

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalFileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // 5. 清理资源
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error('文件导出失败:', error);
    throw error; // 向上传递错误
  }
}