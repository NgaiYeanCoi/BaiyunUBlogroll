#!/usr/bin/python
# -*- coding: UTF-8 -*-

__author__ = 'NgaiYeanCoi'

import feedparser
import json

def sortEntriesByUpdated(entries):
    '''按照updated时间排序'''
    return sorted(entries, key=lambda x: x['updated'], reverse=True)

def fetchBlogEntries(blogFeedUrls):
    '''聚合所有URL的RSS源'''
    all_entries = []
    for blogFeedUrl in blogFeedUrls:
        feed_data = feedparser.parse(blogFeedUrl)
        author_name = feed_data.feed.get('author', 'Unknown Author')  # 获取作者信息
        entries = feedparser.parse(blogFeedUrl)["entries"]
        for entry in entries:
            all_entries.append({
                "author": author_name,
                "title": entry["title"],
                "url": entry["link"].split("#")[0],
                "published": entry["published"].split("T")[0],
                "updated": entry["updated"].replace("T", " ").split(".")[0] if "updated" in entry else "",
            })
    return all_entries
def main():
    blogUrl =  [
    'https://blog.nyc1.xyz/atom.xml',
    'https://blog.canyie.top/atom.xml'
    # 在此输入可以添加更多博客的RSS链接
        ]
    jsonFilename = "./config.json"
    entries = fetchBlogEntries(blogUrl)
    sortedEntries = sortEntriesByUpdated(entries) #按照updated时间排序
    with open(jsonFilename, "w", encoding="utf-8") as f: #将RSS解析之后获取感兴趣的内容后写入到config.json文件中
        json.dump(sortedEntries, f, ensure_ascii=False, indent=4)
        print('写入完成')
if __name__=='__main__':
    main()