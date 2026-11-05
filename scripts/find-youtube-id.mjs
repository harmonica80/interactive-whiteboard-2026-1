import https from 'https';

export async function searchYoutube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
        'Cookie': 'CONSENT=YES+1'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        const ids = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        resolve(ids);
      });
    }).on('error', () => resolve([]));
  });
}

export function checkYoutubeId(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve({ ok: true, status: 200, title: parsed.title, author: parsed.author_name });
          } catch {
            resolve({ ok: true, status: 200 });
          }
        } else {
          resolve({ ok: false, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });
  });
}

export async function findValidYoutubeId(query, retries = 3) {
  for (let r = 0; r <= retries; r++) {
    const ids = await searchYoutube(query);
    for (const id of ids.slice(0, 5)) {
      const check = await checkYoutubeId(id);
      if (check.ok) {
        return { id, title: check.title, author: check.author };
      }
    }
    if (r < retries) {
      await new Promise(res => setTimeout(res, 800 * (r + 1)));
    }
  }
  return null;
}

async function test() {
  const q = process.argv[2] || '莫札特 小夜曲';
  console.log(`Searching for: ${q}`);
  const result = await findValidYoutubeId(q);
  console.log('Result:', result);
}

if (process.argv[1] && process.argv[1].endsWith('find-youtube-id.mjs')) {
  test();
}
