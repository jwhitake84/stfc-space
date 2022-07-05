import { createIttyDurable } from 'itty-durable';
import { nanoid } from 'nanoid'

const DurableObjectBase = createIttyDurable({
    persistOnChange: true
});

export class UserStorage extends DurableObjectBase {
    private settings: object = {};
    private game_profiles: Record<string, object> = {};

    constructor(state: DurableObjectState, env: {}) {
        super(state, env)
    }

    // TODO(alexander): We _should_ do some sort of schema validation here :)
    public getSettings() {
        return this.settings
    }
    public setSettings(settings: object) {
        this.settings = settings;
    }

    public createGameProfile(profile: object) {
        const id = nanoid();
        this.game_profiles[id] = profile;
        return id;
    }

    public getGameProfiles() {
        return this.game_profiles;
    }
    public getGameProfile(id: string) {
        return this.game_profiles[id];
    }
    public updateGameProfile(id: string, content: object) {
        return this.game_profiles[id] = content;
    }
    public deleteGameProfile(id: string) {
        delete this.game_profiles[id];
    }
}