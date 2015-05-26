
## Installation from source
1. Download and install node.js ([link](http://nodejs.org/))
2. If you have the sources already downloaded and extracted locally you can run this command:

    `npm -g install`

    > You need to run this from the directory that contains the downloaded sources

3. Otherwise if you need to download the sources as well you can use this command:

    `npm -g install git+ssh://git@git.design.ibm.com:stephan.hesmer/themesync.git`

    > This will cause node to download everything, compile all dependency and makes DXSync globally available.
    > 
    > Please note: Run this command on Linux as sudo

4. Done

## Compile binaries from source
If you receive a message similar to the following, you have two choices:
1. Use the tool without the background watching capabilities
2. Compile the tool from source as your platform doesn't exist in a pre-compiled fashion.

    Unable to watch files due to missing pathwatcher module. Install the module from source without the --no-optional flag.
    Please provide feedback to the author of this module about the missing pre-compiled dependencies.
    Your system information: win32 (Platform) / ia32 (Architecture)