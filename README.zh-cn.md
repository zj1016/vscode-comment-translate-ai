# AI翻译中文文档

[中文](README.zh-cn.md) / [English Document](README.md)


免费的AI翻译插件！

## 使用方法

⚠️ 该插件为‘comment-translate’插件提供翻译源，首先需要安装扩展'[comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate)'才能使用。

> [comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate)安装完成后再安装本扩展。
> 

1. 调用“Comment Translate”的“更改翻译源”命令，更改翻译源为Glm翻译。
   (Shift+Ctrl+P 选择"更改翻译源"，选择Glm-translate) 

    ![change](https://i.postimg.cc/LX0hz6hn/change.png)

2. 免费申请 智普API:[glm-4-flash AI](https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys>),我们用的是glm-4-flash API,免费的，然后在vscode插件中配置Glm API,当然你也可以使用其他gml的模型，都在插件中配置。

    ![select](https://i.postimg.cc/c12rCHVz/select.png)

3. 设置完成,如果想要翻译更人性化或其他标准,可在设置自定义系统提示词,用户提示词。  
   (\${source}为提供给AI需要翻译的类型，\${target}为提供给AI的目标语言，\${content}为提供给AI的文本内容)  

   😊默认的\${source}和\${target}从[comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate)配置中获取。
