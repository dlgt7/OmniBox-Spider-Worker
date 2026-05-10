/**
 * 爬虫元数据解析器
 * 从爬虫脚本中提取元信息
 */

export function parseSpiderMetadata(content, filename) {
  const metadata = {
    name: '',
    author: '',
    description: '',
    version: '',
    dependencies: [],
  };

  // 解析 @name
  const nameMatch = content.match(/\/\/\s*@name\s+(.+)/);
  if (nameMatch) {
    metadata.name = nameMatch[1].trim();
  } else {
    // 从文件名提取
    metadata.name = filename.replace(/\.(js|py)$/, '');
  }

  // 解析 @author
  const authorMatch = content.match(/\/\/\s*@author\s+(.+)/);
  if (authorMatch) {
    metadata.author = authorMatch[1].trim();
  }

  // 解析 @description
  const descMatch = content.match(/\/\/\s*@description\s+(.+)/);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }

  // 解析 @version
  const versionMatch = content.match(/\/\/\s*@version\s+(.+)/);
  if (versionMatch) {
    metadata.version = versionMatch[1].trim();
  }

  // 解析 @dependencies
  const depsMatch = content.match(/\/\/\s*@dependencies\s+(.+)/);
  if (depsMatch) {
    metadata.dependencies = depsMatch[1].split(',').map(d => d.trim()).filter(d => d);
  }

  // 检查是否支持刮削
  metadata.supportsScraping = content.includes('processScraping') || 
                               content.includes('getScrapeMetadata');

  // 检查是否支持弹幕
  metadata.supportsDanmu = content.includes('matchDanmu') || 
                           content.includes('getDanmaku');

  // 检查是否支持播放记录
  metadata.supportsHistory = content.includes('addPlayHistory');

  return metadata;
}
