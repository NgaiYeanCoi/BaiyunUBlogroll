#!/usr/bin/python
# -*- coding: UTF-8 -*-

__author__ = 'NgaiYeanCoi'

import feedparser
import json
import requests
import xml.etree.ElementTree as ET
import time

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
    :param blogFeedUrls: 传入blog的网址
    :return:按照updates时间排序好，返回entries列表
    """
    all_entries = []
    for blogFeedUrl in blogFeedUrls:
        print(f"正在写入{blogFeedUrl}中...")
        feedData = feedparser.parse(blogFeedUrl) #解析RSS
        author_name = feedData.feed.get('author', 'Unknown Author')  # 获取作者信息
        entries = feedparser.parse(blogFeedUrl)["entries"]
        for entry in entries:
            all_entries.append({
                "author": author_name,
                "title": entry["title"],
                "url": entry["link"].split("#")[0],
                "published": entry["published"].split("T")[0],
                "updated": entry["updated"].replace("T", " ").split(".")[0] if "updated" in entry else "",
            })
    return sorted(all_entries, key=lambda x: x['updated'], reverse=True)
def main():
    blogUrl = [
        'https://blog.nyc1.xyz/atom.xml',
        'https://blog.canyie.top/atom.xml'
        # 在此输入可以添加更多博客的RSS链接
    ]
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

