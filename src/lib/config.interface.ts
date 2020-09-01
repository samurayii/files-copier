export interface IEnvironmentConfig {
    rewrite: boolean
    copy: {
        from: string
        to: string
    }[]
}

export interface ICliConfig {
    default: IEnvironmentConfig
    [key: string]: IEnvironmentConfig
}