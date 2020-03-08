export function setNonReactiveProps(comp: Vue, props: { [key: string]: any }) {
    Object.keys(props).forEach(key => setNonReactiveProp(comp, key, props[key]))
}

export function setNonReactiveProp(comp: Vue, key: string, value: any) {
    const val = (comp as any)[key];
    if (val !== undefined) {
        throw Error(`Property "${key}" already exists on component`)
    }
    (comp as any)[key] = value
}

export function initNonReactiveProp(comp: Vue, key: string, factory: () => any) {
    const val = (comp as any)[key];
    if (val === undefined) {
        (comp as any)[key] = factory()
    }
}

export function removeNonReactiveProp(comp: Vue, key: string, factory: (val: any) => any) {
    const val = (comp as any)[key];
    if (val !== undefined) {
        factory(val)
        delete (comp as any)[key] 
    }
}

export function getNonReactiveProp<T>(comp: Vue, key: string): T {
    return (comp as any)[key]
}