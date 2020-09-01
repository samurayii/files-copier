## Files copier

## Description.

Copier for files/folders with different environments.

install: `npm install files-copier -g `

update: `npm update -g files-copier`

show help: `files-copier -h`

start 'default' environment: `files-copier --config ./config.toml`

start 'dev' environment: `files-copier --config ./config.toml -e dev`

## Configuration.

The configuration file can be two formats toml or json. If the configuration file not specified, used package.json.

### Example config.toml:
```toml
[default]                                   # name of environment
    rewrite = true                          # rewrite file if exists
    [[default.copy]]                        # files/folders array
        from = "default_from_test1.txt"
        to = "default_to_test1.txt"

[dev]
    rewrite = true
    [[dev.copy]]
        from = "dev_from_test1.txt"
        to = "dev_to_test1.txt"
    [[dev.copy]]
        from = "dev_from_folder1"
        to = "dev_to_folder1"
```
### Example package.json:
```js
"copier": {
    "pkg": {
        "rewrite": false,
        "copy": [
            {
                "from": "pkg_from_test1.txt",
                "to": "pkg_to_test1.txt"
            }
        ]
    }
}
```