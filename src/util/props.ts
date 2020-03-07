export function nonReactiveProps(comp: Vue, props: { [key: string]: any }) {
    Object.keys(props).forEach(key => (comp as any)[key] = props[key])
}

export function nonReactiveProp<T>(comp: Vue, key: string): T {
    return (comp as any)[key]
}