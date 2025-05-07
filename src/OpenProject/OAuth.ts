import { OpenProjectOAuthResult } from "./Types";

export interface OpenProjectOAuth {
    getAuthUrl(state: string): Promise<string>;
    exchangeRequestForToken(codeOrToken: string,verifier?: string): Promise<OpenProjectOAuthResult>;
}

export interface OpenProjectOAuthRequestCloud {
    state: string;
    code: string;
}

export interface OpenProjectOAuthRequestOnPrem {
    state: string;
    oauthToken: string;
    oauthVerifier: string;
}

export enum OpenProjectOAuthRequestResult {
    UnknownFailure,
    Success,
    UserNotFound,
}

export function encodeOpenProjectToken(oauthToken: string, oauthTokenSecret: string): string {
    return `openproject-oauth1.0:${oauthToken}/${oauthTokenSecret}`;
}

export function decodeOpenProjectToken(token: string): {oauthToken: string, oauthTokenSecret: string} {
    const [ oauthToken, oauthTokenSecret] = token.substring("openproject-oauth1.0:".length).split('/');
    return { oauthToken, oauthTokenSecret };
}