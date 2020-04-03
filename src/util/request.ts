const charset = require('superagent-charset');
const superagent = charset(require('superagent'));

const request = (url: string, charset: string = 'gb2312'): Promise<any> => {
  const promise = new Promise((resolve, reject) => {
    superagent(url).charset(charset).end((err: any, res: any) => {
      res && resolve(res)
      err && reject(err)
    })
  })
  return promise
}

export default request