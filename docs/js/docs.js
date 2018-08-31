/* global window, document, console, GlslCanvas, Swiper, TweenLite */

(function () {
    'use strict';

    Element.prototype.hasClass = function (name) {
        return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
    };

    Element.prototype.addClass = function (name) {
        if (!this.hasClass(name)) {
            this.className = this.className ? (this.className + ' ' + name) : name;
        }
    };

    Element.prototype.removeClass = function (name) {
        if (this.hasClass(name)) {
            this.className = this.className.split(name).join('').replace(/\s\s+/g, ' '); // .replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    };

}());
/* global window, document, console, TweenLite, TweenMax, Elastic */

(function () {
    'use strict';

    function addClouds() {
        var cloudGroup = document.querySelector('.cloud-group');
        var cloud = document.querySelector('.cloud');
        var clouds = [cloud];
        while (clouds.length < 5) {
            var cloned = cloud.cloneNode(true);
            clouds.push(cloned);
        }
        var colors = ['#EDEEEE', '#EFFAFF', '#F5F8EA'];
        clouds.forEach(function (item, i) {
            TweenMax.set(item, {
                fill: colors[i % colors.length]
            });
            cloudGroup.appendChild(item);
        });
        return clouds;
    }

    function tweenCloud(item, i) {
        if (item.data && item.data.to) {
            clearTimeout(item.data.to);
        }
        item.data = {
            scaleFrom: 0.5 + (0.7 * Math.random()),
            scaleTo: 0.5 + (0.7 * Math.random()),
            translateXFrom: -100 + (200 * Math.random()),
            translateXTo: -100 + (200 * Math.random()),
            translateY: -10 + (20 * Math.random()),
        };
        TweenMax.set(item, {
            opacity: 0,
            transform: 'translateX(' + item.data.translateXFrom + '%) translateY(' + item.data.translateY + '%) scale(' + item.data.scaleFrom + ')',
        });
        setTimeout(function () {
            TweenMax.to(item, Math.abs(item.data.translateXFrom - item.data.translateXTo) / 5, {
                opacity: 1,
                transform: 'translateX(' + item.data.translateXTo + '%) translateY(' + item.data.translateY + '%) scale(' + item.data.scaleTo + ')',
                ease: Power2.easeOut,
                delay: 1.0 * i,
                overwrite: 'all',
                onComplete: function () {
                    TweenMax.to(item, 0.35, {
                        opacity: 0,
                        onComplete: function () {
                            tweenCloud(item, i);
                        },
                    });
                },
            });
        }, 1);
    }

    function addTrees() {
        var treeGroup = document.querySelector('.tree-group');
        var tree = document.querySelector('.tree');
        var trees = [tree];

        while (trees.length < 30) {
            var cloned = tree.cloneNode(true);
            trees.push(cloned);
        }
        trees.forEach(function (item, i) {
            treeGroup.appendChild(item);
        });
        return trees;
    }

    function tweenTree(item, i) {
        if (item.data && item.data.to) {
            clearTimeout(item.data.to);
        }
        item.data = {
            scale: 0.5 + (0.5 * Math.random()),
            rotateZ: 360 * Math.random(),
            translateY: -(20 + (15 * Math.random())),
        };
        TweenMax.set(item, {
            zIndex: 5000 - Math.round(item.data.translateY * -10),
            opacity: 1,
            transform: 'rotateZ(' + item.data.rotateZ + 'deg) translateY(' + item.data.translateY + 'vw) scale(' + 0 + ')',
        });
        item.data.to = setTimeout(function () {
            TweenMax.to(item, 2.0, {
                transform: 'rotateZ(' + item.data.rotateZ + 'deg) translateY(' + item.data.translateY + 'vw) scale(' + item.data.scale + ')',
                ease: Elastic.easeOut.config(1, 0.3),
                delay: 0.1 * i,
                overwrite: 'all',
            });
            item.data.to = setTimeout(function () {
                TweenMax.to(item, 0.35, {
                    opacity: 0,
                    onComplete: function () {
                        tweenTree(item, i);
                    },
                });
            }, 5000 + 200 * i);
        }, 1);
    }

    var clouds = addClouds();

    clouds.forEach(function (item, i) {
        tweenCloud(item, i);
    });

    var trees = addTrees();

    function onResize() {
        trees.forEach(function (item, i) {
            tweenTree(item, i);
        });
    }

    window.addEventListener('resize', onResize);

    onResize();

    function setOverlay() {
        var formGroup = document.querySelector('.form-group-overlay');
        var overlay = document.querySelector('.overlay');
        var cloudGroup = document.querySelector('.cloud-group');

        function updateOverlay() {
            TweenMax.set(overlay, {
                transform: 'translateY(' + (formGroup.offsetTop + 30) + 'px)',
            });
            TweenMax.set(cloudGroup, {
                transform: 'translateY(' + (formGroup.offsetTop + 50) + 'px)',
            });
            window.requestAnimationFrame(updateOverlay);
        }
        updateOverlay();
    }

    // setOverlay();

    var main = document.querySelector('main');

    var active = false;

    var btn = document.querySelectorAll('.btn-cta');
    btn.forEach(function (item) {
        item.addEventListener('click', onClick);
    });

    function onClick() {
        active = !active;
        main.setAttribute('class', active ? 'step-1' : 'step-2');
        setTimeout(function () {
            main.setAttribute('class', active ? 'step-2' : 'step-1');
            setTimeout(function () {
                main.setAttribute('class', active ? 'step-2 enter' : 'step-1 enter');
            }, 500);
        }, 500);
        // btn.removeEventListener('click', onClick);        
    }

    setTimeout(function () {
        main.setAttribute('class', 'step-1 enter');
    }, 500);

}());