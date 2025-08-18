module.exports = {
    babel: {
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '~': './src',
                    },
                },
            ],
        ],
    },
};
