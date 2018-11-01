# lazerpath
LazerPath helps you to quickly create your project structure and fill it with predefined templates.

LazerPath should be installed globally
```
$ npm i -g lazerpath
```

Options:
```
  -v, --version  output the version number
  -t, --test     test your paths, no file or folder will be created
  -h, --help     output usage information
```


You'll need to add a **lazerpath.config.js** file into the folder you want to process.

### Basic Example  

Assuming you are into the src folder of a React project,  
create a lazerpath.config.js file with the following content.
```
exports.paths = {
    '/components': {
        '/Header': {
            'Header.js' : '',
            'Header.css': '',
            '/Nav'      : {
                'Nav.js' : '',
                'Nav.css': ''
            }
        },
        '/Main'  : {
            'Main.js' : '',
            'Main.css': ''
        },
        '/Footer': {
            'Footer.js' : '',
            'Footer.css': '',
        }
    },
    '/containers': {},
    '/hoc'       : {},
};
```
Then run the command "lazerpath" from the terminal,  
![](https://boardvsgame.com/lazerpath/terminal.png)

and you'll get the following structure:  
![](https://boardvsgame.com/lazerpath/basicexample.png)

If you try to run the command again you'll get the following messages:
![](https://boardvsgame.com/lazerpath/alreadyexists.png)


  
Rules are so simple:  
A folder name must always starts with a slash and it must be an object.  
An empty object will produce an empty folder.

```
Valid folder:   '/components': {}
Invalid folder: 'components': {}
```

A folder can contain files or other folders
```
'/Header': {
    'Header.js' : '',
    'Header.css': '',
    '/Nav'      : {
        'Nav.js' : '',
        'Nav.css': ''
    }
}
```

A file can be empty
```
'Header.js' : ''
```

Or you can fill it
```
'Header.js' : 'const my_var = "My Awesome Var";'
```

You can assign a template to a file
```
const fs = require('fs');
const mytemplate = fs.readFileSync('/path/to/template/', 'utf8');

'Header.js' : mytemplate
```

You can also search and replace any part of a template  
Template:
```
import React, {Component} from 'react';
import './MY_COMPONENT.css';

class MY_COMPONENT extends Component {

    render () {
    
        return (
            <div>
                <h1>Title</h1>
            </div>
        );
    }
}

export default MY_COMPONENT;
```
lazerpath.config.js file:
```
const fs = require('fs');
const mytemplate = fs.readFileSync('/path/to/template/', 'utf8');

'/Nav': {
    'Nav.js' : [mytemplate, {
        'MY_COMPONENT': 'Nav',
        'Title'       : 'My Awesome Nav Title'
    }],
    'Nav.css': ''
}
```
Result:
```
import React, {Component} from 'react';
import './Nav.css';

class Nav extends Component {

    render () {
    
        return (
            <div>
                <h1>My Awesome Nav Title</h1>
            </div>
        );
    }
}

export default Nav;
```
Explanation:
```
'Nav.js' : [mytemplate, {
        'MY_COMPONENT': 'Nav',
        'Title'       : 'My Awesome Nav Title'
    }]
```
In this case the value for the ket 'Nav.js' is not a simple template but an array,  
the first array argument is the template file,
the second argument is an object where the keys are the parts to search, and the values te parts to replace.


### Advanced Example  
Here's a complete example

```
const fs = require('fs');
const mytemplate = fs.readFileSync('./template.js', 'utf8');

exports.paths = {
    '/components': {
        '/Header': {
            'Header.js' : mytemplate,
            'Header.css': '',
            '/Nav'      : {
                'Nav.js' : [mytemplate, {
                    'MY_COMPONENT': 'Nav',
                    'Title'       : 'Nav Title'
                }],
                'Nav.css': ''
            }
        },
        '/Main'  : {
            'Main.js' : [mytemplate, {
                'MY_COMPONENT': 'Main'
            }],
            'Main.css': ''
        },
        '/Footer': {
            'Footer.js' : [mytemplate, {
                'MY_COMPONENT': 'Footer',
            }],
            'Footer.css': '',
        }
    },
    '/containers': {},
    '/hoc'       : {}
};
```


### Test Mode
If you want to test your configuration file before to actually create the paths,  
use the command "lazerpath -t" or "lazerpath --test"   
![lazerpathterminaltest](https://boardvsgame.com/lazerpath/test.png)