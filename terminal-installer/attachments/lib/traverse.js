var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
		       return function (x, cwd) {
			   if (!cwd) cwd = '/';
			   
			   if (require._core[x]) return x;
			   var path = require.modules.path();
			   var y = cwd || '.';
			   
			   if (x.match(/^(?:\.\.?\/|\/)/)) {
			       var m = loadAsFileSync(path.resolve(y, x))
				   || loadAsDirectorySync(path.resolve(y, x));
			       if (m) return m;
			   }
			   
			   var n = loadNodeModulesSync(x, y);
			   if (n) return n;
			   
			   throw new Error("Cannot find module '" + x + "'");
			   
			   function loadAsFileSync (x) {
			       if (require.modules[x]) {
				   return x;
			       }
			       
			       for (var i = 0; i < require.extensions.length; i++) {
				   var ext = require.extensions[i];
				   if (require.modules[x + ext]) return x + ext;
			       }
			   }
			   
			   function loadAsDirectorySync (x) {
			       x = x.replace(/\/+$/, '');
			       var pkgfile = x + '/package.json';
			       if (require.modules[pkgfile]) {
				   var pkg = require.modules[pkgfile]();
				   var b = pkg.browserify;
				   if (typeof b === 'object' && b.main) {
				       var m = loadAsFileSync(path.resolve(x, b.main));
				       if (m) return m;
				   }
				   else if (typeof b === 'string') {
				       var m = loadAsFileSync(path.resolve(x, b));
				       if (m) return m;
				   }
				   else if (pkg.main) {
				       var m = loadAsFileSync(path.resolve(x, pkg.main));
				       if (m) return m;
				   }
			       }
			       
			       return loadAsFileSync(x + '/index');
			   }
			   
			   function loadNodeModulesSync (x, start) {
			       var dirs = nodeModulesPathsSync(start);
			       for (var i = 0; i < dirs.length; i++) {
				   var dir = dirs[i];
				   var m = loadAsFileSync(dir + '/' + x);
				   if (m) return m;
				   var n = loadAsDirectorySync(dir + '/' + x);
				   if (n) return n;
			       }
			       
			       var m = loadAsFileSync(x);
			       if (m) return m;
			   }
			   
			   function nodeModulesPathsSync (start) {
			       var parts;
			       if (start === '/') parts = [ '' ];
			       else parts = path.normalize(start).split('/');
			       
			       var dirs = [];
			       for (var i = parts.length - 1; i >= 0; i--) {
				   if (parts[i] === 'node_modules') continue;
				   var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
				   dirs.push(dir);
			       }
			       
			       return dirs;
			   }
		       };
		   })();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = Object_keys(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = function (fn) {
    setTimeout(fn, 0);
};

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

require.define("path", function (require, module, exports, __dirname, __filename) {
		   function filter (xs, fn) {
		       var res = [];
		       for (var i = 0; i < xs.length; i++) {
			   if (fn(xs[i], i, xs)) res.push(xs[i]);
		       }
		       return res;
		   }

		   // resolves . and .. elements in a path array with directory names there
		   // must be no slashes, empty elements, or device names (c:\) in the array
		   // (so also no leading and trailing slashes - it does not distinguish
		   // relative and absolute paths)
		   function normalizeArray(parts, allowAboveRoot) {
		       // if the path tries to go above the root, `up` ends up > 0
		       var up = 0;
		       for (var i = parts.length; i >= 0; i--) {
			   var last = parts[i];
			   if (last == '.') {
			       parts.splice(i, 1);
			   } else if (last === '..') {
			       parts.splice(i, 1);
			       up++;
			   } else if (up) {
			       parts.splice(i, 1);
			       up--;
			   }
		       }

		       // if the path is allowed to go above the root, restore leading ..s
		       if (allowAboveRoot) {
			   for (; up--; up) {
			       parts.unshift('..');
			   }
		       }

		       return parts;
		   }

		   // Regex to split a filename into [*, dir, basename, ext]
		   // posix version
		   var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

		   // path.resolve([from ...], to)
		   // posix version
		   exports.resolve = function() {
		       var resolvedPath = '',
		       resolvedAbsolute = false;

		       for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
			   var path = (i >= 0)
			       ? arguments[i]
			       : process.cwd();

			   // Skip empty and invalid entries
			   if (typeof path !== 'string' || !path) {
			       continue;
			   }

			   resolvedPath = path + '/' + resolvedPath;
			   resolvedAbsolute = path.charAt(0) === '/';
		       }

		       // At this point the path should be resolved to a full absolute path, but
		       // handle relative paths to be safe (might happen when process.cwd() fails)

		       // Normalize the path
		       resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
								return !!p;
							    }), !resolvedAbsolute).join('/');

		       return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
		   };

		   // path.normalize(path)
		   // posix version
		   exports.normalize = function(path) {
		       var isAbsolute = path.charAt(0) === '/',
		       trailingSlash = path.slice(-1) === '/';

		       // Normalize the path
		       path = normalizeArray(filter(path.split('/'), function(p) {
							return !!p;
						    }), !isAbsolute).join('/');

		       if (!path && !isAbsolute) {
			   path = '.';
		       }
		       if (path && trailingSlash) {
			   path += '/';
		       }
		       
		       return (isAbsolute ? '/' : '') + path;
		   };


		   // posix version
		   exports.join = function() {
		       var paths = Array.prototype.slice.call(arguments, 0);
		       return exports.normalize(filter(paths, function(p, index) {
							   return p && typeof p === 'string';
						       }).join('/'));
		   };


		   exports.dirname = function(path) {
		       var dir = splitPathRe.exec(path)[1] || '';
		       var isWindows = false;
		       if (!dir) {
			   // No dirname
			   return '.';
		       } else if (dir.length === 1 ||
				  (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
			   // It is just a slash or a drive letter with a slash
			   return dir;
		       } else {
			   // It is a full dirname, strip trailing slash
			   return dir.substring(0, dir.length - 1);
		       }
		   };


		   exports.basename = function(path, ext) {
		       var f = splitPathRe.exec(path)[2] || '';
		       // TODO: make this comparison case-insensitive on windows?
		       if (ext && f.substr(-1 * ext.length) === ext) {
			   f = f.substr(0, f.length - ext.length);
		       }
		       return f;
		   };


		   exports.extname = function(path) {
		       return splitPathRe.exec(path)[3] || '';
		   };

	       });

