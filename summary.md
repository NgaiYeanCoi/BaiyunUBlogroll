# BaiyunU Blogroll

 - 更新时间:2024-11-16 16:45:32

## [Reviving an already patched vulnerability for half a year? The second spring of CVE-2024-0044](https://blog.canyie.top/2024/10/08/CVE-2024-0044/)
**作者:** 残页
**发表时间:** 2024-10-08

**摘要:** This is a bypass of the initial patch of CVE-2024-0044, a High severity vulnerability in the Android framework that allows attackers with adb access to execute arbitrary code under the UID of arbitrary app.The following is copied from my repohttps://github.com/canyie/CVE-2024-0044for backup purposes. For more info such as PoC code, please check the original repo.

**更新时间:** 2024-11-12 10:00:51

## [MagiskEoP (CVE-2024-48336)： Magisk App Arbitrary Code Execution Vulnerability](https://blog.canyie.top/2024/08/24/CVE-2024-48336/)
**作者:** 残页
**发表时间:** 2024-08-24

**摘要:** Magisk App before Canary version 27007 contains a vulnerability CVE-2024-48336, which allows a local untrusted app with no additional privileges to silently execute arbitrary code in the Magisk app and escalate privileges to root via a crafted package without user interaction.The following is copied from my repohttps://github.com/canyie/MagiskEoPfor backup purposes. For more info such as PoC code, please check the original repo.

**更新时间:** 2024-11-12 09:57:26

## [Android 每月安全补丁分析索引](https://blog.canyie.top/2024/04/18/android-security-bulletin-index/)
**作者:** 残页
**发表时间:** 2024-04-18

**摘要:** 之前一直在看的每月补丁分析的博客https://wrlus.com/看起来是不再更新了，想了想反正自己每个月也要去追着看，干脆写一下分析得了，方便自己后面找。本人很菜，分析的大部分都是 Java 层漏洞，大佬别骂我 QAQ最初发表在我的 telegram 频道。每月补丁都会在此文中更新。最后更新时间：2024/11/11 更新内容：更新 2024-11

**更新时间:** 2024-11-12 09:10:44

## [Spring Framework](http://simuleite.github.io/ComputerScience/%E7%AC%94%E8%AE%B0/Spring%20Framework/)
**作者:** SIMULEITE
**发表时间:** 2024-08-10

**摘要:** 所有的Java云平台都能够使用基于JAR的打包方式，WAR文件只在一些云平台上能够运行。Pom.xml 更换 Maven 源<?xml version="1.0"encoding="UTF-8"?><projectxmlns="http://maven.apache.org/POM/4.0.0"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd"><modelVersion>4.0.0</modelVersion><groupId>org.springframework.quoters</groupId><artifactId>quoters-incorporated</artifactId><version>0.0.1-SNAPSHOT</version><packaging>jar</packaging><name>quoters-incorporated</name><description>REST service to support the guides</description><developers><developer><id>gturnquist</id><name>Greg Turnquist</name><email>gturnquist at vmware.com</email><organization>VMware, Inc.</organization><roles><role>Project Lead</role></roles></developer></developers><organization><name>VMware, Inc.</name><url>https://spring.io</url></organization><licenses><license><name>Apache License, Version 2.0</name><url>https://www.apache.org/licenses/LICENSE-2.0</url><comments>Copyright 2011 the original author or authors.Licensed under the Apache License, Version 2.0 (the "License");you may not use this file except in compliance with the License.You may obtain a copy of the License athttps://www.apache.org/licenses/LICENSE-2.0Unless required by applicable law or agreed to in writing, softwaredistributed under the License is distributed on an "AS IS" BASIS,WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express orimplied.See the License for the specific language governing permissions andlimitations under the License.</comments></license></licenses><parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>2.7.5</version><relativePath/><!-- lookup parent from repository --></parent><properties><project.build.sourceEncoding>UTF-8</project.build.sourceEncoding><project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding><java.version>1.8</java.version></properties><dependencies><dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency><dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency><dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope></dependency><dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency></dependencies><!-- 配置阿里云仓库 --><repositories><repository><id>aliyun-repos</id><url>https://maven.aliyun.com/repository/public</url><releases><enabled>true</enabled></releases><snapshots><enabled>false</enabled></snapshots></repository></repositories><pluginRepositories><pluginRepository><id>aliyun-repos</id><url>https://maven.aliyun.com/repository/public</url><releases><enabled>true</enabled></releases><snapshots><enabled>false</enabled></snapshots></pluginRepository></pluginRepositories><build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build></project>Tight Coupling 紧耦合在Spring框架以前，使用排序算法需要将算法实例化publicclassComplexBusinessService{SortAlgorithmsortAlgorithm=newBubbleSortAlgorithm;}publicclassBubbleSortAlgorithmimplementsSortAlgorithm{...}Good code has loose coupling.移除依赖项的实例化可以移除紧耦合publicclassComplexBusinessService{SortAlgorithm sortAlgorithm;// = new BubbleSortAlgorithm();publicComplexBusinessService(SortAlgorithm sortAlgorithm){// 创建构造函数this.sortAlgorithm = sortAlgorithm;}publicclassBubbleSortAlgorithmimplementsSortAlgorithm{...}Spring Framework instantiates objects and populates the dependencies.

**更新时间:** 2024-11-08 02:20:22

## [Self-changing Data Type - CVE-2024-40676 漏洞分析](https://blog.canyie.top/2024/11/07/self-changing-data-type/)
**作者:** 残页
**发表时间:** 2024-11-07

**摘要:** 今年 10 月份的时候，Android 安全公告用 CVE-2024-40676 的编号公布了一个很奇怪的patch。AccountManagerService checkKeyIntent() 负责检查 account authenticator 传回的 intent，确保它安全再传回给 caller，防止 launch anywhere 漏洞。这个补丁看起来很暴力也很奇怪，直接 ban 了所有带有 content URI 的 intent，似乎完全不考虑兼容性。是什么样的漏洞才要上如此暴力的修复方法？注：如下全是我的猜测，由于联系不到漏洞作者本人，无法确认这是否就是原本的问题。

**更新时间:** 2024-11-07 03:34:02

## [LeetCode100 错题本](http://simuleite.github.io/ComputerScience/%E7%AC%94%E8%AE%B0/LeetCode100%20%E9%94%99%E9%A2%98%E6%9C%AC/)
**作者:** SIMULEITE
**发表时间:** 2024-09-30

**摘要:** Hash字母异位词排序每一个单词，就知道是不是异位词。两数之和从数组中，找到nums[i] + nums[j] == target，并返回{ i, j }。思路是双重循环，遍历每一个元素，求和是否为target。然而，双重循环需要O(N2)O(N^2)O(N2)的复杂度。因此，可以使用一张表，使用containsKey方法识别是否存在当前i的target - nums[i]，即可减少一重循环。关键思想用Map高效率查找，减少一重循环。最长连续序列从乱序数组中，找到最长连续（数组中不一定连续）的序列。要求O(N)O(N)O(N)。首先用数组的值存入哈希表，然后遍历数组，判断map.constains(curNum++)。然而，即使这样还是效率不够高。优化中间值不进入循环，序列开始值才进入，使用!contains(curNum - 1)判断是否为序列开始值去重，不要哈希表，不需要键值对，使用哈希Set，只存储值。关键思想去重；不处理中间值

**更新时间:** 2024-11-05 03:27:07

## [Android 平台常见安全漏洞类型](https://blog.canyie.top/2024/11/05/android-platform-common-vulnerabilities/)
**作者:** 残页
**发表时间:** 2024-11-04

**摘要:** 本文适用于已对 Android 开发有基础了解，希望了解 Android 系统层常见安全漏洞的人。祝大家写代码无 bug，挖洞天天挖到 Critical RCE 漏洞链。本文开始创作时间：2024-02-19 完成时间：2024-02-29 发布时间：2024-11-05

**更新时间:** 2024-11-04 12:43:37

## [DP 设计模式](http://simuleite.github.io/ComputerScience/%E8%AF%BE%E7%A8%8B/DP%20%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/)
**作者:** SIMULEITE
**发表时间:** 2024-11-02

