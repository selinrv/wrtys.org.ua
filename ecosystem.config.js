module.exports = {
    apps: [{
        name: 'wrtysApp',
        // Turbopack can't run on this host (its native binary won't load, so Next
        // falls back to the WASM compiler), hence the explicit --webpack.
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3000',
        cwd: '/home/admin/domains/wrtys.org.ua/public_html',
        error_file: '/home/admin/domains/wrtys.org.ua/public_html/nextapp-error.log',
        out_file: '/home/admin/domains/wrtys.org.ua/public_html/nextapp-out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
    }]
}
