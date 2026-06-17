// Dynamic routing configuration to generate unblocked standalone windows
window.proxyConfig = {
    prefix: '/service?url=',
    encodeUrl: function(url) {
        return encodeURIComponent(url);
    },
    launchNewWindow: function(targetUrl) {
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        // Creates an unblocked isolated browser window context
        const proxyUrl = window.location.origin + this.prefix + this.encodeUrl(targetUrl);
        const win = window.open('about:blank', '_blank');
        
        if (!win || win.closed) {
            // Fallback if the school browser blocks popups completely
            window.location.href = proxyUrl;
            return;
        }
        
        // Injects the proxy stream cleanly into the fresh tab page wrapper
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        const iframe = win.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = proxyUrl;
        win.document.body.appendChild(iframe);
    }
};
