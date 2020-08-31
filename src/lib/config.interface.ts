export interface IEnvironmentConfig {
    [key: string]: string
}

export interface ICliConfig {
    default: IEnvironmentConfig
    [key: string]: IEnvironmentConfig
}