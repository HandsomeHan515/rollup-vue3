const execa = require('execa')

const target = 'runtime-dom'

async function build (target) {
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}

build(target)
