// src/utils/ace-config.ts
import { getFileType } from '@/utils/fileIconMap'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-monokai'
import "ace-builds/src-noconflict/ext-searchbox"
import 'ace-builds/src-noconflict/mode-python'


// 语法检查
// import workerBaseUrl from "ace-builds/src-noconflict/worker-base?url";
// ace.config.setModuleUrl("ace/mode/base", workerBaseUrl);
// import workerPythonUrl from "ace-builds/src-noconflict/worker-python?url";
// ace.config.setModuleUrl("ace/mode/python_work", workerPythonUrl);



export const Default_Mode = 'python'
const fileAppendMap = {
  'py': 'python',
  'js': 'javascript',
  'c': 'c_cpp',
  'go': 'golang',
  'yml': 'yaml',
  'md': 'markdown',
  'ts': "tsx",
  'editconfig': 'markdown',
  'config': 'markdown',
  'mod': 'golang'
}


// const modeModules = {
//   [defaultModuleName]: () => import('ace-builds/src-noconflict/mode-text'),
//   python: () => import('ace-builds/src-noconflict/mode-python'),
//   javascript: () => import('ace-builds/src-noconflict/mode-javascript'),
//   json: () => import('ace-builds/src-noconflict/mode-json'),
//   markdown: () => import('ace-builds/src-noconflict/mode-markdown'),
//   xml: () => import('ace-builds/src-noconflict/mode-xml'),
//   yaml: () => import('ace-builds/src-noconflict/mode-yaml'),
//   sql: () => import('ace-builds/src-noconflict/mode-sql'),
//   ddl: () => import('ace-builds/src-noconflict/mode-sql'),
//   java: () => import('ace-builds/src-noconflict/mode-java'),
//   cpp: () => import('ace-builds/src-noconflict/mode-c_cpp'),
//   csharp: () => import('ace-builds/src-noconflict/mode-csharp'),
//   php: () => import('ace-builds/src-noconflict/mode-php'),
//   golang: () => import('ace-builds/src-noconflict/mode-golang'),
//   ruby: () => import('ace-builds/src-noconflict/mode-ruby'),
//   swift: () => import('ace-builds/src-noconflict/mode-swift'),
//   rust: () => import('ace-builds/src-noconflict/mode-rust'),
//   dart: () => import('ace-builds/src-noconflict/mode-dart'),
// }

// 通过文件名获取语言模式
export const getModeFromFileName = (fileName: string) => getFileMode(getFileType(fileName) || Default_Mode)

export const getFileMode = (fileAppend: string) => fileAppend ? (fileAppendMap[fileAppend as keyof typeof fileAppendMap] || fileAppend) : Default_Mode;

// 动态加载语言模式的函数
export const loadMode = async (lang: string) => {
  try {
    await import(`../../node_modules/ace-builds/src-noconflict/mode-${lang}.js`)
    return lang
  } catch (error) {
    console.error(`无法加载语言模式：${lang}`, error)
    return Default_Mode
  }
}