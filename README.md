# Beanstalk

Beanstalk is an HTML5 game designed to improve the output of OCR (Ocular Character Recognition) software.

## Installation
To get Beanstalk running properly, you first need to set up the backend server, which can be found [here](https://github.com/tiltfactor/SmorballBeanstalk-Backend). 

Once the server has been installed, clone the Beanstalk repository.
```bash
$ git clone https://github.com/tiltfactor/beanstalk.git
```

Copy the config template to `beanstalk config.json`.
```bash
$ cd beanstalk/src/Beanstalk/wwwroot/data
$ cp beanstalk\ config\ EXAMPLE.json beanstalk\ config.json
```
Now, edit the marked lines in the config file to point to your backend server. Don't forget to remove the header comment or the game will not run.

Beanstalk is now ready to play! The webroot can be found at `src/Beanstalk/wwwroot`.

## Development
Beanstalk was originally developed in TypeScript, but is now being maintained directly in JavaScript. Be careful if compiling the TypeScript files, as this could overwrite the modified JavaScript files.
