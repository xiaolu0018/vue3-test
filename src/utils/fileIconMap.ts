const fileIcon = 'mdi:file'; // Default icon for unknown file types
export const folderIcon = 'mdi:folder'; // Icon for folders
export const folderOpenIcon = 'mdi:folder-open'; // Icon for open folders

export const AcceptedFileTypes = [".txt", ".py", ".go", ".cpp", ".java", ".c", ".yaml", ".yml", ".xml", ".sql", ".ddl", ".csv", ".mdx"] // Accepted file types for upload

export enum UaIconMapEnum {
  'folder' = 'mdi:folder',
  'folder-open' = 'mdi:folder-open',
  'txt' = 'mdi:calendar-text',
  'png' = 'mdi:file-png-box',
  'py' = 'mdi:language-python-text',
  'python' = 'mdi:language-python-text',
  'js' = 'mdi:language-javascript',
  'json' = 'mdi:json',
  'html' = 'mdi:language-html5',
  'htm' = 'mdi:language-html5',
  'vue' = 'mdi:vuejs',
  'jsx' = 'mdi:language-javascript',
  'css' = 'mdi:language-css3',
  'ts' = 'mdi:language-typescript',
  'tsx' = 'mdi:language-typescript',
  'scss' = 'mdi:language-sass',
  'less' = 'mdi:language-less',
  'sass' = 'mdi:language-sass',
  'java' = 'mdi:language-java',
  'c' = 'mdi:language-c',
  'h' = 'mdi:language-c',
  'hpp' = 'mdi:language-cpp',
  'hxx' = 'mdi:language-cpp',
  'cxx' = 'mdi:language-cpp',
  'cc' = 'mdi:language-cpp',
  'cpp' = 'mdi:language-cpp',
  'csharp' = 'mdi:language-csharp',
  'php' = 'mdi:language-php',
  'go' = 'mdi:language-go',
  'ruby' = 'mdi:language-ruby',
  'swift' = 'mdi:language-swift',
  'rust' = 'mdi:language-rust',
  'dart' = 'mdi:language-dart',
  'kotlin' = 'mdi:language-kotlin',
  'sql' = 'mdi:database',
  'ddl' = 'mdi:database',
  'yaml' = 'mdi:language-yaml',
  'yml' = 'mdi:language-yaml',
  'markdown' = 'mdi:markdown',
  'mdx' = 'mdi:markdown',
  'xml' = 'mdi:language-xml',
  'csv' = 'mdi:file-table',
  'jpg' = 'mdi:file-jpg-box',
  'jpeg' = 'mdi:file-jpg-box',
  'gif' = 'mdi:file-gif-box',
  'svg' = 'mdi:file-svg',
  'webp' = 'mdi:file-webp',
  'bmp' = 'mdi:file-bmp',
  'ico' = 'mdi:file-image',
  'tiff' = 'mdi:file-tiff',
  'tif' = 'mdi:file-tiff',
  'mp3' = 'mdi:file-music',
  'wav' = 'mdi:file-music',
  'flac' = 'mdi:file-music',
  'aac' = 'mdi:file-music',
  'ogg' = 'mdi:file-music',
  'mp4' = 'mdi:file-video',
  'avi' = 'mdi:file-video',
  'mkv' = 'mdi:file-video',
  'md' = 'mdi:markdown',
  'pdf' = 'mdi:file-pdf-box',
  'doc' = 'mdi:file-document',
  'docx' = 'mdi:file-document',
  'xls' = 'mdi:file-excel',
  'xlsx' = 'mdi:file-excel',
  'ppt' = 'mdi:file-powerpoint',
  'pptx' = 'mdi:file-powerpoint',
  'zip' = 'mdi:file-archive',
  'rar' = 'mdi:file-archive',
  'tar' = 'mdi:file-archive',
  'gz' = 'mdi:file-archive',
  '7z' = 'mdi:file-archive',
  'exe' = 'mdi:file-exe',
  'bat' = 'mdi:file-exe',
  'sh' = 'mdi:file-sh',
  'apk' = 'mdi:file-android',
  'iso' = 'mdi:file-iso',
  'dll' = 'mdi:file-dll',
  'bin' = 'mdi:file-binary',
  'class' = 'mdi:file-class',
  'log' = 'mdi:file-log',
  'tmp' = 'mdi:file-temp',
  // Add more file types and their corresponding icons as needed
};

export type UaFileType = keyof typeof UaIconMapEnum;
export type UaFileIconType = `${UaIconMapEnum}` | typeof fileIcon;
export interface FileNode {
  id: string
  label: string
  children?: FileNode[]
  isEditing?: boolean
  showActions?: boolean
}
export interface FileTreeNode extends FileNode {
  iconType: UaFileIconType
  fileType: UaFileType
  children?: FileTreeNode[]
}
export const getFileType = (fileName: string): UaFileType => fileName.split('.').pop() as UaFileType;

export const getfileAndIconType = (fileName: string, isLeaf: boolean): {
  iconType: UaFileIconType
  fileType: UaFileType
} => {
  if (!isLeaf) {
    return {
      fileType: 'folder',
      iconType: folderIcon
    }
  }
  const fileType = getFileType(fileName);
  return {
    fileType,
    iconType: fileType ? (UaIconMapEnum[fileType as keyof typeof UaIconMapEnum] || fileIcon) : fileIcon
  }
}
// export const formateFileTreeIcon = (fileNode: FileNode[]): FileTreeNode[] => fileNode.map((node) => {
//   const children = node.children;
//   const fileType = children ? 'folder' : getFileType(node.label) as UaFileType;
//   const iconType = children ? folderIcon : getfileIcon(node.label);
//   return {
//     ...node,
//     iconType,
//     fileType,
//     children: children ? formateFileTreeIcon(children) : undefined,
//   };
// });