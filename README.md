# IBM Digital Experience File Sync
Allows to connect to a theme stored on any IBM WebSphere Portal Server and synchronize its WebDAV content to your local harddrive. When the tool is running in the background it will watch all file and directory changes locally and synchronize all changes into the remote repository.

The tool supports full 2-way synchronization and can recognize when a file has been changed locally or on the remote server. It will automatically upload or download the file as well as recognize file conflicts that one has to merge manually and then resolve the conflict. Remote changes are recognized through a background download which runs at a fixed interval (default 5 minutes).

> Only WebDAV resources can be synchronized. If you configured your theme as a WAR file, then you will not be able to use this tool.

## Installation
1. Download and install node.js ([link](http://nodejs.org/))
 * On Linux please use the Node Version Manager (https://github.com/creationix/nvm) to install node.
2. Download the latest stable DXSync release [here](https://github.com/digexp/dxsync/blob/master/release/DXSyncCLI-1.0.0.zip?raw=true).
3. Unzip the file and run the following command in the unzipped directory
    * Linux/OSX
    `sudo ./install.sh`
    * Windows
    `install.cmd`
4. Done

## First Steps
After you successfully installed DXSync, you can start playing around with the default Portal 8.5 Theme. In order to do this ou need to:
1. Create a new local directory. Lets call this `/themedev`
2. Open a new command line and switch to this directory
   `cd /themedev`
3. Initialize the dxsync tool in this directory
   `dxsync init`
4. Follow the prompts and enter all information about your remote host.
5. Once done start the tool
   `dxsync run`
6. Since your local directory is empty the tool will download all files from the remote server to `/themedev`. After it is finished you can change the files locally in your favorite editor and the files will be automatically uploaded under the covers.

## Usage
DXSync is a command line tool that needs to be run from within the directory where you want to synchronize your sources to.
Open a terminal and change into this directoy. Calling 'dxsync' will print out a help screen that provides more information.
> If the command `dxsync` is not found, then you either did not install the tool globally or something went wrong during the installation. Please make sure it is installed globally or `dxsync` is part of your PATH.

There are 4 main commands available

 * init
    - Initializes the synchornization point inside of the current directoy. A series of prompts will query all necessary information and once done saves it in the `.settings` file.
 * run
     - This is the main command. Executes a full two way synchronization, watches files in the background and restarts a full sync every 5 minutes (configurable).
 * pull
     - Executes a one time pull (download) from the remote server. **Local changes are overwritten without question**
 * push
     - Executes a one time push (upload) from the remote server. **Remote changes are overwritten without question**

## Uninstall

Run the following command
`npm -g uninstall dxsync`

if you are not a root user you may have to run it like this:
`sudo npm -g uninstall dxsync`
