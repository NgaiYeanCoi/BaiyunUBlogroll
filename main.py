#!/usr/bin/python
# -*- coding: UTF-8 -*-

__author__ = 'NgaiYeanCoi'

import feedparser
import json
import requests
import xml.etree.ElementTree as ET
import time
import markdown
from markdown.extensions.toc import TocExtension
from bs4 import BeautifulSoup


blogUrl = [
        'https://blog.nyc1.xyz/atom.xml',
        'https://blog.canyie.top/atom.xml'
        # 在此输入可以添加更多博客的RSS链接
    ]


def getUrlTitle(url):
    """
    爬取获取网页的title
    :param url: 网页地址
    :return: title
    """
    try:
        # 发送HTTP请求
        response = requests.get(url)
        # 确保请求成功
        response.raise_for_status()
        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        # 提取网页标题
        title = soup.title.string if soup.title else 'No title found'
        return title
    except requests.RequestException as e:
        return f"Error: {e}"

def convertMDtoHTML():
    """
    将config.json文件转换成HTML
    :return:
    """
    currentTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())  # 获取当前时间
    jsonFilename = "./config.json"
    htmlFilename = "./index.html"
    with open(jsonFilename, 'r', encoding='utf-8') as f:
        entries = json.load(f)
    css = """
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <style>
           body {
               font-family: Arial, sans-serif;
               background-color: #f9f9f9;
               padding: 20px;
               border-radius: 8px;
           }
           .container {
               display: flex;
           }
           .main-content {
               flex: 1;
               padding-right: 20px;
           }
		   .sidebar .title{
			   font-size: large;
    			font-weight: bolder;
    			margin-bottom: 0;
		   }
		   .sidebar a{
			font-size: 13px;
            height: 18px;
            line-height: 18px;
            color: rgb(153, 153, 153);
            word-break: break-all;
            text-overflow: ellipsis;
            overflow: hidden;
		   }
           .sidebar {
               margin: 20px;
               flex: 0 0 200px;
               padding: 10px;
               background-color: #fff;
               border-radius: 8px;
               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
           }
           .sidebar h2 {
               margin-top: 0;
           }
           .sidebar ul {
               list-style-type: none;
               padding: 0;
           }
           .sidebar li {
               margin-bottom: 5px;
           }
           </style>
       """

    # 侧边栏内容
    sidebarContent = "<div class='sidebar'><h2>BaiyunU列表</h2><ul>"
    for url in blogUrl:
        title = getUrlTitle(url)
        path = url
        path=path.split('/')
        sidebarContent += f"<p class='title'>{title}</p>"
        sidebarContent += f"<li><a href='https://{path[2]}'>https://{path[2]}</a></li>"
    sidebarContent += "</ul></div>"

    # Markdown内容
    markdownContent = f"# BaiyunU Blogroll\n\n - 更新时间:{currentTime}\n\n"
    for entry in entries:
        markdownContent += f"## [{entry['title']}]({entry['url']})\n"
        markdownContent += f"**作者:** {entry['author']}\n"
        markdownContent += f"**发表时间:** {entry['published']}\n"
        if entry['updated']:
            markdownContent += f"**更新时间:** {entry['updated']}\n"
        markdownContent += "\n"
    # 转换Markdown为HTML
    htmlContent = markdown.markdown(markdownContent, extensions=[TocExtension(baselevel=2)])
    # 合并CSS样式、侧边栏和HTML内容
    finalHtmlContent = f"{css}<div class='container'>{sidebarContent}<div class='main-content'>{htmlContent}</div></div></head>"

    with open(htmlFilename, 'w', encoding='utf-8') as f:
        f.write(finalHtmlContent)

def convertMD():
    """
    将config.json文件转换成markdown
    :return:
    """
    currentTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()) #获取当前时间
    jsonFilename="./config.json"
    markdownFilename= "./summary.md"
    with open (jsonFilename,'r' , encoding='utf-8') as f:
        entries = json.load(f)
    markdownContent = f"# BaiyunU Blogroll\n\n - 更新时间:{currentTime}\n\n"
    for entry in entries:
        markdownContent += f"## [{entry['title']}]({entry['url']})\n"
        markdownContent += f"**作者:** {entry['author']}\n"
        markdownContent += f"**发表时间:** {entry['published']}\n"
        if entry['updated']:
            markdownContent += f"**更新时间:** {entry['updated']}\n"
            markdownContent += "\n"
    with open(markdownFilename, 'w', encoding='utf-8') as f:
        f.write(markdownContent)

def checkWebsite(url):
    """
    判断网页访问是否正常&&判断XML是否有效
    :param url: 网页地址
    :return:
    """
    response = requests.get(url)
    try:
        if response.status_code == 200:
            pass
            root=ET.fromstring(response.content)
        else:
            raise requests.RequestException(f"{url}请求的网站访问错误")
    except ET.ParseError:
        raise ET.ParseError(f"{url}XML文件解析错误")

def fetchBlogEntries(blogFeedUrls):
    """
    聚合所有URL的RSS源
    :param: blogFeedUrls: 传入blog的网址
    :return: 按照updates时间排序好，返回entries列表
    """
    all_entries = []
    for blogFeedUrl in blogFeedUrls:
        print(f"正在写入{blogFeedUrl}中...")
        feedData = feedparser.parse(blogFeedUrl) #解析RSS
        authorName = feedData.feed.get('author', 'Unknown Author')  # 获取作者信息
        entries = feedparser.parse(blogFeedUrl)["entries"]
        for entry in entries:
            all_entries.append({
                "author": authorName,
                "title": entry["title"],
                "url": entry["link"].split("#")[0],
                "published": entry["published"].split("T")[0],
                "updated": entry["updated"].replace("T", " ").split(".")[0] if "updated" in entry else "",
            })
    return sorted(all_entries, key=lambda x: x['updated'], reverse=True)
def main():
    global blogUrl
    for check in blogUrl:
        checkWebsite(check)
    jsonFilename = "./config.json"
    entries = fetchBlogEntries(blogUrl)
    with open(jsonFilename, "w", encoding="utf-8") as f:  #将RSS解析之后将感兴趣的内容后写入到config.json文件中
        json.dump(entries, f, ensure_ascii=False, indent=4)
        print('写入完成')
if __name__ == '__main__':
    main()
    convertMD()
    convertMDtoHTML()

