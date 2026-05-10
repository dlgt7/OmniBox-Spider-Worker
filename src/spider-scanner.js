/**
 * 爬虫脚本扫描器
 * 从 GitHub API 获取爬虫脚本列表
 */

import { parseSpiderMetadata } from './metadata-parser.js';

export async function scanSpiders(env) {
  const spiders = [];
  const categories = [
    '影视/采集',
    '影视/网盘',
    '影视/磁力',
    '影视/解析',
    '动漫',
    '听书',
    '音乐',
    '教育',
    '直播',
    '短剧',
    '综合',
    '导航',
    '流媒体',
    'Emby',
  ];

  for (const category of categories) {
    try {
      const categorySpiders = await scanCategory(env, category);
      spiders.push(...categorySpiders);
    } catch (error) {
      console.error(`Error scanning category ${category}:`, error);
    }
  }

  return spiders;
}

async function scanCategory(env, category) {
  const spiders = [];
  
  try {
    const baseUrl = env.SPIDER_REPO_URL || 'https://github.com/dlgt7/OmniBox-Spider';
    
    // 从 GitHub API 获取目录内容
    const apiUrl = `https://api.github.com/repos/dlgt7/OmniBox-Spider/contents/${encodeURIComponent(category)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'OmniBox-Spider-Worker',
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      console.log(`Failed to fetch ${category}: ${response.status}`);
      return spiders;
    }
    
    const files = await response.json();
    
    if (!Array.isArray(files)) {
      return spiders;
    }
    
    // 过滤 .js 和 .py 文件
    const scriptFiles = files.filter(file => 
      file.name.endsWith('.js') || file.name.endsWith('.py')
    );
    
    for (const file of scriptFiles) {
      spiders.push({
        name: file.name.replace(/\.(js|py)$/, ''),
        category: category,
        file: file.name,
        path: `${category}/${file.name}`,
        url: `https://raw.githubusercontent.com/dlgt7/OmniBox-Spider/main/${category}/${file.name}`,
        downloadUrl: `https://gh-proxy.org/https://raw.githubusercontent.com/dlgt7/OmniBox-Spider/main/${category}/${file.name}`,
      });
    }
  } catch (error) {
    console.error(`Error scanning category ${category}:`, error);
  }
  
  return spiders;
}
