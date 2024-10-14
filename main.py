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
from wordcloud import WordCloud



blogUrl = [
        'https://blog.nyc1.xyz/atom.xml',
        'https://blog.canyie.top/atom.xml',
        'https://simuleite.github.io/atom.xml',
        'https://my.toho.red/index.xml'
        # 在此输入可以添加更多博客的RSS链接
    ]

jsonFilename="./config.json"

def creatWordCloud():
    """
    :return:
    """
    #读取摘要信息
    txt=""
    with open (jsonFilename,'r' , encoding='utf-8') as f:
        entries = json.load(f)
    with open("./stopwords/cn_stopwords.txt", 'r', encoding='utf-8') as f:
        stopwordsFile = set(f.read().splitlines())
    #print(stopwordsFile)
    for entry in entries:
        txt = txt+f"{entry['summary']}\n"
    #print(txt)
    wordcloud=WordCloud(font_path="./Fonts/msyh.ttc", width=800, height=600, margin=10,
          ranks_only=None, prefer_horizontal=0.95, mask=None, scale=1,
          color_func=None, max_words=200, min_font_size=10,
          stopwords=stopwordsFile, random_state=82, background_color='white',
          max_font_size=100, font_step=2, mode="RGBA",
          relative_scaling='auto', regexp=None, collocations=True,
          colormap='viridis', normalize_plurals=True, contour_width=1,
          contour_color='steelblue', repeat=False,
          include_numbers=False, min_word_length=2, collocation_threshold=30) # 创建词云实例对象
    wordcloud.generate(txt)# 加载文本内容到词云对象中
    wordcloud.to_file("wordcloud.png")# 将图像以定义的图像文件名输出



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
    head = """
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BaiyunU Blogroll</title>
    <style type="text/css">
       """
    with open("./index.css", 'r', encoding='utf-8') as f:
        css = f.read()
    # 侧边栏内容
    Github="""
    <a id="Github" target="_blank" href="https://github.com/NgaiYeanCoi/BaiyunUBlogroll">
    <span id="GithubText">GitHub</span><img id="logo-github" src="./images/github.c12ec768.png" alt="Logo">
    </a>
    """
    sidebarContent = "<div class='sidebar' style='margin:10px;'><ul>"
    for url in blogUrl:
        title = getUrlTitle(url)
        path = url
        path=path.split('/')
        sidebarContent += f"<p class='title'>{title}</p>"
        sidebarContent += f"<li><a target='_blank' href='https://{path[2]}'>https://{path[2]}</a></li>"
    sidebarContent += f"{Github}</ul></div>"

    # Markdown内容
    markdownContent = f"# BaiyunU Blogroll\n\n - 更新时间:{currentTime}\n\n"
    for entry in entries:
        markdownContent += f"## <a href=\"{entry['url']}\" target=\"_blank\">{entry['title']}</a>\n"
        #markdownContent += f"## [{entry['title']}]({entry['url']})\n"
        markdownContent += f"**摘要:** {entry['summary']}\n\n"
        markdownContent += f"**作者:** {entry['author']}\n"
        markdownContent += f"**发表时间:** {entry['published']}\n"
        if entry['updated']:
            markdownContent += f"**更新时间:** {entry['updated']}\n"
        markdownContent += "\n"
    # 转换Markdown为HTML
    htmlContent = markdown.markdown(markdownContent, extensions=[TocExtension(baselevel=2)])
    # 合并CSS样式、侧边栏和HTML内容
    finalHtmlContent = f"{head}{css}</style><div class='container'>{sidebarContent}<div class='main-content'>{htmlContent}</div></div></head>"

    with open(htmlFilename, 'w', encoding='utf-8') as f:
        f.write(finalHtmlContent)

def convertMD():
    """
    将config.json文件转换成markdown
    :return:
    """
    currentTime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()) #获取当前时间
    markdownFilename= "./summary.md"
    with open (jsonFilename,'r' , encoding='utf-8') as f:
        entries = json.load(f)
    markdownContent = f"# BaiyunU Blogroll\n\n - 更新时间:{currentTime}\n\n"
    for entry in entries:
        markdownContent += f"## [{entry['title']}]({entry['url']})\n"
        markdownContent += f"**作者:** {entry['author']}\n"
        markdownContent += f"**发表时间:** {entry['published']}\n\n"
        markdownContent += f"**摘要:** {entry['summary']}\n"
        if entry['updated']:
            markdownContent += f"\n**更新时间:** {entry['updated']}\n"
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
    allEntries = []
    for blogFeedUrl in blogFeedUrls:
        print(f"正在写入{blogFeedUrl}中...")
        feedData = feedparser.parse(blogFeedUrl) #解析RSS
        authorName = feedData.feed.get('author', getUrlTitle(blogFeedUrl))  # 获取作者信息
        entries = feedparser.parse(blogFeedUrl)["entries"]
        for entry in entries:
            summaryHtml = entry["summary"]
            summaryText = BeautifulSoup(summaryHtml, 'html.parser').get_text(strip=True)  # 提取Summary摘要纯文本内容
            allEntries.append({
                "author": authorName,
                "title": entry["title"],
                "url": entry["link"].split("#")[0],
                "summary": summaryText,
                "published": entry["published"].split("T")[0],
                "updated": entry["updated"].replace("T", " ").split(".")[0] if "updated" in entry else "",
            })
    return sorted(allEntries, key=lambda x: x['updated'], reverse=True)

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
    creatWordCloud()

