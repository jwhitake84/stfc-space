import { createIttyDurable } from 'itty-durable';
import { nanoid } from 'nanoid'

const DurableObjectBase = createIttyDurable({
    autoPersist: false
});

export class UserStorage extends DurableObjectBase {
    private settings: object = {};
    private game_profiles: Record<string, object> = {};

    constructor(state: DurableObjectState, env: {}) {
        super(state, env)
    }

    // TODO(alexander): We _should_ do some sort of schema validation here :)
    public get getSettings() {
        return this.settings
    }

    public setSettings(settings: object) {
        this.settings = settings;
        this.persist();
    }

    public createGameProfile(profile: object) {
        const id = nanoid();
        this.game_profiles[id] = profile;
        this.persist();
        return id;
    }

    public get getGameProfiles() {
        return Object.entries(this.game_profiles).map(([k, v]) => {
            return { id: k, ...(v as object) };
        });
    }
    public getGameProfile(id: string) {
        return this.game_profiles[id];
    }
    public updateGameProfile(id: string, content: object) {
        this.game_profiles[id] = content;
        this.persist();
    }
    public deleteGameProfile(id: string) {
        delete this.game_profiles[id];
        this.persist();
    }
}