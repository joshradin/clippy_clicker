import Modifier, {BuildingModifier, ModifierClassification} from "./Modifier.ts";
import Badge from "./Badge.ts";
import Upgrade from "./Upgrade.ts";
import _ from "lodash";

export type ModifierOwner =
    | { ownerType: "badge", id: Badge["id"] }
    | { ownerType: "upgrade", id: Upgrade["id"] };

interface ClassifiedModifierContainer<C extends ModifierClassification, M extends Modifier>
    extends Iterable<ContainerModifier<C, M>> {
    readonly modifiers: ContainerModifier<C, M>[];

    addModifier(modifier: ContainerModifier<C, M>, owner?: ModifierOwner): void;

    /**
     * Remove modifiers owned by something
     * @param owner the owner
     */
    removeModifiers(owner: ModifierOwner): boolean;
}

interface BuildingModifierContainer<C extends ModifierClassification, M extends Modifier & BuildingModifier>
    extends ClassifiedModifierContainer<C, M> {
    getBuildingModifiers(buildingId: string): ContainerModifier<C, M>[];
}

type ContainerModifier<C extends ModifierClassification, M extends Modifier> = M & { classification: C };

/**
 * Stores all modifiers
 */
export default class ModifierContainer implements Iterable<Modifier> {
    readonly buildTimeModifiers: ClassifiedModifierContainer<"build-time", Modifier>;
    readonly pcpsPerBuildingModifiers: BuildingModifierContainer<"building-pcps", Modifier & BuildingModifier>;
    readonly perClickModifiers: ClassifiedModifierContainer<"per-click", Modifier>;

    constructor(...defaultModifiers: Modifier[]) {
        this.buildTimeModifiers = new ClassifiedModifierContainerImpl<"build-time">();
        this.pcpsPerBuildingModifiers = new BuildingModifierContainerImpl<"building-pcps">();
        this.perClickModifiers = new ClassifiedModifierContainerImpl();

        for (const modifier of defaultModifiers) {
            this.addModifier(modifier);
        }
    }

    addModifier<M extends Modifier>(modifier: M, owner?: ModifierOwner) {
        switch (modifier.classification) {
            case "per-click": {
                this.perClickModifiers.addModifier(modifier, owner);
            }
                break;
            case "building-pcps": {
                this.pcpsPerBuildingModifiers.addModifier(modifier, owner);
            }
                break;
            case "build-time": {
                this.buildTimeModifiers.addModifier(modifier, owner);
            }
                break;
        }
    }

    all(): Modifier[] {
        const all: Modifier[] = [];
        for (const container of [this.buildTimeModifiers, this.perClickModifiers, this.pcpsPerBuildingModifiers]) {
            all.push(...container);
        }
        return all;
    }

    [Symbol.iterator](): Iterator<Modifier> {
        return this.all()[Symbol.iterator]();
    }
}

class ClassifiedModifierContainerImpl<C extends ModifierClassification> implements ClassifiedModifierContainer<C, Modifier> {
    private readonly unownedModifiers: ContainerModifier<C, Modifier>[];
    private readonly ownedModifiers: Map<ModifierOwner, ContainerModifier<C, Modifier>[]>;

    constructor() {
        this.unownedModifiers = [];
        this.ownedModifiers = new Map();
    }

    addModifier(modifier: ContainerModifier<C, Modifier>, owner?: ModifierOwner): void {
        if (!owner) {
            this.unownedModifiers.push(modifier);
        } else {
            const next = this.ownedModifiers.get(owner) || [];
            next.push(modifier);
            this.ownedModifiers.set(owner, next);
        }
    }

    removeModifiers(owner: ModifierOwner): boolean {
        return this.ownedModifiers.delete(owner);
    }


    get modifiers(): ContainerModifier<C, Modifier>[] {
        const emit: ContainerModifier<C, Modifier>[] = [...this.unownedModifiers];
        emit.push(..._.flatten([...this.ownedModifiers.values()]));
        return emit;
    }


    [Symbol.iterator](): Iterator<ContainerModifier<C, Modifier>> {
        return this.modifiers[Symbol.iterator]();
    }
}

class BuildingModifierContainerImpl<C extends ModifierClassification> implements BuildingModifierContainer<C, Modifier & BuildingModifier> {
    private readonly unownedModifiers: Map<string, ContainerModifier<C, BuildingModifier & Modifier>[]>;
    private readonly ownedModifiers: Map<ModifierOwner, Map<string, ContainerModifier<C, BuildingModifier & Modifier>[]>>;

    constructor() {
        this.unownedModifiers = new Map();
        this.ownedModifiers = new Map();
    }

    private getMap(owner: ModifierOwner | undefined): Map<string, ContainerModifier<C, BuildingModifier & Modifier>[]> {
        if (owner) {
            if (!this.ownedModifiers.has(owner)) {
                const map: Map<string, ContainerModifier<C, BuildingModifier & Modifier>[]> = new Map();
                this.ownedModifiers.set(owner, map);
                return map;
            } else {
                return this.ownedModifiers.get(owner)!;
            }
        } else {
            return this.unownedModifiers;
        }
    }

    addModifier(modifier: ContainerModifier<C, Modifier & BuildingModifier>, owner?: ModifierOwner): void {
        const buildingId = modifier.buildingId;
        const map = this.getMap(owner);

        const modifiers = map.get(buildingId) || [];
        modifiers.push(modifier);
        map.set(buildingId, modifiers);
    }

    removeModifiers(owner: ModifierOwner): boolean {
        return this.ownedModifiers.delete(owner);
    }

    getBuildingModifiers(buildingId: string): ContainerModifier<C, BuildingModifier & Modifier>[] {
        return this.modifiers.filter(modifier => modifier.buildingId === buildingId);
    }

    get modifiers(): (ContainerModifier<C, BuildingModifier & Modifier>)[] {
        const emit: ContainerModifier<C, BuildingModifier & Modifier>[] = _.flatten([...this.unownedModifiers.values()]);
        emit.push(..._.flatMap([...this.ownedModifiers.values()], (v) => _.flatten([...v.values()])));
        return emit;
    }

    [Symbol.iterator](): Iterator<ContainerModifier<C, BuildingModifier & Modifier>> {
        return this.modifiers[Symbol.iterator]();
    }
}