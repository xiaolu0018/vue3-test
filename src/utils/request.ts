// http.ts
import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig, Method } from 'axios';
import { ElMessage } from 'element-plus'
import { API_BASE_URL } from '@/utils/contant';
import JSONbig from 'json-bigint';
const errorMap: Record<number, string> = {
  400: 'Bad Request',
  401: '登录已过期，请重新登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  500: '服务器内部错误'
}

const service: AxiosInstance = axios.create({
  // 自定义数据解析（重点）
  transformResponse: [function (data) {
    // 使用 json-bigint 替代原生 JSON.parse
    // 保留原始数据格式，避免精度丢失
    try {
      // console.log('response data before parse:', data)
      return JSONbig({
        storeAsString: true, // 大整数转换为字符串
        strict: true // 严格模式
      }).parse(data || '{}');
    } catch (err) {
      console.error('响应数据解析失败:', err);
      return data;
    }
  }]
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('tokenName');
    config.headers.Authorization = `Bearer ${token || ''}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('原始响应字符串:', response);
    if (response.status === 200) {
      const resData = response.data || {};
      const resCode = resData.code || 0;
      if (resCode !== 200 && resCode !== 0) {
        ElMessage.error((typeof resData?.data === 'string' && resData.data) || resData.message || resData.error || errorMap[resCode] || '未知错误');
        return Promise.reject(response);
      } else {
        return Promise.resolve(resData || {});
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error: AxiosError) => {
    console.error(error);
    if (error?.code === 'ECONNABORTED') {
      ElMessage.error('请求超时！')
    } else {
      const status = error?.response?.status || 500
      console.error('错误状态码:', status, status === 401);
      if (status === 401) {
        // 登录失效
        localStorage.removeItem('tokenName')
        window.location.href = '/#/login'
      }
      ElMessage.error(errorMap[status] || error?.message || '未知错误')
    }
    return Promise.reject(error)
  }
);

/* 封装核心方法 */
interface RequestConfig {
  url: string;
  method?: Method;
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  responseType?: 'arraybuffer' | 'blob'; // 新增响应类型支持
  rconfig?: AxiosRequestConfig;
}

const request = <T = any>(config: RequestConfig): Promise<T> => {
  return service.request({
    timeout: 5000,
    ...config,
    ...(config.rconfig || {}), // 允许外部传入自定义配置
    baseURL: API_BASE_URL,
    params: config.method?.toUpperCase() === 'GET' ? config.params : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
  });
};

/* 快捷方法封装 */
export const get = <T = any>(url: string, params?: object, data?: object, headers?: Record<string, string>): Promise<T> => {
  return request<T>({ url, method: 'GET', params: params || data, headers });
};

export const post = <T = any>(url: string, data?: object, headers?: Record<string, string>, rconfig?: AxiosRequestConfig): Promise<T> => {
  return request<T>({ url, method: 'POST', data, headers, rconfig });
};

/* 特殊场景封装（表单/文件上传） */
export const postForm = <T = any>(url: string, data: FormData): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const postUrlEncoded = <T = any>(url: string, data: object): Promise<T> => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => params.append(key, value));
  return request<T>({
    url,
    method: 'POST',
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

/* 文件导出方法 */
export const download = (config: RequestConfig): Promise<void> => {
  // 确保响应类型为blob
  const requestConfig: RequestConfig = {
    ...config,
    responseType: 'blob'
  };

  return new Promise((resolve, reject) => {
    request<Blob>(requestConfig)
      .then((response) => {
        // 处理文件下载
        handleFileDownload(response, config.headers);
        resolve();
      })
      .catch((error) => {
        // 错误处理
        ElMessage.error('文件导出失败，请稍后再试');
        reject(error);
      });
  });
};

/* 处理文件下载的辅助函数 */
function handleFileDownload(blob: Blob, headers?: Record<string, string>) {
  // 从响应头中获取文件名
  const fileName = getFileNameFromHeaders(headers);

  if (!fileName) {
    ElMessage.error('无法获取文件名称');
    return;
  }

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // 清理资源
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* 从响应头中提取文件名 */
function getFileNameFromHeaders(headers?: Record<string, string>): string | null {
  if (!headers) return 'test.xlsx';

  // 支持两种常见的文件名格式
  const contentDisposition = headers['content-disposition'] || headers['Content-Disposition'];
  if (contentDisposition) {
    // 解析格式: attachment; filename="export.xlsx"
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1].replace(/['"]/g, ''));
    }
  }

  // 默认文件名
  return `export_${new Date().getTime()}.xlsx`;
}

export default service;