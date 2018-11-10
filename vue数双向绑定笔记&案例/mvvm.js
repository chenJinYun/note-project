(function () { //代码处于局部，而非全局
    let MVVM = function (options) { //MVVM雏形
        // 监听属性和拦截对象赋值和取值操作，Observer
        // 解析DOM，提取元素中间的指令和占位符，Compiler
        // 低耦合：功能代码区分开来
        // compiler和Observer所观察的对象连接起来，（setInter/setTimeout）
        // 当OBserver观察的对象发生改变，接收通知，同时更新dom操作,Watcher
        // 入口：vue的入口（MVVM）

        /*
            data数据代理到vm实例的原理：
                1.实现：也是使用了Object.defineProperty
                2.在实例化vue实例的时候添加一个属性代理的方法，使访问vm的属性代理为访问vm._data的属性
                3.其实就是在使用this.key取数据的时候，内部调用的是this.data[key]，实质还是取得是data里面的数据，只是为了使用者方便，使用了以假乱真的方式
            e.g:
            MVVM.prototype._proxy = function (data) {
                let self = this;
                // Object.defineProperty
                for (let key in data) {
                    (function (key) {
                        Object.defineProperty(self, key, {
                            get: function () {
                                return data[key];
                            },
                            set: function (newVal) { //新的设置的值
                                data[key] = newVal;
                            }
                        })
                    })(key)

                }
            }         
        */


        /*
            Observer理解：
                1.实现原理：初始化vue实例的时候，监听data的属性，如果属性是对象则递归的监听这个对象的子属性，注意：针对的是初始化的时候就有的属性，否则是没有加入Observer的监听队列的
                2.
        */


        /* 注意点：因为vue的observer在初始化监听的时候，
            只监听到data.any这一层，
            如果any是一个对象，
            那么这个对象的属性在初始化的时候是没有监听到的，
            所以只是any对象的属性发生了改变的话，
            并没有触发observer的监听，
            此时的数据双向绑定就会失效
            对此，
            1、vue官方给出的解决措施是使用vue.set()方法更改对象的属性值，这样才能触发observer的监听，实现数据的双向绑定

            2、或者是重新给这个对象赋值，
                原理:触发了observer，observer会递归的监听这个对象的子属性，也就实现了双向数据绑定
        */
        this.$data = options.data;
        this.$el = options.el;
        this._proxy(options.data);
        this._proxy(options.methods);
        observer(this.$data)

        new Compile(this.$el,this);
    }


    // 中控台：独立方法/构造器函数
    // 遍历data和methods的key把data上的属性代理到VM实例上
    MVVM.prototype._proxy = function (data) {
        let self = this;
        // Object.defineProperty
        for (let key in data) {
            (function (key) {
                Object.defineProperty(self, key, {
                    get: function () {
                        return data[key];
                    },
                    set: function (newVal) { //新的设置的值
                        data[key] = newVal;
                    }
                })
            })(key)

        }
    }
    // 不建议
    function isObject(obj) {
        return obj != null && typeof (obj) == 'object';
    }

    function isPlainObject(obj) {
        return Object.prototype.toString(obj) == '[object Object]'
    }

    function observer(data) {
        if (!isObject(data) || !isPlainObject(data)) {
            return;
        }
        return new Observer(data);
    }

    let Observer = function (data) {
        this.data = data;
        this.transform(data);
    }

    // Observer
    Observer.prototype.transform = function (data) {
        for (let key in data) {
            this.defineReactive(data, key, data[key]);
        }
    }

    //监听属性，当发生改变的时候，需要发出通知
    Observer.prototype.defineReactive = function (data, key, val) {
        let dep = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true, //可枚举
            configurable: false, //不能再define
            get: function () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function (newVal) {
                if (newVal == val) {
                    return;
                }
                val = newVal;
                // 监听子对象
                observer(newVal);
                // 发出通知
                dep.notify(newVal);
            }
        })
        observer(val);
    }

    // 存储subs通知对象，添加，循环输出
    // 发出通知
    let Dep = function () {
        this.subs = {}; //声明一个空的对象，一遍存储后期的通知
    }

    Dep.prototype.addSub = function (target) { //添加
        // 是否重复发出通知
        if (!this.subs[target.uid]) {
            this.subs[target.uid] = target;
        }
    }

    Dep.prototype.notify = function (newVal) { //发出通知
        for (let uid in this.subs) {
            this.subs[uid].update(newVal)
        }
    }

    Dep.target = null;

    // Wathcer
    function Watcher(vm, expOrFn, cb) {
        this.cb = cb;
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.depIds = {};

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }

        this.value = this.get();
    }

    Watcher.prototype = {
        update: function () {
            this.run();
        },
        run: function () {
            var value = this.get();
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.vm, value, oldVal);
            }
        },
        addDep: function (dep) {
            // 1. 每次调用run()的时候会触发相应属性的getter
            // getter里面会触发dep.depend()，继而触发这里的addDep
            // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
            // 则不需要将当前watcher添加到该属性的dep里
            // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
            // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
            // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
            // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
            // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
            // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
            // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
            // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
            // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
            // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
            if (!this.depIds.hasOwnProperty(dep.id)) {
                dep.addSub(this);
                this.depIds[dep.id] = dep;
            }
        },
        get: function () {
            Dep.target = this;
            var value = this.getter.call(this.vm, this.vm);
            Dep.target = null;
            return value;
        },

        parseGetter: function (exp) {
            if (/[^\w.$]/.test(exp)) return;

            var exps = exp.split('.');

            return function (obj) {
                for (var i = 0, len = exps.length; i < len; i++) {
                    if (!obj) return;
                    obj = obj[exps[i]];
                }
                return obj;
            }
        }
    };
    // Compiler:更新Dom操作
    function Compile(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }

    Compile.prototype = {
        node2Fragment: function (el) {
            var fragment = document.createDocumentFragment(),
                child;

            // 将原生节点拷贝到fragment
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }

            return fragment;
        },

        init: function () {
            this.compileElement(this.$fragment);
        },

        compileElement: function (el) {
            var childNodes = el.childNodes,
                me = this;

            [].slice.call(childNodes).forEach(function (node) {
                var text = node.textContent;
                var reg = /\{\{(.*)\}\}/;

                if (me.isElementNode(node)) {
                    me.compile(node);

                } else if (me.isTextNode(node) && reg.test(text)) {
                    me.compileText(node, RegExp.$1);
                }

                if (node.childNodes && node.childNodes.length) {
                    me.compileElement(node);
                }
            });
        },

        compile: function (node) {
            var nodeAttrs = node.attributes,
                me = this;

            [].slice.call(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (me.isDirective(attrName)) {
                    var exp = attr.value;
                    var dir = attrName.substring(2);
                    // 事件指令
                    if (me.isEventDirective(dir)) {
                        compileUtil.eventHandler(node, me.$vm, exp, dir);
                        // 普通指令
                    } else {
                        compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                    }

                    node.removeAttribute(attrName);
                }
            });
        },

        compileText: function (node, exp) {
            compileUtil.text(node, this.$vm, exp);
        },

        isDirective: function (attr) {
            return attr.indexOf('v-') == 0;
        },

        isEventDirective: function (dir) {
            return dir.indexOf('on') === 0;
        },

        isElementNode: function (node) {
            return node.nodeType == 1;
        },

        isTextNode: function (node) {
            return node.nodeType == 3;
        }
    };

    // 指令处理集合
    var compileUtil = {
        text: function (node, vm, exp) {
            this.bind(node, vm, exp, 'text');
        },

        html: function (node, vm, exp) {
            this.bind(node, vm, exp, 'html');
        },

        model: function (node, vm, exp) {
            this.bind(node, vm, exp, 'model');

            var me = this,
                val = this._getVMVal(vm, exp);
            node.addEventListener('input', function (e) {
                var newValue = e.target.value;
                if (val === newValue) {
                    return;
                }

                me._setVMVal(vm, exp, newValue);
                val = newValue;
            });
        },

        class: function (node, vm, exp) {
            this.bind(node, vm, exp, 'class');
        },

        bind: function (node, vm, exp, dir) {
            var updaterFn = updater[dir + 'Updater'];

            updaterFn && updaterFn(node, this._getVMVal(vm, exp));

            new Watcher(vm, exp, function (value, oldValue) {
                updaterFn && updaterFn(node, value, oldValue);
            });
        },

        // 事件处理
        eventHandler: function (node, vm, exp, dir) {
            var eventType = dir.split(':')[1],
                fn = vm.$options.methods && vm.$options.methods[exp];

            if (eventType && fn) {
                node.addEventListener(eventType, fn.bind(vm), false);
            }
        },

        _getVMVal: function (vm, exp) {
            var val = vm;
            exp = exp.split('.');
            exp.forEach(function (k) {
                val = val[k];
            });
            return val;
        },

        _setVMVal: function (vm, exp, value) {
            var val = vm;
            exp = exp.split('.');
            exp.forEach(function (k, i) {
                // 非最后一个key，更新val的值
                if (i < exp.length - 1) {
                    val = val[k];
                } else {
                    val[k] = value;
                }
            });
        }
    };


    var updater = {
        textUpdater: function (node, value) {
            node.textContent = typeof value == 'undefined' ? '' : value;
        },

        htmlUpdater: function (node, value) {
            node.innerHTML = typeof value == 'undefined' ? '' : value;
        },

        classUpdater: function (node, value, oldValue) {
            var className = node.className;
            className = className.replace(oldValue, '').replace(/\s$/, '');

            var space = className && String(value) ? ' ' : '';

            node.className = className + space + value;
        },

        modelUpdater: function (node, value, oldValue) {
            node.value = typeof value == 'undefined' ? '' : value;
        }
    };
    window.MVVM = MVVM;

    // 学习网站：https://segmentfault.com/a/1190000006599500
})()