/**
 * 爬虫脚本扫描器
 * 扫描本地爬虫脚本目录并提取元信息
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
    const categorySpiders = await scanCategory(env, category);
    spiders.push(...categorySpiders);
  }

  return spiders;
}

async function scanCategory(env, category) {
  const spiders = [];
  
  try {
    const baseUrl = env.SPIDER_REPO_URL || 'https://github.com/dlgt7/OmniBox-Spider';
    const localPath = env.SPIDER_REPO_LOCAL;
    
    if (localPath) {
      // 本地扫描模式
      const fs = require('fs');
      const path = require('path');
      const categoryPath = path.join(localPath, category.replace(/\//g, path.sep));
      
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath);
        
        for (const file of files) {
          if (file.endsWith('.js') || file.endsWith('.py')) {
            const filePath = path.join(categoryPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const metadata = parseSpiderMetadata(content, file);
            
            if (metadata) {
              spiders.push({
                ...metadata,
                category: category,
                file: file,
                path: `${category}/${file}`,
                url: `${baseUrl}/raw/main/${category}/${file}`,
              downloadUrl: `https://gh-proxy.org/https://github.com/dlgt7/OmniBox-Spider/raw/main/${category}/${file}`,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning category ${category}:`, error);
  }
  
  return spiders;
}
