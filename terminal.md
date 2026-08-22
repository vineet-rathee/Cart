On Mac/Linux terminal:

### Create a folder

```bash
mkdir folderName
```

Example:

```bash
mkdir product
```

### Create a file

```bash
touch server.js
```

### Create folder + file inside it

```bash
mkdir product
touch product/server.js
```

### Create multiple folders

```bash
mkdir auth product gateway
```

### Create nested folders

```bash
mkdir -p product/src/configs
```

Then create a file inside:

```bash
touch product/src/configs/mongoose.js
```

### Useful commands

```bash
cd folderName       # enter folder
cd ..               # go back
pwd                 # show current location
ls                  # list files/folders
ls -la              # show hidden files too
```

For example, to quickly create your microservice structure:

```bash
mkdir -p gateway auth product
touch gateway/server.js auth/server.js product/server.js
```

Then:

```bash
ls
```

will show:

```text
auth
gateway
product
```
