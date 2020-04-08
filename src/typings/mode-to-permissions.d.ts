declare module 'mode-to-permissions' {
    export interface PermissionFlags {
        owner: boolean 
        group: boolean
        others: boolean
    }
    export interface Permissions {
        read: PermissionFlags
        write: PermissionFlags
        execute: PermissionFlags
    }
    const modeToPermissions: (mode: number) => Permissions
    export default modeToPermissions
}