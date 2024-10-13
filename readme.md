# BaiyunUBlogroll

广东白云学院Blogroll，是一个用于聚合多个博客RSS源的Python脚本。  


## 介绍
搭配Github WorkFlow每天北京时间0:30自动抓取指定博客的RSS源，解析并提取相关信息转换成json配置文件方便处理，后将json转换成Markdown生成HTML静态网页。  

该项目还在建设当中，欢迎你们提交Pull Request或Issues与我一起维护这个项目。

## 配置文件
- `index.css` 用于存储静态网页层叠样式表
- `config.json`用于存储博客RSS链接的JSON文件
- `summary.md`生成的Markdown格式的博客信息文档
- `index.html`生成的静态网页文件

## 添加

任何广东白云学院的学子都可以欢迎你们添加进来。

编辑`main.py`文件，找到blogUrl，在已有的RSS源后添加你的RSS源，最后提交 Pull Request 进行更改。  

格式：
```python
blogUrl = [
    'https://blog.nyc1.xyz/atom.xml',
    'https://blog.canyie.top/atom.xml',
#   'https://URL/atom.xml'
#   在此输入可以添加更多博客的RSS链接,记得在最后加个,
        
    ]
```

然后在readme.md中的列表添加你的信息。

## 目前已添加的列表

|         Name         |              网站               |
|:--------------------:|:-----------------------------:|
|  NgaiYeanCoi's blog  |    https://blog.nyc1.xyz/     |
|        残页的小博客        |   https://blog.canyie.top/    |
|    SMULET's BLOG     | https://simuleite.github.io/  |


## 后续可能会添加的功能
- 词云
- 搜索功能
- 美化样式
- 留言功能
- ...

## 第三方搭建  

### 克隆仓库

```bash
git clone https://github.com/NgaiYeanCoi/BaiyunUBlogroll.git
```

### 安装依赖  

- 在使用前先安装第三方依赖库 。

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```  

- json
- requests
- xml.etree.ElementTree
- Markdown
- beautifulsoup4
- feedparser


## 作者
[NgaiYeanCoi](https://github.com/NgaiYeanCoi)

## 许可证
[MIT License](https://github.com/NgaiYeanCoi/BaiyunUBlogroll/blob/master/LICENSE)