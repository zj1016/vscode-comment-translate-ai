import axios from 'axios';
import { workspace } from 'vscode';
import { ITranslate, ITranslateOptions } from 'comment-translate-manager';
import * as crypto from 'crypto';

interface GlmTranslateOption {
    apiUrl?: string;
}

interface Config {
    maxTranslationLength: number;
    apiUrl: string;
    apiKey: string;
    model: string;
    doSample: boolean;
    temperature: number;
    topP: number;
    systemPrompt: string;
    prompt: string;
    user_id: string;
    sourceLanguage: string;
    targetLanguage: string;
}

export class GlmTranslate implements ITranslate {
    maxLen: number;
    private _defaultOption: GlmTranslateOption;
    private readonly _translateApiUrl: string;
    private _config: Config;
    private _generatedUserId: string | null = null;

    constructor() {
        this._config = this.loadConfig();
        this._translateApiUrl = this._config.apiUrl;
        this._defaultOption = this.createOption();
        // 监听配置变化
        workspace.onDidChangeConfiguration(this.handleConfigurationChange);
    }

    private loadConfig(): Config {
        const user_id = workspace.getConfiguration('GlmTranslate').get<string>('user_id') || this._generatedUserId;
        if (!user_id) {
            this._generatedUserId = this.generateUniqueId();
        }

        return {
            maxTranslationLength: workspace.getConfiguration('commentTranslate').get<number>('maxTranslationLength') || 4095,
            apiUrl: workspace.getConfiguration('GlmTranslate').get<string>('apiUrl') || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            apiKey: workspace.getConfiguration('GlmTranslate').get<string>('apiKey'),
            model: workspace.getConfiguration('GlmTranslate').get<string>('model') || 'glm-4-flash',
            doSample: workspace.getConfiguration('GlmTranslate').get<boolean>('doSample') || true,
            temperature: workspace.getConfiguration('GlmTranslate').get<number>('temperature') || 0.95,
            topP: workspace.getConfiguration('GlmTranslate').get<number>('topP') || 0.70,
            systemPrompt: workspace.getConfiguration('GlmTranslate').get<string>('systemPrompt') || '',
            prompt: workspace.getConfiguration('GlmTranslate').get<string>('prompt') || '',
            user_id: user_id || this._generatedUserId,
            sourceLanguage: workspace.getConfiguration('commentTranslate').get<string>('sourcelanguage') || 'EN',
            targetLanguage: workspace.getConfiguration('commentTranslate').get<string>('targetLanguage') || 'zh-CN',
        };
    }

    private generateUniqueId(): string {
        const id = crypto.randomBytes(16).toString('hex');
        return id.substring(0, Math.min(128, id.length));
    }

    private handleConfigurationChange = (event: any) => {
        if (event.affectsConfiguration('commentTranslate') || event.affectsConfiguration('GlmTranslate')) {
            this._config = this.loadConfig();
            this._defaultOption = this.createOption();
        }
    };

    createOption(): GlmTranslateOption {
        return {
            apiUrl: this._translateApiUrl
        };
    }

    private replacePlaceholders(template: string, data: { [key: string]: string }): string {
        return Object.keys(data).reduce((acc, key) => acc.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), data[key]), template);
    }

    async translate(content: string): Promise<string> {
        if (!this._config.apiKey) {
            return "API key is required but not provided in the configuration.";
        }
        // 如果 systemPrompt 或 prompt 提供了，则替换占位符
        let systemPrompt = this._config.systemPrompt;
        let prompt = this._config.prompt;
        if (systemPrompt) {
            systemPrompt = this.replacePlaceholders(systemPrompt, {
                source: this._config.sourceLanguage,
                target: this._config.targetLanguage
            });
        }
        if (prompt) {
            prompt = this.replacePlaceholders(prompt, {
                content,
                target: this._config.targetLanguage,
                source: this._config.sourceLanguage
            });
        }
        const requestPayload = {
            model: this._config.model,
            messages: [
                {
                    role: "system", content: systemPrompt || `You are a sophisticated translation engine with expertise in GitHub content, capable of translating texts accurately into the specified target language, preserving technical terms, code snippets, markdown formatting, and platform-specific language. Do not add any explanations or annotations to the translated text. Ensure the original technical terms, code snippets, markdown formatting, and platform-specific language are accurately translated and retain their original formatting. Do not include explanations or annotations.\nSource Language: ${this._config.sourceLanguage}\nTarget Language: ${this._config.targetLanguage}`
                },
                { role: "user", content: prompt || `Translate the following GitHub content to ${this._config.targetLanguage}:${content}` }
            ],
            max_tokens: this._config.maxTranslationLength,
            do_sample: this._config.doSample,
            temperature: this._config.temperature,
            top_p: this._config.topP,
            user_id: this._config.user_id
        };


        try {
            console.log('Request Payload:', this._config.apiKey); // 添加日志打印请求内容
            console.log('Request Payload:', this._config.apiUrl);
            const response = await axios.post(this._translateApiUrl, requestPayload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this._config.apiKey}`
                }
            });
            console.log('Response:', response.data); // 添加日志打印响应内容
            if (response.status === 200) {
                const translatedContent = response.data.choices[0].message.content;
                return translatedContent;
            } else {

                throw new Error(`翻译失败了: ${response.status}`);
            }
        } catch (error) {
            const errorMessage = error.response
                ? `${error.response.status} - ${error.response.data.message}`
                : error.request
                    ? '请求未响应'
                    : error.message;
            throw new Error(`未知错误: ${errorMessage}`);
        }
    }

    link(content: string, { to = 'auto' }: ITranslateOptions): string {
        // 根据需要实现链接生成逻辑
        return '';
    }

    isSupported(src: string): boolean {
        // 根据需要实现语言支持检查逻辑
        return true;
    }
}