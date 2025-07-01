// src/types/scss-export.d.ts

declare module '*.module.scss' {
  const scssVars: {
    // 根据你的 SCSS :export 块中的变量补充类型（示例）
    sideWidth: string;
    bigSideWidth: string;
    headerHeight: string;
    baseColor: string;
    grayColor: string;
    primaryColor: string;
    activeColor: string;
    dangerColor: string;
    warningColor: string;
    successColor: string;

    [key: string]: string;
  };
  export default scssVars;
}