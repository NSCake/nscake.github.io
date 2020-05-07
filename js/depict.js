//
//  depict.js
//  nscake.github.io
//  
//  Created by Tanner Bennett on 2020-05-04
//  Copyright © 2020 Tanner Bennett. All rights reserved.
//

function whenDocumentReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

String.prototype.parentPath = function() {
    const components = this.split('/');
    components.pop();
    return components.join('/');
}

function buildDepictionURL(package) {
    const l = window.location;
    const endpoint = '/depictions/' + package + '.json';

    if (l.protocol === 'file:') {
        return l.protocol + '//' + l.pathname.parentPath() + endpoint;
    } else {
        return l.protocol + '//' + l.host + endpoint;
    }
}

function loadDepiction(path, success, error) {
    const request = new XMLHttpRequest();
    request.open('GET', path);
    request.onload = function() {
        if (this.status == 200) {
            const json = JSON.parse(this.response);
            if (json) {
                success(json);
            } else {
                error("Invaild depiction format. Please contact the developer.");
                console.log(this.response);
            }
        } else {
            error(this.status);
        }
    };

    request.send();
}

const args = new URLSearchParams(window.location.search);
const package = args.get('package');

if (!package) {
    window.location = 'index.html';
}

const depictionURL = buildDepictionURL(package);

whenDocumentReady(function() {
    // Hide these for now
    document.getElementById('changelog').hidden = true;
    document.getElementById('dependencies').hidden = true;

    // Hide tweak name within package managers
    if (navigator.userAgent.includes('Cydia')) {
        document.getElementById('tweak-name').hidden = true;
    }
});

loadDepiction(depictionURL, function(json) {
    whenDocumentReady(function() {
        document.getElementById('tweak-name').textContent = json.name;
        document.getElementById('depiction').textContent = json.depiction;

        if (json.depends) {
            document.getElementById('dependencies').hidden = false;
            document.getElementById('dependencies-list').textContent = json.depends;
        }
        if (json.changelog) {
            document.getElementById('changelog').hidden = false;
            document.getElementById('changelog-list').textContent = json.changelog;
        }
    });
}, function(status) {
    whenDocumentReady(function() {
        const message = 'Could not load depiction for package "' + package + '"';
        document.getElementById('tweak-name').textContent = String(status);
        document.getElementById('depiction').textContent = message;
    });
});