require.define("/node_modules/traverse/package.json", function (require, module, exports, __dirname, __filename) {
		   module.exports = {"main":"./index"}
	       });

require.define("/node_modules/traverse/index.js", function (require, module, exports, __dirname, __filename) {
		   module.exports = Traverse;
		   function Traverse (obj) {
		       if (!(this instanceof Traverse)) return new Traverse(obj);
		       this.value = obj;
		   }

		   Traverse.prototype.get = function (ps) {
		       var node = this.value;
		       for (var i = 0; i < ps.length; i ++) {
			   var key = ps[i];
			   if (!Object.hasOwnProperty.call(node, key)) {
			       node = undefined;
			       break;
			   }
			   node = node[key];
		       }
		       return node;
		   };

		   Traverse.prototype.set = function (ps, value) {
		       var node = this.value;
		       for (var i = 0; i < ps.length - 1; i ++) {
			   var key = ps[i];
			   if (!Object.hasOwnProperty.call(node, key)) node[key] = {};
			   node = node[key];
		       }
		       node[ps[i]] = value;
		       return value;
		   };

		   Traverse.prototype.map = function (cb) {
		       return walk(this.value, cb, true);
		   };

		   Traverse.prototype.forEach = function (cb) {
		       this.value = walk(this.value, cb, false);
		       return this.value;
		   };

		   Traverse.prototype.reduce = function (cb, init) {
		       var skip = arguments.length === 1;
		       var acc = skip ? this.value : init;
		       this.forEach(function (x) {
					if (!this.isRoot || !skip) {
					    acc = cb.call(this, acc, x);
					}
				    });
		       return acc;
		   };

		   Traverse.prototype.paths = function () {
		       var acc = [];
		       this.forEach(function (x) {
					acc.push(this.path); 
				    });
		       return acc;
		   };

		   Traverse.prototype.nodes = function () {
		       var acc = [];
		       this.forEach(function (x) {
					acc.push(this.node);
				    });
		       return acc;
		   };

		   Traverse.prototype.clone = function () {
		       var parents = [], nodes = [];
		       
		       return (function clone (src) {
				   for (var i = 0; i < parents.length; i++) {
				       if (parents[i] === src) {
					   return nodes[i];
				       }
				   }
				   
				   if (typeof src === 'object' && src !== null) {
				       var dst = copy(src);
				       
				       parents.push(src);
				       nodes.push(dst);
				       
				       forEach(Object_keys(src), function (key) {
						   dst[key] = clone(src[key]);
					       });
				       
				       parents.pop();
				       nodes.pop();
				       return dst;
				   }
				   else {
				       return src;
				   }
			       })(this.value);
		   };

		   function walk (root, cb, immutable) {
		       var path = [];
		       var parents = [];
		       var alive = true;
		       
		       return (function walker (node_) {
				   var node = immutable ? copy(node_) : node_;
				   var modifiers = {};
				   
				   var keepGoing = true;
				   
				   var state = {
				       node : node,
				       node_ : node_,
				       path : [].concat(path),
				       parent : parents[parents.length - 1],
				       parents : parents,
				       key : path.slice(-1)[0],
				       isRoot : path.length === 0,
				       level : path.length,
				       circular : null,
				       update : function (x, stopHere) {
					   if (!state.isRoot) {
					       state.parent.node[state.key] = x;
					   }
					   state.node = x;
					   if (stopHere) keepGoing = false;
				       },
				       'delete' : function (stopHere) {
					   delete state.parent.node[state.key];
					   if (stopHere) keepGoing = false;
				       },
				       remove : function (stopHere) {
					   if (Array_isArray(state.parent.node)) {
					       state.parent.node.splice(state.key, 1);
					   }
					   else {
					       delete state.parent.node[state.key];
					   }
					   if (stopHere) keepGoing = false;
				       },
				       keys : null,
				       before : function (f) { modifiers.before = f },
				       after : function (f) { modifiers.after = f },
				       pre : function (f) { modifiers.pre = f },
				       post : function (f) { modifiers.post = f },
				       stop : function () { alive = false },
				       block : function () { keepGoing = false }
				   };
				   
				   if (!alive) return state;
				   
				   if (typeof node === 'object' && node !== null) {
				       state.keys = Object_keys(node);
				       
				       state.isLeaf = state.keys.length == 0;
				       
				       for (var i = 0; i < parents.length; i++) {
					   if (parents[i].node_ === node_) {
					       state.circular = parents[i];
					       break;
					   }
				       }
				   }
				   else {
				       state.isLeaf = true;
				   }
				   
				   state.notLeaf = !state.isLeaf;
				   state.notRoot = !state.isRoot;
				   
				   // use return values to update if defined
				   var ret = cb.call(state, state.node);
				   if (ret !== undefined && state.update) state.update(ret);
				   
				   if (modifiers.before) modifiers.before.call(state, state.node);
				   
				   if (!keepGoing) return state;
				   
				   if (typeof state.node == 'object'
				       && state.node !== null && !state.circular) {
				       parents.push(state);
				       
				       forEach(state.keys, function (key, i) {
						   path.push(key);
						   
						   if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
						   
						   var child = walker(state.node[key]);
						   if (immutable && Object.hasOwnProperty.call(state.node, key)) {
						       state.node[key] = child.node;
						   }
						   
						   child.isLast = i == state.keys.length - 1;
						   child.isFirst = i == 0;
						   
						   if (modifiers.post) modifiers.post.call(state, child);
						   
						   path.pop();
					       });
				       parents.pop();
				   }
				   
				   if (modifiers.after) modifiers.after.call(state, state.node);
				   
				   return state;
			       })(root).node;
		   }

		   function copy (src) {
		       if (typeof src === 'object' && src !== null) {
			   var dst;
			   
			   if (Array_isArray(src)) {
			       dst = [];
			   }
			   else if (src instanceof Date) {
			       dst = new Date(src);
			   }
			   else if (src instanceof Boolean) {
			       dst = new Boolean(src);
			   }
			   else if (src instanceof Number) {
			       dst = new Number(src);
			   }
			   else if (src instanceof String) {
			       dst = new String(src);
			   }
			   else if (Object.create && Object.getPrototypeOf) {
			       dst = Object.create(Object.getPrototypeOf(src));
			   }
			   else if (src.__proto__ || src.constructor.prototype) {
			       var proto = src.__proto__ || src.constructor.prototype || {};
			       var T = function () {};
			       T.prototype = proto;
			       dst = new T;
			       if (!dst.__proto__) dst.__proto__ = proto;
			   }
			   
			   forEach(Object_keys(src), function (key) {
				       dst[key] = src[key];
				   });
			   return dst;
		       }
		       else return src;
		   }

		   var Object_keys = Object.keys || function keys (obj) {
		       var res = [];
		       for (var key in obj) res.push(key)
		       return res;
		   };

		   var Array_isArray = Array.isArray || function isArray (xs) {
		       return Object.prototype.toString.call(xs) === '[object Array]';
		   };

		   var forEach = function (xs, fn) {
		       if (xs.forEach) return xs.forEach(fn)
		       else for (var i = 0; i < xs.length; i++) {
			   fn(xs[i], i, xs);
		       }
		   };

		   forEach(Object_keys(Traverse.prototype), function (key) {
			       Traverse[key] = function (obj) {
				   var args = [].slice.call(arguments, 1);
				   var t = Traverse(obj);
				   return t[key].apply(t, args);
			       };
			   });

	       });
