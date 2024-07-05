import Modifier, {BuildingModifier, ModifierClassification} from "./Modifier.ts";

interface ClassifiedModifierContainer<C extends ModifierClassification, M extends Modifier>
    extends Iterable<ContainerModifier<C, M>> {
    readonly modifiers: Readonly<ContainerModifier<C, M>[]>;
    addModifier(modifier: ContainerModifier<C, M>): void;
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

    addModifier<M extends Modifier>(modifier: M) {
        switch (modifier.classification) {
            case "per-click": {
                this.perClickModifiers.addModifier(modifier);
            }
                break;
            case "building-pcps": {
                this.pcpsPerBuildingModifiers.addModifier(modifier);
            }
                break;
            case "build-time": {
                this.buildTimeModifiers.addModifier(modifier);
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
    readonly modifiers: ContainerModifier<C, Modifier>[];

    constructor() {
        this.modifiers = [];
    }

    addModifier(modifier: ContainerModifier<C, Modifier>): void {
        this.modifiers.push(modifier);
    }



    [Symbol.iterator](): Iterator<ContainerModifier<C, Modifier>> {
        return this.modifiers[Symbol.iterator]();
    }
}

class BuildingModifierContainerImpl<C extends ModifierClassification> implements BuildingModifierContainer<C, Modifier & BuildingModifier> {
    private readonly _modifiers: Map<string, ContainerModifier<C, BuildingModifier & Modifier>[]>;

    constructor() {
        this._modifiers = new Map();
    }

    addModifier(modifier: ContainerModifier<C, Modifier & BuildingModifier>): void {
        const buildingId = modifier.buildingId;
        if (!this._modifiers.has(buildingId)) {
            this._modifiers.set(buildingId, []);
        }
        this._modifiers.get(buildingId)!.push(modifier);
    }

    getBuildingModifiers(buildingId: string): ContainerModifier<C, BuildingModifier & Modifier>[] {
        return this._modifiers.get(buildingId) || [];
    }

    get modifiers(): (ContainerModifier<C, BuildingModifier & Modifier>)[] {
        return [...this._modifiers.values()].flatMap((v) => v);
    }

    [Symbol.iterator](): Iterator<ContainerModifier<C, BuildingModifier & Modifier>> {
        return this.modifiers[Symbol.iterator]();
    }
}