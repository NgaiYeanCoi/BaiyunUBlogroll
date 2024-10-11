# BaiyunUBlogroll
广东白云学院，是一个用于聚合多个博客RSS源的Python脚本。
搭配Github WorkFlow每天北京时间0:30自动抓取指定博客的RSS源，解析并提取相关信息，然后将json转换成Markdown。

## 配置文件
- `config.json`用于存储博客RSS链接的JSON文件
- `summary.md`生成的Markdown格式的博客信息文档

## 添加
项目还在建设当中，欢迎你们提交Pull Request或Issues与我一起维护这个项目。
任何广东白云学院的学子都可以添加进来。
编辑`main.py`文件，找到blogUrl，在已有的RSS源后添加你的RSS源，最后提交 Pull Request 进行更改。
格式：
```python
def main():
    blogUrl = [
        'https://blog.nyc1.xyz/atom.xml',
        'https://blog.canyie.top/atom.xml'
#       'https://URL/atom.xml'
#       在此输入可以添加更多博客的RSS链接,记得在最后加个,
        
    ]
```

## 第三方搭建
### 依赖
- 在使用前先安装第三方依赖库`feedparser`、`requests`用于解析RSS
```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```
- json
- requests
- xml.etree.ElementTree

## 作者
[NgaiYeanCoi](https://github.com/NgaiYeanCoi)

## 许可证
[MIT License](https://github.com/NgaiYeanCoi/BaiyunUBlogroll/blob/master/LICENSE)