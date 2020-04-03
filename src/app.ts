import fs from 'fs'
import path from 'path'
import request from './util/request'

import { MOVIE_LIST } from './const/index'
import MovieListParser from './parser/movieHeaven/movieListParser'

export interface Parser {
  parse: (html: string, filePath: string) => string
}

class App {
  private filePath = path.resolve(__dirname, '../data/movieList.json')

  constructor(private url: string, private parser: Parser) {
  }

  async initProcess() {
    try {
      // 获取网页信息
      const htmlRow = await this.getRowHtml()
      // 解析器解析
      const jsonContent = this.parser.parse(htmlRow, this.filePath)
      // 保存信息
      this.writeFile(jsonContent)
    } catch (error) {
      console.log(error)
    }
  }

  // 获取网页初始信息
  private async getRowHtml() {
    const html = await request(this.url)
    return html.text
  }

  // 写文件
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }
}

const parser = MovieListParser.getInstance()
const app = new App(MOVIE_LIST, parser)
app.initProcess()