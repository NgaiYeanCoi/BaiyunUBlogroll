import json
import time
def main():
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

if __name__ == '__main__':
    main()