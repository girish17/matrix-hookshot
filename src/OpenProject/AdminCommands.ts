import { AdminRoomCommandHandler, Category } from "../AdminRoomCommandHandler";
import { botCommand } from "../BotCommands";
import { Logger } from "matrix-appservice-bridge";
import { BridgePermissionLevel } from "../config/Config";

const log = new Logger('OpenProjectBotCommands');

export class OpenProjectBotCommands extends AdminRoomCommandHandler {
    @botCommand("openproject login", {help: "Log in to OpenProject", category: Category.OpenProject, permissionLevel: BridgePermissionLevel.login})
    public async loginCommand() {
        if (!this.config.openproject?.oauth || !this.tokenStore.openprojectOAuth) {
            this.sendNotice(`Bot is not configured with OpenProject OAuth support.`);
            return;
        }
        const state = this.tokenStore.createStateForOAuth(this.userId);
        const url = await this.tokenStore.openprojectOAuth?.getAuthUrl(state);
        await this.sendNotice(`Open ${url} to link your account to the bridge.`);
    }


    @botCommand("openproject logout", {help: "Clear any login information", category: Category.OpenProject, permissionLevel: BridgePermissionLevel.login})
    public async logout() {
        if (!this.config.openproject?.oauth || !this.tokenStore.openprojectOAuth) {
            this.sendNotice(`Bot is not configured with OpenProject OAuth support.`);
            return;
        }
        if (await this.tokenStore.clearUserToken("openproject", this.userId, this.config.openproject.instances)) {
            return this.sendNotice(`Your OpenProject account has been unlinked from your Matrix user.`);
        }
        return this.sendNotice(`No OpenProject account was linked to your Matrix user.`);
    }

    @botCommand("openproject whoami", {help: "Determine OpenProject identity", category: Category.OpenProject, permissionLevel: BridgePermissionLevel.login})
    public async whoami() {
        if (!this.config.openproject) {
            await this.sendNotice(`Bot is not configured with OpenProject OAuth support.`);
            return;
        }
        const client = await this.tokenStore.getOpenProjectForUser(this.userId, this.config.openproject.url);
        
        if (!client) {
            await this.sendNotice(`You are not logged into OpenProject.`);
            return;
        }
        // Get all resources for user
        let resources: OpenProjectAPIAccessibleResource[];
        try {
            resources = await client.getAccessibleResources();
        } catch (ex) {
            log.warn(`Could not request resources from OpenProject API: `, ex);
            await this.sendNotice(`Could not request OpenProject resources due to an error.`);
            return;
        }
        let response = resources.length === 0 ?  `You do not have any instances authorised with this bot.` : 'You have access to the following instances:';
        for (const resource of resources) {
            const clientForResource = await client.getClientForResource(resource);
            if (!clientForResource) {
                continue;
            }
            const user = await clientForResource.getCurrentUser();
            response +=
                `\n - ${resource.name}` +
                (user.name ? ` ${user.name}` : "") +
                (user.displayName ? ` (${user.displayName})` : "");
        }
        await this.sendNotice(response);
    }
}
