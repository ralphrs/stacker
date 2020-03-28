// @ts-ignore
import * as pagedown from 'pagedown';
import {HttpRequest} from '@/http/http-request';

export type PluginData = {
        readme: string;
        author: string;
        picture: string;
        javascript: string;
        size: string;
    }

//TODO test it
export class PluginDataFetcher {
    private readonly httpRequest = new HttpRequest();
    private readonly converter = new pagedown.Converter();
    private readonly plugin: any;

    public constructor(plugin: any) {
        this.plugin = plugin;
    }

    public async fetch(): Promise<PluginData> {
        const javascript = await this.httpRequest
            .request(this.plugin.javascriptUrl);

        return {
            readme: await this.fetchReadme(),
            picture: this.plugin.logo,
            author: this.plugin.author,
            javascript: javascript.data,
            size: (javascript.data.length / 1024).toFixed(2),
        }
    }

    private async fetchReadme() {
        const repoUrl = this.plugin.repositoryUrl.split('/');
        const user = repoUrl[repoUrl.length - 2];
        const repo = repoUrl[repoUrl.length - 1];

        const readme: string = (await this.httpRequest
            .request(this.plugin.readme)).data;

        return this.converter.makeHtml(readme)
            .replace(/<img/g, '<img class="img-fluid" ')
            .replace(/<h(\d)/g, (match: string, level: number) => `<h${Math.min(level + 2, 6)}`)
            .replace(/<a/g, '<a target="_blank"')
            .replace(/src="([^"]*)/g, (match: string, url: string) => {
                if (url.startsWith('http')) {
                    return match;
                }
                return `src="https://raw.githubusercontent.com/${user}/${repo}/master/${url}`;
            });
    }
}