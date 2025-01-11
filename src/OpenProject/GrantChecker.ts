import { Logger } from "matrix-appservice-bridge";
import { Appservice } from "matrix-bot-sdk";
import { BridgeConfigOpenProject } from "../config/Config";
import { OpenProjectConnection } from "../Connections";
import { GrantChecker } from "../grants/GrantCheck";
import { UserTokenStore } from "../tokens/UserTokenStore";

const log = new Logger('OpenProjectGrantChecker');

interface OpenProjectGrantConnectionId{
    instance: string;
    path: string;
}



export class OpenProjectGrantChecker extends GrantChecker<OpenProjectGrantConnectionId> {
    constructor(private readonly as: Appservice, private readonly config: BridgeConfigOpenProject, private readonly tokenStore: UserTokenStore) {
        super(as.botIntent, "OpenProject")
    }

    protected async checkFallback(roomId: string, connectionId: OpenProjectGrantConnectionId, sender?: string) {
        if (!sender) {
            log.debug(`Tried to check fallback for ${roomId} with a missing sender`);
            // Cannot validate without a sender.
            return false;
        }
        if (this.as.isNamespacedUser(sender)) {
            // Bridge is always valid.
            return true;
        }
        try {
            await OpenProjectConnection.assertUserHasAccessToProject(connectionId.instance, connectionId.path, sender, this.tokenStore, this.config);
            return true;
        } catch (ex) {
            log.info(`${sender} does not have access to ${connectionId.instance}/${connectionId.path}`, ex);
            return false;
        }
    }
}