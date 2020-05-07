//
//  depict.js
//  nscake.github.io
//  
//  Created by Tanner Bennett on 2020-05-04
//  Copyright © 2020 Tanner Bennett. All rights reserved.
//

String.prototype.parentPath = function() {
    const components = this.split('/');
    components.pop();
    return components.join('/');
}

function buildDepictionURL(package, extension) {
    const l = window.location;
    const endpoint = '/depictions/' + package + '.html';

    if (l.protocol === 'file:') {
        return l.protocol + '//' + l.pathname.parentPath() + endpoint;
    } else {
        return l.protocol + '//' + l.host + endpoint;
    }
}

const args = new URLSearchParams(window.location.search);
const package = args.get('package');

if (!package) {
    window.location = 'index.html';
}

const htmlDepiction = buildDepictionURL(package, '.html');
const textDepiction = buildDepictionURL(package, '.txt');

function loadDepiction(path, success, error) {
    const request = new XMLHttpRequest();
    request.open('GET', path);
    request.onprogress = function() {
        if (request.status == 200) {
            success();
        } else {
            error();
        }
    };

    request.send();
}

loadDepiction(htmlDepiction, function() {
    console.log(client.responseText);
}, function() {
    loadDepiction(textDepiction, function() {
        console.log(client.responseText);
    }, function() {
        console.log('Could not find depiction for package "' + package + '"');
        console.log('Redirecting...');
        window.location = '404.html';
    });
});