**摘要:** 策略模式classMallardDuckextendsDuck{publicMallardDuck(){quackBehavior =newQuack();flyBehavior =newFlyWithWings();}}classModelDuckextendsDuck{publicModelDuck(){quackBehavior =newQuack();flyBehavior =newFlyNoWay();// 组合不同的方法}}classMain{publicstaticvoidmain(String[] args){Duckreal=newMallardDuck();Duckmodel=newModelDuck();real.fly();model.fly();// 调用同样的接口}}识别应用中变化的方面，把它们和不变的方面分开。针对接口编程，而不是针对实现编程。// ImplementDogd=newDog();d.bark();// InterfaceAnimaldog=newDog();dog.makeSound();// abstract优先使用组合而不是继承。summary策略模式定义了算法族并分别封装。策略让算法变化独立于使用它的客户。

**更新时间:** 2024-11-03 07:05:46

## [白云学院-关于如何申请学校edu邮箱](https://blog.nyc1.xyz/2024/10/07/%E7%99%BD%E4%BA%91%E5%AD%A6%E9%99%A2-%E5%85%B3%E4%BA%8E%E5%A6%82%E4%BD%95%E7%94%B3%E8%AF%B7%E5%AD%A6%E6%A0%A1edu%E9%82%AE%E7%AE%B1/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-10-06

**摘要:** 前言很多同学都不知道教育邮箱、学信网认证有很多隐藏的福利可以省下很多钱，并且许多企业都有推行高校学生权益，你不单止可以免费使用正版软件，还可以以最优惠的价格购买他们的产品。就来让我打破你们的信息差吧！

**更新时间:** 2024-11-01 10:02:48

## [SpringBoot 支付模块](http://simuleite.github.io/ComputerScience/%E9%A1%B9%E7%9B%AE/SpringBoot%20%E6%94%AF%E4%BB%98%E6%A8%A1%E5%9D%97/)
**作者:** SIMULEITE
**发表时间:** 2024-10-27

**摘要:** 参考资料Gitee项目<a href="https://blog.csdn.net/m0_66490875/article/de

**更新时间:** 2024-10-28 12:37:27

## [动态规划学习指南](http://simuleite.github.io/ComputerScience/%E6%8C%87%E5%8D%97/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E5%AD%A6%E4%B9%A0%E6%8C%87%E5%8D%97/)
**作者:** SIMULEITE
**发表时间:** 2024-10-21

**摘要:** Author：aatalykOrigin：LinkBefore starting the topic let me introduce myself. I am a Mobile Developer currently working in Warsaw and spending my free time for interview preparations. I started to prepare for interviews two years ago. At that time I should say I could not solve the two sum problem. Easy problems seemed to me like hard ones so most of the time I had to look at editorials and discuss section. Currently, I have solved ~800 problems and time to time participate in contests. I usually solve 3 problems in a contest and sometimes 4 problems. Ok, lets come back to the topic.Recently I have concentrated my attention on Dynamic Programming cause its one of the hardest topics in an interview prep. After solving ~140 problems in DP I have noticed that there are few patterns that can be found in different problems. So I did a research on that and find the following topics. I will not give complete ways how to solve problems but these patterns may be helpful in solving DP.PatternsMinimum (Maximum) Path to Reach a TargetDistinct WaysMerging IntervalsDP on StringsDecision Making

**更新时间:** 2024-10-28 12:36:54

## [Redis使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/Redis%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-10-26

**摘要:** General# 返回给定模式的keysKEYS patterKEYS * # 返回全部KEYS set* # 返回set开头的keysEXISTS keyTYPE keyDEL keyStringSET key valueGET key# Set Extend TimeSETEX key seconds value# Set When Key Not ExistSETNX key valueHashHSET key field valueHGET key fieldHDEL key field# Get All FieldsHKEYS key# Get All ValuesHVALS keyflowchart LRkey[key]item[field1: value1field2: value2]key --> itemListLPUSH key value1 value2# Get Key From Start To StopLRANGE key start stop# Right POPRPOP key# List LengthLLEN keySetSADD key mem1 mem2SMEMBERS key# Set SizeSCARD keySINTER key1 key2SUNION key1 key2# DeleteSREM key mem1 mem2Sorted Set / ZSetZADD key score1 mem1 score2 mem2# Show ListZRANGE key start stop (WITHSCORES)# Increse MemberZINCRBY key increment memberZREM key mem1 mem2

**更新时间:** 2024-10-27 07:06:48

## [网络技术-二层安全](https://blog.nyc1.xyz/2024/10/20/%E7%BD%91%E7%BB%9C%E6%8A%80%E6%9C%AF-%E4%BA%8C%E5%B1%82%E5%AE%89%E5%85%A8/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-10-20

**摘要:** 广播风暴广播风暴的现象交换机指示灯疯狂闪烁.switch CPU利用率高。switch 命令行卡顿。用户上网慢获知不能上网。出现MAC地址漂移。抓包发现很多ARP、DHCP discovery广播包。广播风暴可能的原因二层环路(没启用生成树或生成树故障，设备/接口故障)。网络中存在攻击行为(某些终端持续恶意发送广播包)。

**更新时间:** 2024-10-21 02:00:35

## [白云学院维修部指南-第一章硬件性能的认识](https://blog.nyc1.xyz/2024/10/02/%E7%BB%B4%E4%BF%AE%E9%83%A8%E6%8C%87%E5%8D%97-%E7%AC%AC%E4%B8%80%E7%AB%A0/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-10-01

**摘要:** 前言介于我在国庆回家的路上在想着怎么样才能让自己的社团成员学习到维修的一些知识呢，我想到了写一篇blog来教你们如何快速的入门。作为24届白云学院计协维修部的副部长，具备扎实的电脑维修知识和实践能力是作为维修部成员是必备的素质。我希望这一篇指南可以传承下去让白云学院每一届的维修部的同学都有所受益。本指南将从电脑的基础知识入手，详细介绍电脑各个部件的功能与作用，并通过实践拆装电脑、清灰等操作，让大家亲自动手，掌握实用的维修技巧，我们还将深入讲解BIOS的基本概念和常用设置，以及如何重装系统等高级操作。此篇适用于广东白云学院计算机协会维修部或者其他部门的每一个成员，以及为有兴趣的同学提供学习指南。

**更新时间:** 2024-10-19 14:20:40

## [mysql使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/mysql%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-07-26

**摘要:** 使用启动数据库# 需要管理员权限net start <mysql-service_name>登录数据库mysql -u <username> -p$ <password>导入数据库-- 设置中文字符集mysql>SETNAMES'utf8mb4';mysql>SETcharacter_set_server='utf8mb4';mysql>SOURCE/path/to/database.sql;数据库-- 创建数据库CREATEDATABASE yourDatabaseCHARACTERSETutf8mb4;-- 查看所有数据库showdatabases;-- 进入数据库use yourDatabase表-- 建表CREATETABLEyourTable (idINTAUTO_INCREMENTPRIMARYKEY,namevarchar(50)NOTNULLDEFAULT'worker',ageINT,addrvarchar(50));-- 删除表drop<table>;-- 查看表showtables;-- 修改表altertable<table>add<col>char(20)dropcolumn<col>;-- 删除整张表droptable<table>;

**更新时间:** 2024-10-10 11:55:08

## [AI爱外卖](http://simuleite.github.io/ComputerScience/%E9%A1%B9%E7%9B%AE/AI%E7%88%B1%E5%A4%96%E5%8D%96/)
**作者:** SIMULEITE
**发表时间:** 2024-09-20

**摘要:** 项目心得24.10.

**更新时间:** 2024-10-09 12:03:43

## [OS 操作系统](http://simuleite.github.io/ComputerScience/%E8%AF%BE%E7%A8%8B/OS%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/)
**作者:** SIMULEITE
**发表时间:** 2024-08-06

**摘要:** Chapter3 操作系统结构复杂度管理方法 M.A.L.HModularity: 模块化，分而治之Abstraction: 抽象，接口与实现分离，遵循宽进严出原则。例如虚拟内存、文件系统对于大型系统，只有模块化和抽象，可能导致划分模块太多，交互关系复杂，因此还需要引入分层和层次结构控制复杂度。Layering: 分层，每个层级是一套完整机制。通常一个模块只能与本层和上下层交互，不能跨层。例如OSI、TCP/IPHierarchy: 层次结构，大的子系统由多个小的子系统组织成。即同级模块的分层宽进严出原则：容忍各种输入（包括恶意输入），严格控制模块的对外输出微内核宏内核架构：单点bug使整个系统崩溃。微内核：解耦单个功能/模块（如文件系统、设备驱动）作为独立服务隔离运行，使内核成为一个最小功能集。微内核架构服务隔离，单点出问题系统不会崩溃内核态部分，称为μkernel\mu kernelμkernel微内核优势：弹性硬件拓展能力硬件异构实现功能安全信息安全时延确定现代操作系统特征：1）虚拟内存；2）用户态、内核态隔离。

**更新时间:** 2024-10-06 08:24:22

## [MarkDown的使用教程](https://blog.nyc1.xyz/2023/11/04/MarkDown%E7%9A%84%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/)
**作者:** NgaiYeanCoi
**发表时间:** 2023-11-04

**摘要:** 学习Markdown by NgaiYeanCoi 2023.8.29更新此篇是由NgaiYeanCoi整理编写出的Markdown教程，如有错误的请指出。Stayrabbit & NgaiYeanCoi是同一人。全篇建议配合源代码一起阅读点我查看源码一、前言1.1 关于MarkdownMarkdown是一种轻量标记语言,它可以让人们更容易读懂纯文本的文档说明Markdown编写的文档可以导出为HTML、World、图像、PDF 等多种格式的文档Markdown文档的后缀.md.markdown1.2 Markdown的应用Markdown可以用来写笔记、电子书目前很多网站都广泛使用Markdown来撰写帮助文档或者是用于论坛，例如：GitHub、简书等1.3 Markdown的编辑器Markdown存在有多种多样的编辑器，并没有哪种编辑器更好的说法，只有适合自己的编辑器。常见的Markdown编辑器有Visual Studio Code、Typora、Obsidian等二、Markdown的语法Markdown 有着非常简洁的语法，不过由于它的自由性，Markdown 也产生了许多变体，如 GitHub Flavored Markdown (GFM) 和 Pandoc 。其他的暂且不讨论，先来看看Markdown 通用的基础语法。以下的语法基于VS Code与Markdown Preview Enhanced 插件

**更新时间:** 2024-10-06 06:51:26

## [AI与区块链选修期中指南](https://blog.nyc1.xyz/2024/04/21/AI%E4%B8%8E%E5%8C%BA%E5%9D%97%E9%93%BE%E6%9C%9F%E4%B8%AD%E6%8C%87%E5%8D%97/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-04-21

**摘要:** 前言介于很多同学没接触过AIGC的工具不知道该怎么去完成该考试前期我试过国内的一些模型感觉都不如DALLE3好用，但使用这个服务对于通过考试来说很贵，这里将告诉你怎么样用最低的成本来通过考试这里将提供购买渠道以及应用平台以下将作为指南去帮助你通过期中考试如果你不想花钱就找免费的AIGC工具例如讯飞星火或者LiblibAI·哩布哩布AI以及智谱清言等等，都可以帮助你完成期中考试，工具不限。如果想省麻烦的可以用DALLE3。

**更新时间:** 2024-10-05 16:48:59

## [AI与区块链选修第九章测验图解](https://blog.nyc1.xyz/2024/04/15/AI%E4%B8%8E%E5%8C%BA%E5%9D%97%E9%93%BE%E9%80%89%E4%BF%AE%E7%AC%AC%E4%B9%9D%E7%AB%A0%E6%B5%8B%E9%AA%8C%E5%9B%BE%E8%A7%A3/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-04-15

**摘要:** 前言在学习通上老师给的解析还不够详细仍然缺少了些细节这里将一步步拆解老师给的解析大家可以来使用我整理的数据集对于完成作业已经足够了步骤打开百度智能云网站点击【立即使用】在【在线使用】【图像:文心大模型】这一弹出【选择模型类型】，列选择【物体检测】

**更新时间:** 2024-10-05 16:48:58

## [liunx安全管理](https://blog.nyc1.xyz/2024/04/20/liunx%E5%AE%89%E5%85%A8%E7%AE%A1%E7%90%86/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-04-20

**摘要:** 前言介于上次被一个陌生的德国ip入侵之后不得已重置整个系统，所有已经部署的业务都得重来。由此可见做好安全管理多么重要！以下一些常见的操作来增加系统安全防止被恶意入侵Linux安全管理之SSH安全备份记得备份好你的SSHD的配置文件以防万一1# cp /etc/ssh/sshd_config /etc/ssh/backup.sshd_configOpenSSH的路径OpenSSH 服务的配置文件路径为 /etc/ssh/sshd_config ，要配置它，必须得使用系统管理员（ root ）权限或使用 sudo 命令临时获得的管理员权限。配置信息大概长这样的链接这里默认你已经会用编辑工具没有的话请安装VIM1# apt-get install vim编辑配置文件准备好就直接编辑1# vim /etc/ssh/sshd_config

**更新时间:** 2024-10-05 16:42:53

## [利用gost中转隧道中转加密](https://blog.nyc1.xyz/2024/03/27/%E5%88%A9%E7%94%A8gost%E4%B8%AD%E8%BD%AC%E9%9A%A7%E9%81%93%E4%B8%AD%E8%BD%AC%E5%8A%A0%E5%AF%86/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-03-27

**摘要:** 原脚本功能实现了systemd及gost配置文件对gost进行管理在不借助其他工具(如screen)的情况下实现多条转发规则同时生效机器reboot后转发不失效支持传输类型：tcp+udp不加密转发relay+tls加密此脚本新增功能增加了传输类型选择功能新支持传输类型relay+wsrelay+wss落地机一键创建ss/socks5/http代理 (gost内置)支持多传输类型的多落地简单型均衡负载增加gost国内加速下载镜像（被恶意刷流量导致我损失，不再提供）简单创建或删除gost定时重启任务脚本自动检查更新转发CDN自选节点ip支持自定义tls证书，落地可一键申请证书，中转可开启证书校验开源来自KANIKIG/Multi-EasyGostgost的脚本的安装命令

**更新时间:** 2024-10-01 17:41:19

## [UFW防火墙](https://blog.nyc1.xyz/2024/03/18/UFW%E9%98%B2%E7%81%AB%E5%A2%99/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-03-18

**摘要:** 安装Ubuntu & Debian1# apt-get install ufw -yCentOSCentOS默认软件源不提供UFW，所以你需要安装EPEL软件源，运行以下命令：1# yum install epel-release -y安装完成后使用以下命令安装UFW：1# yum install --enablerepo="epel" ufw -yUFW安装后，可以通过以下命令来启动UFW服务并使其在启动时启动（一般在完成默认配置后再重启）：1# ufw enable如果运行ufw命令时报Command Not Found错误，可以使用whereis ufw来确定ufw的位置，之后你也可以顺手设置一下alias。接下来，使用以下命令检查UFW的状态，可以看到以下输出：12# ufw statusStatus: active还可以通过运行以下命令来禁用UFW防火墙（后面可以通过enable命令随时启用服务）：1# ufw disable如果你决定要重新开始，则可以使用reset命令：1# ufw reset这将禁用UFW并删除之前定义的任何规则。

**更新时间:** 2024-10-01 17:41:10

## [OpenSSH服务器ssh_config](https://blog.nyc1.xyz/2024/03/18/SSHD%E9%85%8D%E7%BD%AE%E7%9A%84%E8%A7%A3%E9%87%8A/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-03-18

**摘要:** SSHD配置文件默认路径1SSH的配置文件路径：/etc/ssh/sshd_config修改1vim /etc/ssh/sshd_config

**更新时间:** 2024-10-01 17:38:12

## [CS61B sp18](http://simuleite.github.io/ComputerScience/%E8%AF%BE%E7%A8%8B/CS61B%20sp18/)
**作者:** SIMULEITE
**发表时间:** 2024-08-20

**摘要:** Gradescope AutograderSpring 201844个Assn，偏向数据结构邀请码：MNXYKX学校：UC Berkeley直接输入，不要选择2U-UC Berkeley，否则将提示COURSE ENTRY CODE IS INVALIDSpring 202119个Assn，偏向软件工程邀请码：MB7ZPY文章收录The Law of the Broken Futon浮沙筑高台法则“Since I’m fine now, can’t I add that missing piece later, when it’s actually needed?” Sometimes, yes. But it’s much harder.Adding the missing piece later means waiting until the damage is already underway, and hellishly difficult to undo.A Response to “Why Most Unit Testing is Waste”(Unit Tests) They are based onprogrammers’ fantasies about how the function should work. But programmers break down requirements into smaller components all the time – this is how you program. Sometimes there are misunderstandings, but that is the exception, not the rule, in my opinion.2.1 Mystery of Java RestoreWhen instantiate an Object,obj = new Object(),objstores the addressof the Object, not the specific data struction.(That is why all type of variables create memory boxes of 64 bits. It is just the memory of the address.)Therefore, When we useobj2 = obj, Java simply copy the addr ofobjand assign it toobj2(They are pointing to the same Object), that is why when we changeobj2.weightit effectsobj.weighttoo.

**更新时间:** 2024-09-30 03:01:12

## [DNS Over Https](http://simuleite.github.io/ComputerScience/%E7%AC%94%E8%AE%B0/DNS%20Over%20Https/)
**作者:** SIMULEITE
**发表时间:** 2024-09-09

**摘要:** Windows

**更新时间:** 2024-09-10 11:25:58

## [ICS5 PA](http://simuleite.github.io/ComputerScience/%E9%A1%B9%E7%9B%AE/ICS5%20PA/)
**作者:** SIMULEITE
**发表时间:** 2024-05-29

**摘要:** PA1-1 24.5.30又开始了ICS之旅，这次又给自己下了一个难度，找到了汪亮老师讲解的ICS 5！target第一课的目标是修正一个register错误声明insteresting中途网易源Bad Gateway 502了，更换清华源，学会了:%s/163/tuna/g非常爽！又学了几个终端快捷键想到了用ccache加速我的PAproblemsunion和struct的区别？unioin在同一个内存空间中存储不同的数据类型。struct则是同时存储不同的数据类型。为什么要用union？阅读i386手册2.3.1 General RegistersAsFigure 2-5shows, the low-order word of each of these eight registers has a separate name and can be treated as a unit. This feature is useful for handling 16-bit data items and for compatibility with the 8086 and 80286 processors. The word registers are named AX, BX, CX, DX, BP, SP, SI, and DI.对于CPU来说，可以把AH AX AL看成单独的单元，拆分成小块。所以它们是共用关系。PA1-2 ALU 24.6.5target实现ALU中的各类运算，包括设置标志位knowledgeAppendix CNameFunctionCFCarry Flag ── Set on high-order bit carry or borrow; cleared otherwise.PFParity Flag ── Set if low-order eight bits of result contain an even number of 1 bits; cleared otherwise.ZFZero Flag ── Set if result is zero; cleared otherwise.SFSign Flag ── Set equal to high-order bit of result (0 is positive, 1 if negative).OFOverflow Flag ── Set if result is too large a positive number or too small a negative number (excluding sign-bit) to fit in destination operand; cleared otherwise.

**更新时间:** 2024-08-21 09:20:40

## [Listary使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/Listary%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-08-15

**摘要:** 网络搜索网站URL备注</the

**更新时间:** 2024-08-16 12:08:33

## [Spring Boot](http://simuleite.github.io/ComputerScience/%E9%A1%B9%E7%9B%AE/Spring%20Boot/)
**作者:** SIMULEITE
**发表时间:** 2024-07-23

**摘要:** Spring CLI可以用Spring Init

**更新时间:** 2024-07-25 07:50:44

## [网络是怎样连接的](http://simuleite.github.io/ComputerScience/%E7%AC%94%E8%AE%B0/%E7%BD%91%E7%BB%9C%E6%98%AF%E6%80%8E%E6%A0%B7%E8%BF%9E%E6%8E%A5%E7%9A%84/)
**作者:** SIMULEITE
**发表时间:** 2024-07-24

**摘要:** Web浏览器网址就是请求服务器上对应的文件DNS从顶级域名开始根据网址查IP。DNS服务器通过缓存查过的IP来加快服务

**更新时间:** 2024-07-25 00:33:01

## [ThinkPHP 6](http://simuleite.github.io/ComputerScience/%E9%A1%B9%E7%9B%AE/ThinkPHP%206/)
**作者:** SIMULEITE
**发表时间:** 2024-07-18

**摘要:** ThinkPHP 6.0文档<a class="markdownIt-Anchor" href

**更新时间:** 2024-07-23 07:29:59

## [Windows scripts使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/Windows%20scripts%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-07-15

**摘要:** Task SchedulerWIN+R,taskschd.msc<br

**更新时间:** 2024-07-16 08:45:20

## [若人生是场大梦啊——记我人生的前19年](https://blog.canyie.top/2023/11/06/first-19-years-of-my-life/)
**作者:** 残页
**发表时间:** 2023-11-06

**摘要:** 上次发年终总结还是 2022 年发 2021 年的，2022 年的年终总结缺失了。今年发生了好多好多的事情，一直想写今年的年终总结但是却总没到年终，干脆写成前 19 年纪念吧。

**更新时间:** 2024-07-03 23:19:21

## [Computer Organization&Design学习记录](http://simuleite.github.io/ComputerScience/%E7%AC%94%E8%AE%B0/Computer%20Organization&Design%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/)
**作者:** SIMULEITE
**发表时间:** 2024-06-07

**摘要:** Chapter2 指令：计算机的语言本章将介绍MIPS汇编语言指令。三条设计原则简单源于规整 Simplicity favors regularity.越小越快 Smaller is faster.优秀的设计需要适宜的折中方案 Good design demands good compromises.2.2 硬件的操作与操作数规整add a, b, c // a = b + cMIPS汇编语言使用这样的固定记法。每条MIPS算术指令只执行1个操作，仅有3个变量。操作数必须来自寄存器变量f、g、h、i、j依次分配给$s0~$s4，编译下面的C语句f = (g + h) - (i + j);---add $t0, $s1, $s2// t0 = s1 + s2add $t1, $s3, $s4sub $s0, $t0, $t1// s0 = t0 + t1数据传输只有少量数据存在寄存器中，因此需要在存储器和寄存器间传输数据A的基址是存在$s3，编译下面的C语句A[12] = h + A[8]---lw  $t0,32($s3)// 先读数，再相加；32为偏移量，8*4byteadd $t0, $s2, $t0sw  $t0,48($s3)// 存数立即数addi $t0, $t1,4// t0 = t1 + 4；无需读取4，作为立即数相加subi $t0, $t1,4

**更新时间:** 2024-07-03 04:38:44

## [Huorong使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/Huorong%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-06-17

**摘要:** 保护文件防护中心 - 高级防护 - 自定义防护 - 锁定文件读取、创建、修改、删除权限

**更新时间:** 2024-06-30 09:16:13

## [Mermaid使用](http://simuleite.github.io/ComputerScience/%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/Mermaid%E4%BD%BF%E7%94%A8/)
**作者:** SIMULEITE
**发表时间:** 2024-06-28

**摘要:** Flowchart<a class="markdownIt-Anchor" href="#基本语法

**更新时间:** 2024-06-29 12:56:55

## [hexo的一些命令](https://blog.nyc1.xyz/2024/03/17/hexo/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-03-17

**摘要:** 常用命令创建和发布文章123hexo new “postName” 新建文章hexo new page “pageName” 新建页面一键部署命令1hexo clean && hexo g && hexo dhexo clean == hexo c清除缓存 网页正常情况下可以忽略此条命令hexo generate == hexo g生效新增、修改、更新的文件hexo deploy == hexo dhexo的一键部署功能，执行此命令即可将网站发布到配置中的仓库地址，执行此命令前需要配置站点配置文件_config.yml

**更新时间:** 2024-03-27 15:44:01

## [docker如何改变环境变量](https://blog.nyc1.xyz/2024/03/17/docker%E7%9A%84%E4%B8%80%E4%BA%9B%E5%91%BD%E4%BB%A4/)
**作者:** NgaiYeanCoi
**发表时间:** 2024-03-17

**摘要:** <a href="#命令-步骤"

**更新时间:** 2024-03-27 15:44:00

## [在故事开始之前的故事：Android 启动过程与 magiskinit 分析](https://blog.canyie.top/2023/11/12/android-booting-shenanigans-and-magiskinit-analysing/)
**作者:** 残页
**发表时间:** 2023-11-12

**摘要:** 终于开了一直想写的这篇文章，再不写点东西就真的是年更博客了……本文可以认为是Android Booting Shenanigans的中文补充说明，同时添加了 magiskinit 的一些处理细节。即使你对 magiskinit 没兴趣也可以看看，说不定就有一些你平时从来没注意到的细节呢 :)

**更新时间:** 2024-02-25 16:05:43

## [写给 Android 开发者的系统基础知识科普](https://blog.canyie.top/2023/03/28/system-foundation-for-android-devs/)
**作者:** 残页
**发表时间:** 2023-03-28

**摘要:** 与我以往的风格不同，本文为科普类文章，因此不会涉及到太过高深难懂的知识。但这些内容可能 Android 应用层开发者甚至部分 framework 层开发者都不了解，因此仍旧高能预警。另外广东这两天好冷啊，大家注意保暖~

**更新时间:** 2023-03-29 03:16:42

## [Android Property 实现解析与黑魔法](https://blog.canyie.top/2022/04/09/property-implementation-and-isolation/)
**作者:** 残页
**发表时间:** 2022-04-09

**摘要:** Android Property （属性系统）可谓是 Android 中使用最广泛的进程间信息共享机制了，如 app 获取系统版本号，就是通过属性系统传递的信息；对于如此常用的底层机制，你可能知道getpropSystemProperties__system_property_get这些 API，但是，你真的了解它吗？这次，我们不但要会遵守规则用这些 API，我们还要成为规则的缔造者，让系统为我们服务！Let’s go！

**更新时间:** 2022-04-09 09:56:45

## [从电子厂逃离的 17 岁 - 2021 年终总结](https://blog.canyie.top/2022/01/09/end-of-2021/)
**作者:** 残页
**发表时间:** 2022-01-09

**摘要:** 当我写下这段文字时，时间是 2022 年 1 月 9 日，这个时候发上一年年终总结似乎晚了点；老实说，在这个博客刚创建的时候，我没有打算写这种记录性的内容，我的目标一直都是像Weishu’s Notes的高质量内容；但是昨晚看 weishu 直播写代码，他说了一句让我很触动的话：“人生不需要有意义，有意思就够了。”我的 2021 可能没什么意义，但如果我不做点什么纪念一下，它很有可能就消逝在时间的长河里，连我自己都回忆不起来，更别提有意思了。

**更新时间:** 2022-01-09 08:37:07

## [检测Magisk与Xposed](https://blog.canyie.top/2021/05/01/anti-magisk-xposed/)
**作者:** 残页
**发表时间:** 2021-05-01

**摘要:** 不久前，开发者Rikka & vvb2060上架了一款环境检测应用Momo，把大家一直以来信任的各种反检测手段击得粉碎。下面我会通过部分已公开的源码，分析这个可能是史上最强的环境检测应用。

**更新时间:** 2021-05-01 10:13:00

## [Android R上的隐藏API限制学习笔记](https://blog.canyie.top/2020/06/10/hiddenapi-restriction-policy-on-android-r/)
**作者:** 残页
**发表时间:** 2020-06-10

**摘要:** 2018年发布的Android 9中引入了对隐藏API的限制，这对整个Android生态来说当然是一件好事，但也严重限制了以往我们通过反射等手段实现的“黑科技”（如插件化等），所以开发者们纷纷寻找手段绕过这个限制，比如我曾经提出了两个绕过方法，其中一个便是几乎完美的双重反射（即“元反射”，现在来看叫“套娃反射”比较好）；而在即将发布的Android R中把这个方法封杀了（谷歌：禁止套娃！），因此我重新研究了Android R中的限制策略。

**更新时间:** 2021-04-10 05:39:39

## [通过系统的native bridge实现注入zygote](https://blog.canyie.top/2020/08/18/nbinjection/)
**作者:** 残页
**发表时间:** 2020-08-18

**摘要:** 之前研究art的时候发现了native bridge，简单来说这东西是主要作用就是为了能运行不同指令集的so（比如x86的设备运行arm的app），而arm设备上这个东西一般都是关闭的，研究了一下后发现这东西挺适合动手脚的，刚好自己在用的Riru被针对了，所以有了这篇博客。把对应的示例代码传到了github：NbInjection，接下来我们聊一下这个小玩具。

**更新时间:** 2020-10-25 02:53:44

## [ART上的动态Java方法hook框架](https://blog.canyie.top/2020/04/27/dynamic-hooking-framework-on-art/)
**作者:** 残页
**发表时间:** 2020-04-27

**摘要:** 大家应该还记得我上次介绍的Dreamland吧，忘记了也没事，简单介绍一下：这是一个类似Xposed的框架，可以注入应用进程并进行方法hook。进程注入上次已经说过了，另一个重点hook当时是使用了SandHook框架，这是一款非常优秀的hook框架，但是有点问题，不太适合Dreamland；在比较了其他hook框架之后，发现似乎都存在一些问题，最终决定自己动手写一个。已经开源，代码在这：Pine，接下来我会介绍它的具体实现。

**更新时间:** 2020-10-25 02:50:19

## [《空中浩劫》里的法航447](https://blog.canyie.top/2020/08/20/af447-in-aci/)
**作者:** 残页
**发表时间:** 2020-08-20

**摘要:** 2009年6月1日（UTC时间），法国航空447号班机（机型空中客车A330-203、注册号F-GZCP）在大西洋中部雷达盲区神秘失踪，后被证实坠毁，机上228人（乘客216人、机组成员12人）全数罹难。著名空难文献剧《Air Crash Investigation》（中文一般译为《空中浩劫》，以下简称ACI）在S12E13中收录了此事故，揭露了所谓的“空难真相”，将矛头直指副驾驶皮埃尔-塞德里克·博南（Pierre Cédric Bonin）；同时，由于该片的知名度，让许多航空爱好者乃至真正的航空从业者认为该片所述即为事实。然而，真的是这样吗？

**更新时间:** 2020-08-20 08:29:39

## [一种在ART上快速加载dex的方法](https://blog.canyie.top/2020/02/15/fast-load-dex-on-art-runtime/)
**作者:** 残页
**发表时间:** 2020-02-15

**摘要:** 在国内的大环境下，Android上插件化/热修复等技术百花齐放，而这一切都基于代码的动态加载。Android提供了一个DexClassLoader。用这个API能成功加载dex，但有一个比较严重的问题：Android Q以下，当这个dex被加载时，如果没有已经生成的oat，则会执行一次dex2oat把这个dex编译为oat，导致第一次加载dex会非常非常慢。个人认为这样的设计是非常不合理的，虽然转换成oat之后执行会很快，但完全可以让用户以解释器模式先愉快的用着，dex2oat放另一个线程执行多好。Android 8.0上谷歌还提供了一个InMemoryDexClassLoader，而以前的Android版本，就要开发者自己想办法了……

**更新时间:** 2020-04-15 03:08:44

## [我也有自己的个人博客啦！](https://blog.canyie.top/2019/10/28/hello-world/)
**作者:** 残页
**发表时间:** 2019-10-28

**摘要:** 我也有自己的个人博客啦！

**更新时间:** 2020-04-15 03:05:17

## [试着写了一个类Xposed框架](https://blog.canyie.top/2020/02/03/a-new-xposed-style-framework/)
**作者:** 残页
**发表时间:** 2020-02-03

**摘要:** 新人第一次写博客，勿喷..本文也发布在知乎上Xposed框架在Android上是神器般的存在，它给了普通用户随意定制系统的能力，各种骚操作层出不穷。随着咱对Android的了解越来越深（其实一点都不深..），逐渐冒出了自己写一个类Xposed框架的想法，最终搞出了这个勉强能用的半成品。代码在这：Dreamland&Dreamland Manager，代码写的很辣鸡，求轻喷QAQ接下来会介绍一下实现细节与遇到的问题。

**更新时间:** 2020-02-05 06:10:23

## [T618冷门平板刷机从入门到理赔](https://my.toho.red/posts/broke-t618-tablet/)
**作者:** 西行妖
**发表时间:** Mon, 01 Jul 2024 14:03:53 +0800

**摘要:** 前几天回家路上刷闲鱼时偶然看到了这样一款机型： 看型号是jide pad2 t618 6+128的配置，虽然t618和手上的台电M40 PLUS上的mt6771性
## [12700h es新all in Boom折腾记录](https://my.toho.red/posts/new-12700h-home-server/)
**作者:** 西行妖
**发表时间:** Sun, 31 Mar 2024 20:11:24 +0800

**摘要:** 前言 之前的某篇文章提到了nas升级的后续计划，现在回头看，距离那篇文章的发布已经过去两个月了，但实际上距离新all in boom的更换只有一个月
## [Kde6 Electron程序在wayland模式下无法运行终极解决方案](https://my.toho.red/posts/solve-electron-wayland-input-problem/)
**作者:** 西行妖
**发表时间:** Sun, 31 Mar 2024 19:50:54 +0800

**摘要:** 昨天上午水群的时候，偶然看到群友装上了kde6，才知道原来kde6稳定版已经出来了。又问了几句，在得知electron程序在wayland模
## [蜗牛星际NAS再次折腾记录](https://my.toho.red/posts/restart-my-hack-synology-nas/)
**作者:** 西行妖
**发表时间:** Sun, 21 Jan 2024 12:18:02 +0800

**摘要:** 前言 距离装修已经过去了快两个月了，我早已用上了快速、稳定、带公网IP的有线网络，以前的mc服、nas也是时候重启了。但由于实在太懒，直到要装
## [2023年度总结](https://my.toho.red/posts/2023summary/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 开场白 随着CS2的某首MVP音乐盒响起，我的2023年已经成为了过去。今年和往常一样，还是在游戏中跨年，唯一的不同是去年玩的是战雷，而且去年
## [CS61B最后的总结：比较排序与基数排序](https://my.toho.red/posts/my-cs61b-summary/)
**作者:** 西行妖
**发表时间:** Wed, 01 Nov 2023 14:55:30 +0800

**摘要:** 前言 距离博客更新又是已经过去了一个月，本来要写的香港游记又不出意外地咕了。虽然看似我什么都没写，但其实我的大部分活动已经转移到memos了（
## [工程机，我劝你别买](https://my.toho.red/posts/never-buy-engineering-sample/)
**作者:** 西行妖
**发表时间:** Sun, 08 Oct 2023 20:53:47 +0800

**摘要:** 前言 在经过几个月其实只有两个月的高强度使用后，我已经无法忍受thinkbook14p g3那谢特一样的60hz屏幕了，正巧这台机挂在闲鱼上接近
## [为thinkbook14p G3更换高刷屏幕](https://my.toho.red/posts/update-screen-on-my-thinkbook14p-g3/)
**作者:** 西行妖
**发表时间:** Fri, 22 Sep 2023 09:11:25 +0800

**摘要:** 前言 距离脱坑chromebook已经有差不多三个月了，我也在卖掉thinkpad c13 yoga后换上了这台thinkbook 14p g3。虽然一开始为
## [专有名词笔记](https://my.toho.red/posts/%E4%B8%93%E6%9C%89%E5%90%8D%E8%AF%8D%E7%AC%94%E8%AE%B0/)
**作者:** 西行妖
**发表时间:** Wed, 20 Sep 2023 22:26:15 +0800

**摘要:** 学校的水课要记的名词有点多，为了方便考前突击，特此列表以方便记忆。 程序设计 accessor method:访问器方法，用于get私有变量。 Mutator methods:
## [时间轴](https://my.toho.red/changelog/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 刚刚更新完评论系统，突然发现本站到现在竟然已经发展了接近3年了。直到现在我才想起应该开一个专门的页面记录本站的发展史，那么现在就以本站转向h
## [谷歌域名即将被收购，如何薅到最后一波羊毛](https://my.toho.red/posts/how-to-buy-cheap-domain-from-google/)
**作者:** 西行妖
**发表时间:** Wed, 30 Aug 2023 12:05:14 +0800

**摘要:** 虽然对谷歌项目火葬场的名声早有耳闻，但却确没想到谷歌能在宣布新tld后不久宣布卖掉谷歌域名，只能说这是我绝对想不到的迷惑操作。距离谷歌发送邮
## [人在囧途——记录我的日本之行](https://my.toho.red/posts/an-unforgettable-trip-in-japan/)
**作者:** 西行妖
**发表时间:** Sun, 20 Aug 2023 13:26:20 +0800

**摘要:** 前言 当我开始写下这篇文时，已经距离回国有将近一个星期了。至于为什么现在才写，而不是在路上边玩边写呢？其实光看标题就能猜到个大概了——由于这是
## [记一次衣服被子被偷的离谱经历](https://my.toho.red/posts/%E8%AE%B0%E4%B8%80%E6%AC%A1%E8%A1%A3%E6%9C%8D%E8%A2%AB%E5%AD%90%E8%A2%AB%E5%81%B7%E7%9A%84%E7%A6%BB%E8%B0%B1%E7%BB%8F%E5%8E%86/)
**作者:** 西行妖
**发表时间:** Sun, 16 Jul 2023 10:52:56 +0800

**摘要:** 2023年7月13日下午，在考完最后一门课后，终于可以逃离离开学校回家与台式机见面了。为了这一刻，我提前几天就已经准备好把所有衣服和被子都收
## [关于本站迁移的公告](https://my.toho.red/posts/announcement-of-website-migration/)
**作者:** 西行妖
**发表时间:** Fri, 14 Jul 2023 14:31:04 +0800

**摘要:** 鉴于以下原因，本站决定从今日起将本站迁移至hugo： sitemap插件失效，导致本站sitemap长时间无法被bing抓取而导致链接全部被撤
## [java的某些常用特性](https://my.toho.red/posts/java-learning-note/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 1.equals()与==的区别 equals()比较的是其中包含的值，而==比较的是对象，也就是两个内容相同字符串变量如果用==进行比较是会
## [python3将对象作为线程使用](https://my.toho.red/posts/131/)
**作者:** 西行妖
**发表时间:** Mon, 10 Jul 2023 11:15:00 +0000

**摘要:** 新建一个对象： class test(Threading.thread): # 当运行start()方法时默认运行此方法 def run(): print(helloworld) 将对象作为新线程启动： test_thread = test() test_thread.start() test_thread.join() ... 这样做的好处：在某些在某一个线程需要调用
## [在Chromebook上使用Windows是什么体验？记录我到目前为止用过的Chromebook](https://my.toho.red/posts/130/)
**作者:** 西行妖
**发表时间:** Mon, 12 Jun 2023 15:15:34 +0000

**摘要:** 前言 在几年前，微信曾经因为背离了”小而美”的初衷，变成了越来越臃肿的“大而丑”引发了不少争议，不少人用“微信OS”来讽刺微信的臃肿。那么问题
## [Chromebook刷bios解除企业锁折腾记录](https://my.toho.red/posts/123/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 在前两天中午，我拿到了一台thinkpad c13 yoga，对于这台机的介绍这里不再重复，下面直接进入正题。 当我像往常那样拔下电池并进入开发者模式
## [Vue3的computed计算属性传参](https://my.toho.red/posts/121/)
**作者:** 西行妖
**发表时间:** Wed, 12 Apr 2023 15:15:00 +0000

**摘要:** 在使用计算属性时，有时需要向其中传参（例如将时间戳转换为时间），以下是一个比较简单的实现方法； {{ auditTime(searchResult.time) }} export default { computed: { auditTime:() => (item) => { //计算属性传递参数
## [在Docker容器中运行服务](https://my.toho.red/posts/120/)
**作者:** 西行妖
**发表时间:** Fri, 24 Mar 2023 20:39:00 +0000

**摘要:** 最近正在写的某个容器升级了一下架构，在启动容器时需要同时运行一个frps服务。根据我的习惯，一开始打算使用systemctl添加frps服务
## [将操作系统从Windows转向Linux](https://my.toho.red/posts/118/)
**作者:** 西行妖
**发表时间:** Wed, 22 Mar 2023 11:31:24 +0000

**摘要:** 前言 在大概两年前，为了体验Linux桌面环境以及满足装逼学习欲望，我便将电脑重装至Kali并没有保留原有系统，打算彻底放弃Windows。但
## [[预告]固态硬盘太贵？试试看自己做一个吧](https://my.toho.red/posts/115/)
**作者:** 西行妖
**发表时间:** Sun, 04 Dec 2022 19:56:00 +0000

**摘要:** 在开学后的一段时间，为了满足我日益增长的娱乐学习需求，现有的512g固态硬盘空间迅速告急，已经无法继续使用了。正巧最近要准备自己硬破swit
## [A卡深度学习服务器折腾&amp;踩坑记](https://my.toho.red/posts/113/)
**作者:** 西行妖
**发表时间:** Sun, 06 Nov 2022 21:22:00 +0000

**摘要:** 作为一个并不上进的带学生，在听说隔壁人工智能专业寒假有旁听网课时，我便立刻报名参加并顺利通过了申请。但这门课有个很坑的地方：设备必须自带。想
## [Ai绘画体验——利用校徽生成对应虚拟形象](https://my.toho.red/posts/108/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 自从novelai发布ai绘画功能以来，ai绘画突然间成为了全网关注焦点。至于原因，当然是因为ai绘画画风终于走出了之前6pen时代的抽象时
## [AutoWhitelist诈尸更新dev&amp;新的未来计划](https://my.toho.red/posts/107/)
**作者:** 西行妖
**发表时间:** Wed, 07 Sep 2022 17:54:00 +0000

**摘要:** 是的，你没有看错：在这个项目停更了接近一个月后，我又将其复活了。为什么说是诈尸更新呢？因为要不是开学没事干，我甚至都想不起我还有这个项目了。
## [它很好，但对我来说不够好——关于华硕无双15.6](https://my.toho.red/posts/106/)
**作者:** 西行妖
**发表时间:** Fri, 26 Aug 2022 15:18:00 +0000

**摘要:** 对于高考后的我而言，没有什么是比换电脑更迫切的事情了。为什么要这么说呢？因为我现在的电脑，还是我小学时买来的——满打满算下来，已经服役超过6
## [[推广]蓝易云暑期大采购活动](https://my.toho.red/posts/102/)
**作者:** 西行妖
**发表时间:** 

**摘要:** “蓝易云”为成都天上云网络科技有限公司旗下运营，是旗下的云计算服务品牌，专注为个人开发者用户、中小型企业用户、大型企业用户提供一站式核心网络
## [Potplayer+SVP4插帧看番体验——24帧日漫轻松提升至60帧](https://my.toho.red/posts/96/)
**作者:** 西行妖
**发表时间:** Mon, 01 Aug 2022 20:05:00 +0000

**摘要:** 最近对电子游戏突然没有了兴趣，反而迷上了看动漫——说来也挺正常，毕竟已经很久没有看过动漫了或许这就是电子阳痿。但在看动漫时，习惯了新电脑12
## [AList搭建教程&amp;网盘迁移至AList公告](https://my.toho.red/posts/90/)
**作者:** 西行妖
**发表时间:** Sat, 30 Jul 2022 11:28:00 +0000

**摘要:** ##前言 好久没看搭建的oneindex了，正当想传点资源上去时，发现oneindex又挂了，主页一片空白。不过oneindex本身的缺点确实
## [Autowhitelist介绍&amp;我对mc白名单的研究](https://my.toho.red/posts/89/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 本文开始之前，先来说说autowhitelist这个项目：这是一个自动添加mc服务器白名单的程序，腐竹可以出题让玩家作答，玩家达到分数线后将
## [还是v2ex大神多，记一次遇到bug被大佬拯救](https://my.toho.red/posts/87/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 最近一直在研究一个项目（预计不久以后就会上线），由于存在客户端长链接播报信息的情况，因此我便开始了解websocket。但在开发的过程中，遇
## [关于MC服务器毁档重开](https://my.toho.red/posts/83/)
**作者:** 西行妖
**发表时间:** Sun, 10 Jul 2022 21:06:00 +0000

**摘要:** 2022年7月1日中午12点半，有玩家在群里报告服务器无法进入。本以为是土豆焦了，但仔细研究后发现没那么简单：重启一段时间内可以进入，但任意
## [对于本站消失的回应](https://my.toho.red/posts/82/)
**作者:** 西行妖
**发表时间:** Fri, 08 Jul 2022 15:48:00 +0000

**摘要:** 太久没上来看了，我甚至注意不到网站突然无法访问了。简单排查了下，发现是白嫖的azure主机由于虚拟信用卡注销而停机，所有搭建在上面的网站统统
## [利用蹩脚的 js 知识写了一个统计真实访客数量的脚本](https://my.toho.red/posts/80/)
**作者:** 西行妖
**发表时间:** Mon, 13 Jun 2022 16:19:00 +0000

**摘要:** 趁着高考结束后闲着无事，入门了网页和小程序开发，刚学完 ajax 没多久，打算写一个小项目作为总结，于是便有了此项目。 本项目基于前端请求后端、后端记录
## [谈谈我高中时用过的手机](https://my.toho.red/posts/79/)
**作者:** 西行妖
**发表时间:** Fri, 10 Jun 2022 22:52:00 +0000

**摘要:** 在高考的最后一天下午，当我走出考场时，我收到了级长给我的两个信封。本以为是某人给我写的情书信，结果到手一掂，才发现是我被收的两台手机。回忆瞬
## [高考前夕，再谈我的想法](https://my.toho.red/posts/75/)
**作者:** 西行妖
**发表时间:** Mon, 06 Jun 2022 18:57:00 +0000

**摘要:** 在我想起找个时间谈谈我对于高考的想法时，距离高考已经只有10天了。但即使平日的假期再怎么闲，到了这时也不得不忙起来备战了。终于能够挤点时间时
## [轻松搭建gitlab私人代码库](https://my.toho.red/posts/68/)
**作者:** 西行妖
**发表时间:** Sun, 29 May 2022 18:11:00 +0000

**摘要:** #前言 在几年前刚接触github的时候，我便得知了gitlab的存在。在我看来，gitlab的页面设计更合我口味，但由于图省事以及穷的原因影
## [每周灵感 - 01](https://my.toho.red/posts/67/)
**作者:** 西行妖
**发表时间:** Sun, 29 May 2022 13:31:00 +0000

**摘要:** #瞎扯淡 在第一期每周灵感写完后几天，我突然间陷入了一种奇怪的状态：想到了记录灵感的时候灵感突然间又没了。也许灵感和兴趣爱好一样，当随便乱想时
## [每周灵感 - 00](https://my.toho.red/posts/66/)
**作者:** 西行妖
**发表时间:** Sun, 22 May 2022 20:35:00 +0000

**摘要:** #前言 当我再次回看以前的文章时，我突然间发现了一个事实：我的更新频率已经变得越来越低，以至于到了几个月才更新一次的程度。虽然从来都没人来催更
## [heroku使用教程——真正的零成本搭建PHP动态博客](https://my.toho.red/posts/61/)
**作者:** 西行妖
**发表时间:** 

**摘要:** #前言 众所周知，大部分的静态网页托管服务(例如vercel、netlify)都是完全免费的，我的mc官网正是托管在vercel上的。但是有没
## [关于tencent-push项目的总结&amp;后续计划](https://my.toho.red/posts/57/)
**作者:** 西行妖
**发表时间:** Fri, 15 Apr 2022 13:30:58 +0000

**摘要:** #前言 回望过去，我已经想不起第一次写项目是什么时候了，也不知道自从会用github起咕掉了多少个项目。我唯一记得并维护至今的项目，只剩下te
## [我们已经失去了辩论能力吗？关于我对“拉黑”的看法](https://my.toho.red/posts/52/)
**作者:** 西行妖
**发表时间:** 

**摘要:** #引子 第一次知道什么是拉黑，还是在小学的时候。当时我还在用今日头条，还是个受公知影响的fq，年龄小加爱辩论的性格让我几乎见到不顺眼的话都要加
## [似乎更不好的近况](https://my.toho.red/posts/40/)
**作者:** 西行妖
**发表时间:** Fri, 08 Apr 2022 22:54:00 +0000

**摘要:** 本来想说什么的，还是算了，就这样吧。 2022.4.8
## [不怎么好的近况](https://my.toho.red/posts/35/)
**作者:** 西行妖
**发表时间:** Mon, 04 Apr 2022 16:32:00 +0000

**摘要:** ##引言 自从3月6日最后更新以来，本站似乎停更很久了，要不是我的教程还有人看的话我都快忘了我还有一个博客。要是说因为咕的话，确实有这部分原因
## [记一次我与某网课系统的对抗](https://my.toho.red/posts/32/)
**作者:** 西行妖
**发表时间:** Sun, 06 Mar 2022 13:03:00 +0000

**摘要:** 今天早上走亲戚的时候，我去亲戚家拜访，家里人打算与亲戚一起出去玩，但我想宅在这边，不想出门。于是亲戚便给了我一个任务：让我帮忙刷网课做任务。
## [高考96天倒计时，我想说的话&amp;以后的一些计划](https://my.toho.red/posts/22/)
**作者:** 西行妖
**发表时间:** Sat, 05 Mar 2022 17:59:00 +0000

**摘要:** 引子 距离开学已经两个星期了，转眼就到了100天倒计时。再次回想，才发现在第96天时，英语听说高考就已经来了。就在今天，我终于体验了提前到来的
## [关于最近俄乌局势我的看法](https://my.toho.red/posts/19/)
**作者:** 西行妖
**发表时间:** Sat, 05 Mar 2022 10:26:00 +0000

**摘要:** 先说结论吧：在经过4天的墙内外反复横跳分析后，我最终站在了俄罗斯这边。至于分析的过程，由于已经承诺不在博客倒垃圾，因此将不会在此处发布，可能
## [本站打算做出的一些改变&amp;我对网左/键政的看法](https://my.toho.red/posts/16/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 本站自从回归以来，相信有不少并不存在的关注本站的网友已经发现了一个问题：本站已经很久没有更新了。当然，这并不是因为我咕了实际上就是，而是因为
## [[转发]我是衡水桃城中学的一名学生](https://my.toho.red/posts/15/)
**作者:** 西行妖
**发表时间:** Wed, 09 Feb 2022 23:18:00 +0000

**摘要:** 今天上午看到了朋友转发校友的发声，想去看原视频发现已经删除了，不知道我的这些话能活多长时间，但我还是想把它说出来。我永远不会删除这个作品，如
## [关于西安节点合作商“昔年”跑路的公告](https://my.toho.red/posts/14/)
**作者:** 西行妖
**发表时间:** Fri, 04 Feb 2022 18:00:00 +0000

**摘要:** 以下是根据时间顺序整理的事情经过： 2022年2月4日12点整，有一个客户突然通知说自己在西安的节点有台机子无法登录，我登录上去后，发现hyp
## [什么才是年轻人需要的文化？我对于“抵制洋节”的看法](https://my.toho.red/posts/13/)
**作者:** 西行妖
**发表时间:** 

**摘要:** ##引子 不知不觉已经到了一月份了，但有的时候我总是感觉圣诞节好像刚刚过去。今年的圣诞节我总觉得有点奇怪的味道，并没有了往日满街的圣诞气氛，只
## [平顶山刘玉坤事件接力](https://my.toho.red/posts/12/)
**作者:** 西行妖
**发表时间:** Wed, 29 Dec 2021 19:15:00 +0000

**摘要:** 12月10日，河南平顶山。15岁少年@平顶山刘玉琨 陆续发视频称被开发商逼的家破人亡，父亲至今没有入土为安，爷爷奶奶因脑溢血瘫痪在床，自己则辍
## [友情链接](https://my.toho.red/links/)
**作者:** 西行妖
**发表时间:** Sun, 19 Dec 2021 11:47:00 +0000

**摘要:** 2023.8.30更新：还是没有找到比较好的友情链接解决方案，只能先这么放着了，以后没准就有了。 关于本站： 名称：西行妖 描述：人生五十年，如梦
## [关于本站数据丢失&amp;抢救](https://my.toho.red/posts/10/)
**作者:** 西行妖
**发表时间:** Sun, 19 Dec 2021 11:42:00 +0000

**摘要:** 今天早上时，正愁没事干，想上来看看访问量时，突然发现本站503了，看报错信息是数据库连不上。想着可能是便宜主机数据库日常爆炸，就自行去后台看
## [关于我](https://my.toho.red/about/)
**作者:** 西行妖
**发表时间:** Sun, 19 Dec 2021 11:04:00 +0000

**摘要:** 这里是某还未想好网名的zsx的博客。 whoami: 雄性，居住地广州，目前带学牲，偶尔会做点生意接点活。 某冷门mc服务器的腐竹(服务器官网求来人嘤嘤嘤)。
## [关于我新搭建的oneindex网盘（附教程）](https://my.toho.red/posts/9/)
**作者:** 西行妖
**发表时间:** Wed, 24 Nov 2021 11:29:00 +0000

**摘要:** 我最近有幸参与了某个项目，项目中需要用到下载节点。刚开始时我脑子里第一个想到的是对象存储+cdn，但联想到oss高额的流量费以及我以前cdn
## [[纯教程]如何搭建QQ微信转发服务器](https://my.toho.red/posts/8/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 更新日志 2022.3.5:配置文件外置，现在已不需要python环境运行 2022.4.3:更换FCM API 2022.4.5:重写架构 声明 本文章为
## [关于我新买的LG V50&amp;如何搭建QQ第三方推送服务器](https://my.toho.red/posts/7/)
**作者:** 西行妖
**发表时间:** Wed, 10 Nov 2021 11:25:00 +0000

**摘要:** 挺久没有更新（咕）了，先和关注本站的（不存在的）网友们问个好，好久不见，让你们久等了。 关于换机的原因 在大概上个月的时候，我刚从学校取回手机，
## [三胎政策的出台，是否意味着政府已经急了？关于我对生育率的思考](https://my.toho.red/posts/6/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 最近的事情突然变得多了起来，先是因为身体的一些原因进了几次医院，耽误了不少时间，现在我的所在地由于又多了几例新增新冠感染病例，全城中小学又回
## [网站更新&amp;迟来的4月总结](https://my.toho.red/posts/3/)
**作者:** 西行妖
**发表时间:** Mon, 10 May 2021 11:11:00 +0000

**摘要:** 话不多说，先说重点吧： 由于考虑到以后备案时没法用根域名挂带评论功能的博客（不知道是不是真的，不过已经有人中招了），而又因为我比较喜欢这个新的
## [如何看待“网抑云”这一现象的流行](https://my.toho.red/posts/5/)
**作者:** 西行妖
**发表时间:** Wed, 19 Aug 2020 11:15:00 +0000

**摘要:** 又是一个晚上0点，当我看到QQ群里又是各种“到点了，上号”的表情包时，突然间对此有感而发，并认真地思考了一下这个现象的本质，写下了这篇文章。
## [如何用阿里云服务器开一个我的世界皮肤站](https://my.toho.red/posts/4/)
**作者:** 西行妖
**发表时间:** 

**摘要:** 2021/12/19更新：阿里云学生机促销没了，可以看看ucloud的新用户优惠，一年最低50块钱（我没有收对面推广费） 链接：www.ucl
