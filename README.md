# IBM Digital Experience File Sync
Digital Experience File Sync synchronizes any WebDAV-based WebSphere® Portal themes with your local workstation. It replaces your existing WebDAV client and watches file system changes in the background.

Digital Experience File Sync pulls the theme files to your work station and uploads any changes you make. It runs on Windows, OSX, and Linux. Digital Experience File Sync is unsupported and can be used on WebSphere Portal version 8.5.

# Installation
1. Install node.js. You must have Node V0.12 to install Digital Experience File Sync.  

    If you are using Windows or OSX, [download node.js](https://nodejs.org/download/) and use the appropriate installer for your system.  

    If you are using Linux, find the appropriate installation script on [Github] (https://github.com/creationix/nvm). If you are not a root user, add sudo to the beginning of the command. 

   Note: You can verify that node.js is installed by running the following commands:

     `node -v`

     `npm -v`

4. Download the newest stable release of [Digital Experience File Sync](https://github.com/digexp/dxsync/blob/master/release/DXSyncCLI-1.0.2.zip?raw=true).  

5. Extract the file.  

6. Change to the extracted directory and run `install.cmd` if you are using Windows or `install.sh` for Linux or OSX.

## First Steps
When you create a new theme for WebSphere Portal, you can edit your files locally. You can choose which directory you want to synchronize with your server. You must initialize DXSync to synchronize with a directory.

1. Create a new local directory, for example, `/themedev`

2. In the command line, change to your new directory, for example, `cd /themedev`

3. Run the `dxsync init` command to initialize a theme with your new directory.

4. Respond to the following prompts to connect to your server:
	* Hostname: Defines the hostname of your server
	* Username: Defines your user name
	* Password: Defines your password
	* Path to the content handler servlet: Defines the path to your content handler servlet. The default is `/wps/mycontenthandler`
	* Secure connection: Defines whether DXSync connects to the server securely or unsecurely
	* Port: Defines your port. The default for a secure connection is `10041`. The default for an unsecure connection is `10039`.
	* Theme: Defines the theme that you are synchronizing. DXSync provides a numbered list of available themes. Choose the number that corresponds to the theme that you want to synchronize.

5. Start DXSync by running the following command: `dxsync run`

6. Because your local directory is empty, DXSync will download all files from the remote server to `/themedev`. After it is finished, you can change the files locally in your favorite editor, and the files will automatically upload in the background.

For more information, please see the [IBM Digital Experience File Sync wiki] (https://github.com/digexp/dxsync/wiki).
