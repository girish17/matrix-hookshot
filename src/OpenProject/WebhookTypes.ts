/* eslint-disable camelcase */

export interface IOpenProjectWebhookEvent {
    object_kind: string;
}

export interface IOpenProjectUser {
    name: string;
    username: string;
    avatar_url: string;
    email: string;
}
export interface IOpenProjectRepository {
    name: string;
    homepage: string;
    url: string;
    description: string;
}


export interface IOpenProjectProject {
    path_with_namespace: string;
    web_url: string;
    homepage: string;
}

export interface IOpenProjectIssue {
    iid: number;
    description: string;
}

export interface IOpenProjectMergeRequest {
    url: string;
    title: string;
    iid: number;
    author_id: number;
    state: 'opened'|'closed'|'merged';

}

export interface IOpenProjectMergeRequestObjectAttributes extends IOpenProjectMergeRequest {
    action: "open"|"close"|"reopen"|"approved"|"unapproved"|"merge";
}

export interface IOpenProjectLabel {
    id: number;
    title: string;
    color: string;
    project_id: number;
    created_at: string;
    updated_at: string;
    template: boolean;
    description: string;
    type: "ProjectLabel"|"GroupLabel";
    group_id: number;
}

export interface IOpenProjectWebhookMREvent {
    object_kind: "merge_request";
    event_type: string;
    user: IOpenProjectUser;
    project: IOpenProjectProject;
    repository: IOpenProjectRepository;
    object_attributes: IOpenProjectMergeRequestObjectAttributes;
    labels: IOpenProjectLabel[];
    changes: {
        draft?: {
            previous: boolean;
            current: boolean;
        }
    }
}

export interface IOpenProjectWebhookTagPushEvent {
    object_kind: "tag_push";
    user_id: number;
    ref: string;
    user_name: string;
    /**
     * Commit hash before push
     */
    before: string;
    /**
     * Commit hash after push
     */
    after: string;
    project: IOpenProjectProject;
    repository: IOpenProjectRepository;
}

export interface IOpenProjectWebhookPushEvent {
    object_kind: "push";
    /**
     * Commit hash before push
     */
    before: string;
    /**
     * Commit hash after push
     */
    after: string;
    ref: string;
    user_id: number;
    user_name: string;
    user_email: string;
    project: IOpenProjectProject;
    repository: IOpenProjectRepository;
    commits: [{
      id: string,
      message: string,
      title: string,
      timestamp: string,
      url: string,
      author: {
        "name": string,
        "email": string
      },
      added: string[],
      modified: string[],
      removed: string[],
    }],
    total_commits_count: number,
}

export interface IOpenProjectWebhookWikiPageEvent {
    object_kind: "wiki_page";
    user: IOpenProjectUser;
    project: IOpenProjectProject;
    wiki: {
        web_url: string;
        path_with_namespace: string;
    };
    object_attributes: {
        title: string;
        url: string;
        message: string;
        format: "markdown";
        content: string;
        action: "create"|"update"|"delete";
    };
}

export interface IOpenProjectWebhookReleaseEvent {
    object_kind: "release";
    description: string;
    name: string;
    tag: string;
    created_at: string;
    released_at: string;
    url: string;
    action: "create";
    project: IOpenProjectProject;
    commit: {
        id: string;
        message: string;
        title: string;
        timestamp: string;
        url: string;
        author: {
            name: string;
            email: string;
        };
    };
    assets: {
        count: number;
        links: [{
            id: string;
            external: boolean;
            link_type: "other";
            name: string;
            url: string;
        }],
        sources: [{
            format: string;
            url: string;
        }]
    }
}

export interface IOpenProjectNote {
    id: number;
    note: string;
    noteable_type: 'MergeRequest';
    author_id: number;
    noteable_id: number;
    description: string;
    discussion_id?: string;
}

export interface IOpenProjectWebhookNoteEvent {
    user: IOpenProjectUser;
    event_type: string;
    project: IOpenProjectProject;
    issue?: IOpenProjectIssue;
    repository: IOpenProjectRepository;
    object_attributes: IOpenProjectNote;
    merge_request?: IOpenProjectMergeRequest;
}
export interface IOpenProjectWebhookIssueStateEvent {
    user: IOpenProjectUser;
    event_type: string;
    project: IOpenProjectProject;
    repository: {
        name: string;
        url: string;
        description: string;
        homepage: string;
    };
    object_attributes: {
        id: number;
        iid: number;
        action: string;
        description: string;
    }
}
