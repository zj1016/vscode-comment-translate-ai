# AI translate English Description

[中文文档](README.zh-cn.md) / [English ](README.md)

Free AI translation plugin!

## Usage

⚠️ This plugin provides a translation source for the 'comment-translate' plugin. First, you need to install the extension '[comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate)' before using it.

> Install [comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate) first and then install this extension.
> 

1. Call the "Comment Translate" command "Change Translation Source", change the translation source to Glm translate.  
   (Shift+Ctrl+P select "Change Translation Source" and choose Glm-translate)  

    ![change](https://i.postimg.cc/LX0hz6hn/change.png)

2. Apply for ZhiPu API free of charge: [glm-4-flash AI](https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys), we use glm-4，is free, and then configure the Glm API in the vscode plugin. You can also use other glm models, all configured in the plugin.

    ![select](https://i.postimg.cc/c12rCHVz/select.png)

3. Set up is complete  
   🤡if you want to change the target language and translation language, please change it in [comment-translate](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate).
   
   🤡If you want to change the translation style, you can set the custom system prompt and user prompt in this plugin.
   
   (There are three placeholders, \${source} is the type provided to AI for translation, \${target} is the target language provided to AI, and \${content} is the text content provided to AI)  

   