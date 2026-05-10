/**
 * 请求处理器
 */

import { generateConfig } from './config-generator.js';
import { scanSpiders } from './spider-scanner.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    if (path === '/' || path === '/index.html') {
      return new Response(getHomePage(), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (path === '/config.json' || path === '/jiekou.json') {
      const config = await generateConfig(env);
      return new Response(JSON.stringify(config, null, 2), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    if (path === '/api/spiders') {
      const spiders = await scanSpiders(env);
      return new Response(JSON.stringify(spiders, null, 2), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    if (path === '/api/refresh') {
      const config = await generateConfig(env, true);
      return new Response(JSON.stringify({ success: true, message: '配置已刷新' }, null, 2), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
}

function getHomePage() {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniBox Spider Worker</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        .endpoint {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
        .endpoint h3 {
            margin-top: 0;
            color: #4CAF50;
        }
        code {
            background: #e8e8e8;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: "Courier New", monospace;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🕷️ OmniBox Spider Worker</h1>
        <p>自动聚合 OmniBox 爬虫脚本,生成 TVBox 配置文件</p>
        
        <div class="endpoint">
            <h3>📡 配置文件</h3>
            <p>获取 TVBox 格式的配置文件:</p>
            <p><a href="/config.json"><code>/config.json</code></a> 或 <a href="/jiekou.json"><code>/jiekou.json</code></a></p>
        </div>
        
        <div class="endpoint">
            <h3>🔍 爬虫列表</h3>
            <p>获取所有可用的爬虫脚本列表:</p>
            <p><a href="/api/spiders"><code>/api/spiders</code></a></p>
        </div>
        
        <div class="endpoint">
            <h3>🔄 刷新配置</h3>
            <p>强制刷新配置缓存:</p>
            <p><code>POST /api/refresh</code></p>
        </div>
        
        <div class="endpoint">
            <h3>📦 项目地址</h3>
            <p>爬虫脚本仓库: <a href="https://github.com/Silent1566/OmniBox-Spider" target="_blank">OmniBox-Spider</a></p>
        </div>
    </div>
</body>
</html>
  `;
}
